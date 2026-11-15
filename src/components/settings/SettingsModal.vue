<template>
  <UiModal
    :visible="visible"
    width="88vw"
    :max-width="1100"
    height="86vh"
    :show-footer="false"
    :close-on-click-overlay="false"
    body-direction="column"
    @update:visible="$emit('update:visible', $event)"
  >
    <!-- §5.2 弹窗头部（紧凑科技版，lzc2vsdx） -->
    <div class="settings-header">
      <div class="settings-head-left">
        <div class="head-icon">
          <RiSettings4Line size="18" />
        </div>
        <div class="head-text">
          <div class="head-title">设置中心</div>
          <div class="head-subtitle">选择要进入的设置界面</div>
        </div>
      </div>
      <button class="close-btn" title="关闭" @click="$emit('update:visible', false)">
        <RiCloseLine size="16" />
      </button>
    </div>

    <!-- 5.3 导航侧栏 + 内容区 -->
    <div class="settings-body">
      <nav class="nav-list" role="navigation" aria-label="设置导航">
        <button
          v-for="item in menuItems"
          :key="item.key"
          class="nav-item"
          :class="{ active: activeKey === item.key }"
          @click="activeKey = item.key"
        >
          <component :is="item.icon" size="18" />
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="panel-content">
        <ThemeSettingsView v-if="activeKey === 'theme'" />
        <AboutView v-else-if="activeKey === 'about'" />
      </div>
    </div>
  </UiModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import UiModal from '../ui/UiModal.vue';
import ThemeSettingsView from './ThemeSettingsView.vue';
import AboutView from './AboutView.vue';
import { RiSettings4Line, RiCloseLine, RiPaletteLine, RiInformationLine } from '@remixicon/vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
});
defineEmits(['update:visible']);

const menuItems = [
  { key: 'theme', label: '主题管理', icon: RiPaletteLine },
  { key: 'about', label: '关于', icon: RiInformationLine },
];

const activeKey = ref('theme');
watch(
  () => props.visible,
  (v) => {
    if (v) activeKey.value = 'theme';
  }
);
</script>

<style scoped>
.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
  height: 52px;
  padding: 0 20px;
  margin-top: 16px;
  margin-bottom: 16px;
  border-bottom: 0.6px solid var(--color-border-soft);
}
.settings-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.head-icon {
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 50%;
  background: rgba(var(--tech-cyan-rgb), 0.12);
  border: 0.6px solid rgba(var(--tech-cyan-rgb), 0.3);
  color: var(--tech-cyan);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.head-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.3px;
  line-height: 1.2;
  color: var(--color-text-primary);
}
.head-subtitle {
  margin-top: 1px;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: var(--color-text-muted);
}
.close-btn {
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 50%;
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease);
}
.close-btn:hover {
  background: rgba(var(--tech-cyan-rgb), 0.12);
  color: var(--tech-cyan);
}
.close-btn:active {
  transform: scale(0.95);
  transition-duration: var(--t-snap);
}
.close-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--tech-cyan-rgb), 0.3);
}

.settings-body {
  display: flex;
  gap: 16px;
  padding: 0 20px 20px;
  flex: 1;
  min-height: 0;
}
.nav-list {
  width: 200px;
  flex-shrink: 0;
  background: var(--color-bg-secondary);
  border: 0.6px solid var(--color-border-soft);
  border-radius: var(--radius-md);
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 42px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  letter-spacing: 0.2px;
  color: var(--color-text-body);
  text-align: left;
  transition: background-color var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease);
}
.nav-item:hover {
  background: rgba(var(--tech-cyan-rgb), 0.06);
}
.nav-item.active {
  background: rgba(var(--tech-cyan-rgb), 0.08);
  color: var(--tech-cyan);
  font-weight: 600;
}
/* 左侧 3px 电光青竖条 (跟随主题色，DESIGN-1 §5.3) */
.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 22px;
  border-radius: 0 2px 2px 0;
  background: var(--tech-cyan);
  box-shadow: 0 0 8px rgba(var(--tech-cyan-rgb), 0.5);
}
.nav-item:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--tech-cyan-rgb), 0.3);
}
.panel-content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  border-radius: 16px;
}
/* §5.4: 隐藏嵌入视图自带的 header 卡 */
.panel-content :deep(.page-header-card) {
  display: none;
}
</style>
