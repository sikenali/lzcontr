<template>
  <TopNav
    :active-tab="activeTab"
    :completed-tabs="completedTabs"
    @open-settings="settingsVisible = true"
  >
    <template #right-extra>
      <!-- 修改即保存状态 -->
      <span
        v-if="showSaveStatus && saveStatus !== 'idle'"
        class="status-pill"
        :class="saveStatusClass"
      >
        <RiCheckboxCircleLine v-if="saveStatus === 'saved'" size="14" />
        <RiLoaderLine v-else-if="saveStatus === 'saving'" size="14" class="spin" />
        <RiErrorWarningLine v-else size="14" />
        {{ saveStatusText }}
      </span>
      <span v-else-if="route.name === 'generate'" class="status-pill">
        <RiCheckboxCircleLine size="14" />
        草稿已自动保存
      </span>
      <span v-else-if="route.name === 'generate-done'" class="status-pill done">
        <RiCheckboxCircleLine size="14" />
        文件已生成
      </span>
    </template>
  </TopNav>

  <main class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>

  <PageFooter />

  <SettingsModal v-model:visible="settingsVisible" />

  <!-- 顶部居中 Toast -->
  <div class="toast-container">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast"
      :class="`toast-${t.type}`"
    >
      <span class="toast-bar"></span>
      <span class="toast-msg">{{ t.message }}</span>
      <button class="toast-close" @click="removeToast(t.id)">
        <RiCloseLine size="14" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TopNav from './components/layout/TopNav.vue';
import PageFooter from './components/layout/PageFooter.vue';
import SettingsModal from './components/settings/SettingsModal.vue';
import { toasts, removeToast } from './utils/toast';
import { useThemeStore } from './stores/theme';
import { useQuotationStore } from './stores/quotation';
import { useContractStore } from './stores/contract';
import { useAutosave, saveStatusText as fmtStatus } from './composables/useAutosave';
import { RiCloseLine, RiCheckboxCircleLine, RiLoaderLine, RiErrorWarningLine } from '@remixicon/vue';

const route = useRoute();
const theme = useThemeStore();
const settingsVisible = ref(false);
const qStore = useQuotationStore();
const cStore = useContractStore();

const activeTab = computed(() => route.meta.tab || '');
const completedTabs = computed(() => {
  if (route.meta.tab === 'baojia' && (route.name === 'generate' || route.name === 'generate-done')) {
    return ['yanfa', 'xiaoshou', 'baojia'];
  }
  return [];
});

// 修改即保存：监听表单数据，防抖后自动调用 API 保存
const qAuto = useAutosave(
  () => [qStore.form, qStore.rows, qStore.notes],
  () => qStore.save()
);
const yfAuto = useAutosave(
  () => [cStore.yanfa],
  () => cStore.saveYanfa({ ...cStore.yanfa })
);
const xsAuto = useAutosave(
  () => [cStore.xiaoshou],
  () => cStore.saveXiaoshou({ ...cStore.xiaoshou })
);

// 当前激活页面对应的保存状态
const activeAuto = computed(() => {
  if (activeTab.value === 'baojia') return qAuto;
  if (route.name === 'yanfa') return yfAuto;
  if (route.name === 'xiaoshou') return xsAuto;
  return null;
});
const showSaveStatus = computed(() => !!activeAuto.value);
const saveStatus = computed(() => activeAuto.value?.status.value || 'idle');
const saveStatusText = computed(() => {
  const a = activeAuto.value;
  if (!a) return '';
  return fmtStatus(a.status.value, a.lastSavedAt.value);
});
const saveStatusClass = computed(() => {
  if (saveStatus.value === 'saved') return 'done';
  if (saveStatus.value === 'error') return 'err';
  return '';
});

onMounted(async () => {
  theme.apply();
  // 从 API 加载已保存的数据（加载期间暂停自动保存，避免误触发）
  qAuto.pause();
  yfAuto.pause();
  xsAuto.pause();
  await Promise.all([qStore.load(), cStore.load()]);
  qAuto.resume();
  yfAuto.resume();
  xsAuto.resume();
});
</script>

<style scoped>
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border-radius: var(--radius-full);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}
.status-pill svg {
  color: var(--color-text-faint);
}
.status-pill.done {
  color: var(--color-success-strong);
}
.status-pill.done svg {
  color: var(--color-success);
}
.status-pill.err {
  color: var(--color-error);
}
.status-pill.err svg {
  color: var(--color-error);
}
.spin {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
  max-width: min(420px, 90vw);
  padding: 12px 16px 12px 18px;
  background: var(--color-bg-white);
  border: 0.7px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  animation: toast-in 0.25s ease;
}
.toast-bar {
  width: 3px;
  height: 20px;
  border-radius: 2px;
  flex-shrink: 0;
}
.toast-success .toast-bar {
  background: var(--color-success);
}
.toast-error .toast-bar {
  background: var(--color-error);
}
.toast-warning .toast-bar {
  background: var(--color-warning);
}
.toast-info .toast-bar {
  background: var(--color-info);
}
.toast-msg {
  font-size: 14px;
  color: var(--color-text-primary);
  flex: 1;
}
.toast-close {
  color: var(--color-text-faint);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 50%;
}
.toast-close:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}
@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
