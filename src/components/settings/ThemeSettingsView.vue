<template>
  <div class="theme-view">
    <!-- 外观主题 Card -->
    <div class="ui-card section-card">
      <div class="section-head">
        <span class="block-title">外观主题</span>
        <button class="btn-secondary reset-btn" @click="onReset">
          <RiRefreshLine size="16" />
          恢复默认
        </button>
      </div>
      <div class="theme-grid">
        <button
          class="theme-card"
          :class="{ active: theme.mode === 'light' }"
          @click="setMode('light')"
        >
          <span v-if="theme.mode === 'light'" class="check-badge"><RiCheckLine size="14" /></span>
          <div class="thumb" style="--t-bg: #f4f7fa">
            <div class="thumb-top"></div>
            <div class="thumb-body">
              <div class="thumb-block"></div>
              <div class="thumb-block"></div>
            </div>
          </div>
          <div class="theme-name">浅色·Light（冷白蓝灰）</div>
          <div class="theme-desc">当前默认，冷调科技底长时间阅读舒适</div>
        </button>
        <button
          class="theme-card"
          :class="{ active: theme.mode === 'dark' }"
          @click="setMode('dark')"
        >
          <span v-if="theme.mode === 'dark'" class="check-badge"><RiCheckLine size="14" /></span>
          <div class="thumb" style="--t-bg: #0a0f18">
            <div class="thumb-top"></div>
            <div class="thumb-body">
              <div class="thumb-block"></div>
              <div class="thumb-block"></div>
            </div>
          </div>
          <div class="theme-name">深色·Dark（深空）</div>
          <div class="theme-desc">夜间或暗光环境投标作业更护眼</div>
        </button>
      </div>
    </div>

    <!-- 6.3 强调色 Card -->
    <div class="ui-card section-card">
      <div class="section-head">
        <span class="block-title">强调色</span>
      </div>
      <div class="accent-row">
        <button
          v-for="(meta, key) in ACCENTS"
          :key="key"
          class="accent-item"
          @click="setAccent(key)"
        >
          <span
            class="accent-swatch"
            :class="{ active: theme.accent === key }"
            :style="{ background: meta.color }"
          >
            <RiCheckLine v-if="theme.accent === key" size="26" :color="meta.on" />
          </span>
          <span class="accent-name" :class="{ active: theme.accent === key }">{{ meta.name }}</span>
        </button>
      </div>
    </div>

    <!-- 6.4 布局切换 Card -->
    <div class="ui-card section-card">
      <div class="section-head">
        <span class="block-title">布局切换</span>
      </div>
      <div class="layout-grid">
        <button
          class="layout-card"
          :class="{ active: theme.layout === 'topbar' }"
          @click="setLayout('topbar')"
        >
          <span v-if="theme.layout === 'topbar'" class="check-badge"><RiCheckLine size="14" /></span>
          <div class="layout-mockup topbar">
            <div class="mock-nav"></div>
            <div class="mock-content">
              <div class="mock-line w60"></div>
              <div class="mock-line w80"></div>
              <div class="mock-line w70"></div>
            </div>
          </div>
          <div class="layout-name">顶栏模式·居中导航</div>
          <div class="layout-desc">六大模块在顶栏居中排布，右上角统一为返回与设置</div>
        </button>
        <button
          class="layout-card"
          :class="{ active: theme.layout === 'sidebar' }"
          @click="setLayout('sidebar')"
        >
          <span v-if="theme.layout === 'sidebar'" class="check-badge"><RiCheckLine size="14" /></span>
          <div class="layout-mockup sidebar">
            <div class="mock-side"></div>
            <div class="mock-main">
              <div class="mock-nav"></div>
              <div class="mock-content">
                <div class="mock-line w60"></div>
                <div class="mock-line w80"></div>
              </div>
            </div>
          </div>
          <div class="layout-name">侧边栏模式·左侧导航</div>
          <div class="layout-desc">六大模块在左侧竖列居中，顶栏不显示图标文字</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore, ACCENTS } from '../../stores/theme';
import { ElMessage } from '../../utils/toast';
import { RiCheckLine, RiRefreshLine } from '@remixicon/vue';

const theme = useThemeStore();

// §6.4: wujie 子应用内禁止 window.location.reload()
const IN_WUJIE = !!window.$wujie;

function setMode(mode) {
  theme.setMode(mode);
  ElMessage.success(mode === 'dark' ? '已切换为深色主题' : '已切换为浅色主题');
}
function setAccent(accent) {
  theme.setAccent(accent);
  ElMessage.success('强调色已更新');
}
function setLayout(layout) {
  theme.setLayout(layout);
  ElMessage.success(layout === 'topbar' ? '已切换为顶栏模式' : '已切换为侧边栏模式');
  // §6.4: 布局切换保存后 800ms 刷新页面生效；wujie 子应用内禁止 reload（销毁子应用 JS 上下文）
  if (!IN_WUJIE) setTimeout(() => window.location.reload(), 800);
}
function onReset() {
  theme.reset();
  ElMessage.success('已恢复默认设置');
}
</script>

<style scoped>
.theme-view {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 20px;
}
.reset-btn {
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
  flex-shrink: 0;
}

.section-card {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 外观主题 (Nebula：active 左侧电光青竖条 + 微透背景) */
.theme-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.theme-card {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px;
  text-align: left;
  background: var(--color-bg-secondary);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease), border-color var(--t-fast) var(--ease);
}
.theme-card:hover {
  border-color: rgba(var(--tech-cyan-rgb), 0.3);
}
.theme-card.active {
  border-color: var(--tech-cyan);
  background: rgba(var(--tech-cyan-rgb), 0.05);
}
.theme-card.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: var(--tech-cyan);
  box-shadow: 0 0 8px rgba(var(--tech-cyan-rgb), 0.5);
}
.check-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: var(--tech-cyan);
  color: var(--color-on-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 0 8px rgba(var(--tech-cyan-rgb), 0.5);
}
.thumb {
  height: 100px;
  border-radius: var(--radius-sm);
  background: var(--t-bg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.thumb-top {
  height: 22px;
  background: rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.thumb-body {
  flex: 1;
  padding: 10px;
  display: flex;
  gap: 8px;
}
.thumb-block {
  flex: 1;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.theme-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-top: 10px;
}
.theme-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 3px;
}

/* 强调色 (Nebula：64px 圆 + 电光青光晕选中) */
.accent-row {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}
.accent-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.accent-swatch {
  width: 64px;
  height: 64px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--t-fast) var(--ease-bounce),
    box-shadow var(--t-fast) var(--ease);
}
.accent-swatch:hover {
  transform: translateY(-2px);
}
.accent-swatch.active {
  box-shadow: 0 0 0 3px rgba(var(--tech-cyan-rgb), 0.2), 0 0 16px rgba(var(--tech-cyan-rgb), 0.4);
}
.accent-name {
  font-size: 13px;
  color: var(--color-text-secondary);
}
.accent-name.active {
  font-weight: 700;
  color: var(--color-text-primary);
}

/* 布局 (Nebula：active 电光青边框 + 微透 + 左侧竖条) */
.layout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.layout-card {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px;
  text-align: left;
  background: var(--color-bg-secondary);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease), border-color var(--t-fast) var(--ease);
}
.layout-card:hover {
  border-color: rgba(var(--tech-cyan-rgb), 0.3);
}
.layout-card.active {
  border-color: var(--tech-cyan);
  background: rgba(var(--tech-cyan-rgb), 0.05);
}
.layout-card.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: var(--tech-cyan);
  box-shadow: 0 0 8px rgba(var(--tech-cyan-rgb), 0.5);
}
.layout-mockup {
  height: 150px;
  border-radius: var(--radius-sm);
  background: var(--color-bg-secondary);
  overflow: hidden;
  border: 0.6px solid var(--color-border-soft);
}
.mock-nav {
  height: 28px;
  background: var(--color-bg-white);
  border-bottom: 1px solid var(--color-border-soft);
  position: relative;
}
.mock-nav::after {
  content: '';
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 5px;
  border-radius: 3px;
  background: var(--tech-cyan);
}
.mock-content {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mock-line {
  height: 10px;
  border-radius: 4px;
  background: var(--color-border);
}
.w60 {
  width: 60%;
}
.w70 {
  width: 70%;
}
.w80 {
  width: 80%;
}
.layout-mockup.sidebar {
  display: flex;
}
.mock-side {
  width: 28px;
  background: var(--color-bg-white);
  border-right: 1px solid var(--color-border-soft);
  position: relative;
}
.mock-side::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 6px;
  border-radius: 3px;
  background: var(--tech-cyan);
}
.layout-mockup.sidebar .mock-main {
  flex: 1;
}
.layout-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-top: 10px;
}
.layout-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 3px;
}
</style>
