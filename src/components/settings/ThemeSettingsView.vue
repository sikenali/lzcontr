<template>
  <div class="theme-view">
    <!-- 6.1 页面头部 Card -->
    <div class="ui-card head-card">
      <div class="head-left">
        <div class="breadcrumb">
          <span>首页</span>
          <span class="sep">/</span>
          <span>设置中心</span>
          <span class="sep">/</span>
          <span class="current">主题管理</span>
        </div>
        <div class="head-title">主题管理</div>
        <div class="head-desc">统一切换外观底色、强调色与导航布局模式，修改即时生效</div>
      </div>
      <button class="btn-secondary reset-btn" @click="onReset">
        <RiRefreshLine size="16" />
        恢复默认
      </button>
    </div>

    <!-- 6.2 外观主题 Card -->
    <div class="ui-card section-card">
      <div class="section-head">
        <span class="block-title">外观主题</span>
      </div>
      <div class="theme-grid">
        <button
          class="theme-card"
          :class="{ active: theme.mode === 'light' }"
          @click="setMode('light')"
        >
          <span v-if="theme.mode === 'light'" class="check-badge"><RiCheckLine size="14" /></span>
          <div class="thumb" style="--t-bg: #f7eed4">
            <div class="thumb-top"></div>
            <div class="thumb-body">
              <div class="thumb-block"></div>
              <div class="thumb-block"></div>
            </div>
          </div>
          <div class="theme-name">浅色主题·羊皮纸</div>
          <div class="theme-desc">当前默认，长时间阅读标书不易疲劳</div>
        </button>
        <button
          class="theme-card"
          :class="{ active: theme.mode === 'dark' }"
          @click="setMode('dark')"
        >
          <span v-if="theme.mode === 'dark'" class="check-badge"><RiCheckLine size="14" /></span>
          <div class="thumb" style="--t-bg: #333a45">
            <div class="thumb-top"></div>
            <div class="thumb-body">
              <div class="thumb-block"></div>
              <div class="thumb-block"></div>
            </div>
          </div>
          <div class="theme-name">深色主题·墨夜</div>
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
            class="accent-dot"
            :class="{ active: theme.accent === key }"
            :style="{ background: theme.isDark ? meta.dark : meta.light }"
          >
            <RiCheckLine v-if="theme.accent === key" size="26" color="#fff" />
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
  gap: 20px;
  padding-bottom: 20px;
}
.head-card {
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}
.head-title {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--color-text-primary);
  margin-top: 10px;
}
.head-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-top: 8px;
}
.reset-btn {
  height: 48px;
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

/* 外观主题 */
.theme-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.theme-card {
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 12px;
  text-align: left;
  background: var(--color-bg-white);
  position: relative;
  transition: border-color var(--t-base) var(--ease),
    background-color var(--t-base) var(--ease);
}
.theme-card:hover {
  border-color: var(--color-border-hover);
}
.theme-card.active {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
}
.check-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.thumb {
  height: 128px;
  border-radius: 10px;
  background: var(--t-bg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.thumb-top {
  height: 28px;
  background: rgba(255, 255, 255, 0.85);
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
  background: rgba(255, 255, 255, 0.7);
}
.theme-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-top: 12px;
}
.theme-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

/* 强调色 */
.accent-row {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}
.accent-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.accent-dot {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: transform var(--t-base) var(--ease),
    box-shadow var(--t-base) var(--ease);
}
.accent-dot:hover {
  transform: scale(1.04);
}
.accent-dot.active {
  box-shadow: 0 0 0 3px var(--color-bg-white), 0 0 0 5px var(--color-primary);
}
.accent-name {
  font-size: 14px;
  color: var(--color-text-secondary);
}
.accent-name.active {
  font-weight: 700;
  color: var(--color-text-primary);
}

/* 布局 */
.layout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.layout-card {
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 12px;
  text-align: left;
  background: var(--color-bg-white);
  position: relative;
  transition: border-color var(--t-base) var(--ease),
    background-color var(--t-base) var(--ease);
}
.layout-card.active {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
}
.layout-mockup {
  height: 150px;
  border-radius: 10px;
  background: var(--color-bg-secondary);
  overflow: hidden;
  border: 1px solid var(--color-border-soft);
}
.mock-nav {
  height: 28px;
  background: var(--color-bg-white);
  border-bottom: 1px solid var(--color-border-soft);
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
}
.layout-mockup.sidebar .mock-main {
  flex: 1;
}
.layout-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-top: 12px;
}
.layout-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-top: 4px;
}
</style>
