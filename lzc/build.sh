#!/bin/sh
set -e

# ============================================================
# LZContr LazyCat 打包构建脚本
# 1. 动态写 package.yml 版本
# 2. 后端：server/ + 仅 express 生产依赖 + node 包装脚本（方案 B，运行时用容器内 node）
# 3. Vite 构建前端 dist/ 复制到 _lpk_content/frontend
# 4. 写 version.json 与 scripts/start.sh
# ============================================================

# 脚本所在目录（lzc/）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# 项目根目录
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 版本号：优先 LPK_VERSION 环境变量（剥离 v 前缀），其次 git tag，回退 package.json version
LPK_TAG="${LPK_VERSION:-}"
LPK_TAG="${LPK_TAG#v}"
VERSION="${LPK_TAG:-$(cd "$PROJECT_ROOT" && git describe --tags --abbrev=0 2>/dev/null | sed 's/^v//' || true)}"
if [ -z "$VERSION" ]; then
  VERSION=$(node -e "process.stdout.write(require('$PROJECT_ROOT/package.json').version)")
fi
VERSION="${VERSION:-1.0.0}"
echo "Building version: $VERSION"

# 动态写入 package.yml
cat > "$SCRIPT_DIR/package.yml" <<PKGEOF
package: cloud.lazycat.app.lzcontr
version: ${VERSION}
name: 懒猫合同生成器
description: 研发/销售合同与报价单条款填写与 Word 生成
author: sikenali
license: MIT
homepage: https://github.com/sikenali/lzcontr
min_os_version: 1.5.0
unsupported_platforms:
  - ios
locales:
  zh-CN:
    name: 懒猫合同生成器
    description: 研发/销售合同与报价单条款填写与 Word 生成
  en:
    name: LZContr
    description: R&D/sales contract and quotation generator with Word export
permissions:
  required:
    - net.internet
PKGEOF

# 清理旧产物
rm -rf "$SCRIPT_DIR/_lpk_content"
mkdir -p "$SCRIPT_DIR/_lpk_content/backend"

# 1. 后端：复制 server/ + 仅 express 生产依赖 + node 包装脚本
#    （方案 B：运行时用 LazyCat 容器内的 node 启动，lpk 显著缩小）
echo "Building backend (node + express deps)..."
cp -a "$PROJECT_ROOT/server/index.js" "$PROJECT_ROOT/server/db.js" "$PROJECT_ROOT/server/validate.js" "$SCRIPT_DIR/_lpk_content/backend/"
# 后端为 ESM，需 type:module（server/index.js 用 import）
echo '{"name":"lzcontr-backend","private":true,"type":"module"}' > "$SCRIPT_DIR/_lpk_content/backend/package.json"

# 仅安装 express 生产依赖（不含前端依赖 vue/docx 等）
STAGING="$(mktemp -d)"
echo '{"name":"lzcontr-backend-deps","private":true,"type":"module","dependencies":{"express":"^5.3.0"}}' > "$STAGING/package.json"
(
  cd "$STAGING" && npm install --omit=dev --no-audit --no-fund 2>&1 | tail -2
)
cp -a "$STAGING/node_modules" "$SCRIPT_DIR/_lpk_content/backend/node_modules"
rm -rf "$STAGING"

# exec 路由包装脚本：exec node index.js（保持 lzc-manifest.yml 的 exec 路由不变）
cat > "$SCRIPT_DIR/_lpk_content/backend/lzcontr" << 'WRAPPER'
#!/bin/sh
# LazyCat exec 路由执行此包装脚本；node 读取 PORT / LZCONTR_DATA_DIR（manifest environment）
exec node "$(dirname "$0")/index.js"
WRAPPER
chmod +x "$SCRIPT_DIR/_lpk_content/backend/lzcontr"

# 2. 前端：Vite 构建 dist/
echo "Building frontend (vite)..."
rm -rf "$PROJECT_ROOT/dist"
(
  cd "$PROJECT_ROOT" && npm run build
)
if [ ! -f "$PROJECT_ROOT/dist/index.html" ]; then
  echo "ERROR: frontend build failed, dist/index.html missing"
  exit 1
fi
mkdir -p "$SCRIPT_DIR/_lpk_content/frontend"
cp -a "$PROJECT_ROOT/dist/." "$SCRIPT_DIR/_lpk_content/frontend/"

# 3. 版本文件（供前端"关于"页面读取）
echo "{\"version\":\"${VERSION}\"}" > "$SCRIPT_DIR/_lpk_content/frontend/version.json"

# 4. 启动脚本（exec 后端单文件；数据目录在 manifest 的 LZCONTR_DATA_DIR）
mkdir -p "$SCRIPT_DIR/_lpk_content/scripts"
cat > "$SCRIPT_DIR/_lpk_content/scripts/start.sh" << 'STARTSCRIPT'
#!/bin/sh
set -e

mkdir -p /lzcapp/var/data /app/logs
chmod -R 777 /lzcapp/var/data || true

# 后端单文件读取 PORT 与 LZCONTR_DATA_DIR（来自 lzc-manifest.yml environment）
exec /lzcapp/pkg/content/backend/lzcontr >>/app/logs/backend.log 2>&1
STARTSCRIPT
chmod +x "$SCRIPT_DIR/_lpk_content/scripts/start.sh"

echo "Build complete: $SCRIPT_DIR/_lpk_content"
