<template>
  <header class="topnav">
    <div class="nav-left" @click="goHome">
      <div class="logo-box">
        <svg width="18" height="20" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 2h8l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
            stroke="#fff" stroke-width="1.8" stroke-linejoin="round" fill="none"
          />
          <path d="M13 2v4h4" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" fill="none" />
          <path d="M7.5 13h5M7.5 16h3.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </div>
      <span class="brand-cn">{{ BRAND_NAME }}</span>
      <span class="divider"></span>
      <span class="page-title">{{ BRAND_SERIES }}</span>
    </div>

    <nav class="nav-center" role="navigation" aria-label="主工具导航">
      <button
        v-for="item in SUB_APP_LIST"
        :key="item.name"
        class="nav-item"
        :class="[`color-${item.color}`, { active: activeTab === item.name }]"
        :aria-current="activeTab === item.name ? 'page' : undefined"
        @click="switchTab(item)"
      >
        <component :is="iconFor(item.iconClass)" size="18" />
        <span class="nav-label">{{ item.shortTitle }}</span>
        <span v-if="completedTabs.includes(item.name)" class="nav-check">
          <RiCheckLine size="12" />
        </span>
      </button>
    </nav>

    <div class="nav-right">
      <slot name="right-extra"></slot>
      <button class="nav-btn" title="设置" aria-label="设置" @click="$emit('open-settings')">
        <RiSettings4Line size="18" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { BRAND_NAME, BRAND_SERIES, SUB_APP_LIST } from '../../constants/brand';
import {
  RiFileShield2Line,
  RiFileList3Line,
  RiPriceTag3Line,
  RiCheckLine,
} from '@remixicon/vue';

defineProps({
  activeTab: { type: String, default: '' },
  completedTabs: { type: Array, default: () => [] },
});
defineEmits(['open-settings']);

const router = useRouter();
const route = useRoute();

const iconMap = {
  'ri-file-shield-2-line': RiFileShield2Line,
  'ri-file-list-3-line': RiFileList3Line,
  'ri-price-tag-3-line': RiPriceTag3Line,
};
function iconFor(cls) {
  return iconMap[cls] || RiFileShield2Line;
}

function switchTab(item) {
  if (route.path === item.route) return;
  router.push(item.route);
}

function goHome() {
  router.push('/contract/yanfa');
}
</script>

<style scoped>
.topnav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--nav-h);
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: var(--color-bg-white);
  border-bottom: 0.7px solid var(--color-border);
  transition: background-color var(--t-base) var(--ease);
}
.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  cursor: pointer;
  min-width: 0;
}
.logo-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color var(--t-base) var(--ease);
}
.brand-cn {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  transition: color var(--t-fast) var(--ease);
}
.nav-left:hover .brand-cn {
  color: var(--color-primary);
}
.divider {
  width: 2px;
  height: 20px;
  background: var(--color-border);
}
.page-title {
  font-size: 16px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color var(--t-fast) var(--ease),
    transform var(--t-fast) var(--ease);
  color: var(--color-text-primary);
  font-family: var(--font-family-cn);
  line-height: 1.2;
}
.nav-item:hover {
  background: var(--color-bg-secondary);
  transform: translateY(-1px);
}
.nav-item.active {
  background: var(--color-primary-soft);
}
.nav-item.active .nav-label {
  color: var(--color-primary);
  font-weight: 600;
}
.nav-item .nav-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
}
.nav-item svg {
  flex-shrink: 0;
}
.nav-item.color-red svg {
  color: var(--brand-red);
}
.nav-item.color-gold svg {
  color: var(--brand-gold-strong);
}
.nav-item.color-green svg {
  color: var(--brand-green);
}
.nav-item.active.color-red svg {
  color: var(--color-primary);
}
.nav-item .nav-check {
  display: inline-flex;
  color: var(--color-success);
  margin-left: -2px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: flex-end;
}
.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: var(--color-bg-white);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--t-base) var(--ease),
    color var(--t-base) var(--ease),
    transform var(--t-base) var(--ease),
    box-shadow var(--t-base) var(--ease);
}
.nav-btn:hover {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
</style>
