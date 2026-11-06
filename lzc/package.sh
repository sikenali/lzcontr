#!/bin/bash
# ============================================================
# LZContr LazyCat 打包脚本：构建 _lpk_content → 生成 LPK → 版本化重命名
# 用法：cd lzc && bash package.sh   （或 LPK_VERSION=1.0.0 bash package.sh）
# ============================================================
set -euo pipefail

# 切换到脚本所在目录（lzc/），保证 lzc-build.yml / 相对路径正确
cd "$(dirname "$0")"

# 版本号：优先 LPK_VERSION，其次 git tag，回退 1.0.0
LPK_TAG="${LPK_VERSION:-}"
LPK_TAG="${LPK_TAG#v}"
if [ -z "$LPK_TAG" ]; then
  LPK_TAG=$(git -C "$(pwd)/.." describe --tags --abbrev=0 2>/dev/null | sed 's/^v//' || true)
fi
LPK_TAG="${LPK_TAG:-1.0.0}"
export LPK_VERSION="$LPK_TAG"
echo "Packaging version: $LPK_VERSION"

# 1. 运行 build.sh
bash ./build.sh

# 2. 调用 lzc-cli 生成 LPK
CLI_BIN="/usr/local/lib/node_modules/@lazycatcloud/lzc-cli/scripts/cli.js"
if [ ! -f "$CLI_BIN" ]; then
  CLI_BIN="/tmp/package/scripts/cli.js"
fi
echo "Using lzc-cli: $CLI_BIN"
node "$CLI_BIN" project release -o output.lpk

# 3. 重命名
LPK_NAME="cloud.lazycat.app.lzcontr-${LPK_TAG}.lpk"
if [ -f output.lpk ]; then
  mv -f output.lpk "$LPK_NAME"
  echo "Done: $LPK_NAME"
  ls -lh "$LPK_NAME"
fi
