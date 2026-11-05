<template>
  <UiModal
    :visible="visible"
    width="92vw"
    :max-width="1400"
    height="92vh"
    :show-footer="false"
    :close-on-click-overlay="false"
    body-direction="column"
    @update:visible="$emit('update:visible', $event)"
  >
    <!-- 5.2 弹窗头部 -->
    <div class="settings-header">
      <div class="settings-head-left">
        <div class="head-icon">
          <RiSettings4Line size="22" />
        </div>
        <div class="head-text">
          <div class="head-title">设置中心</div>
          <div class="head-subtitle">选择要进入的设置界面</div>
        </div>
      </div>
      <button class="close-btn" title="关闭" @click="$emit('update:visible', false)">
        <RiCloseLine size="20" />
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
          <component :is="item.icon" size="20" />
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
  padding: 28px 32px 20px;
  flex-shrink: 0;
}
.settings-head-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.head-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}
.head-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
}
.head-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 2px;
}
.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--t-base) var(--ease),
    color var(--t-base) var(--ease);
}
.close-btn:hover {
  background: var(--color-bg-white);
  color: var(--color-text-primary);
}

.settings-body {
  display: flex;
  gap: 20px;
  padding: 0 32px 28px;
  flex: 1;
  min-height: 0;
}
.nav-list {
  width: 240px;
  flex-shrink: 0;
  background: var(--color-bg-white);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 52px;
  padding: 0 16px;
  border-radius: var(--radius-md);
  font-size: 15px;
  color: var(--color-text-body);
  text-align: left;
  transition: background-color var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease);
}
.nav-item:hover {
  background: var(--color-bg-secondary);
}
.nav-item.active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 500;
}
.panel-content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  border-radius: 16px;
}
</style>
