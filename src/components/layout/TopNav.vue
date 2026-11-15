<template>
  <header class="topnav">
    <div class="nav-left" @click="goHome">
      <div v-if="!isSidebar" class="brand-icon">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 4 H20.5 L26 9.5 V24.5 Q26 27.5 23 27.5 H8 Q5 27.5 5 24.5 V7 Q5 4 8 4 Z"
            stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"
          />
          <path d="M20.5 4 V9.5 H26" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none" />
          <path d="M10 13.5 H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
          <path d="M10 17 H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
          <circle cx="22" cy="24" r="6" stroke="currentColor" stroke-width="2" fill="none" />
          <g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
            <path d="M19 21 L22 24.5 L25 21" />
            <path d="M22 24.5 V27.5" />
            <path d="M19.5 23 H24.5" />
            <path d="M19.5 25.5 H24.5" />
          </g>
        </svg>
      </div>
      <span v-if="!isSidebar" class="brand-cn">{{ BRAND_NAME }}</span>
      <span v-if="!isSidebar" class="divider"></span>
      <span class="page-title">{{ BRAND_PRODUCT }}</span>
    </div>

    <nav v-if="!isSidebar" class="nav-center" role="navigation" aria-label="主工具导航">
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
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { BRAND_NAME, BRAND_PRODUCT, SUB_APP_LIST } from '../../constants/brand';
import { useThemeStore } from '../../stores/theme';
import {
  RiFileShield2Line,
  RiFileList3Line,
  RiPriceTag3Line,
  RiCheckLine,
  RiSettings4Line,
} from '@remixicon/vue';

const props = defineProps({
  activeTab: { type: String, default: '' },
  completedTabs: { type: Array, default: () => [] },
});
defineEmits(['open-settings']);

const router = useRouter();
const route = useRoute();
const theme = useThemeStore();
const isSidebar = computed(() => theme.layout === 'sidebar');

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
  padding: 0 32px;
  background: rgba(var(--bg-rgb), 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: background-color var(--t-base) var(--ease);
}
/* 底部 0.7px 微光分割线 */
.topnav::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--color-primary) 25%, transparent) 50%,
    transparent
  );
}
.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  cursor: pointer;
  min-width: 0;
}
.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
  transition: color var(--t-fast) var(--ease);
}
.brand-cn {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  transition: color var(--t-fast) var(--ease), text-shadow var(--t-fast) var(--ease);
}
.nav-left:hover .brand-cn {
  color: var(--color-primary);
  text-shadow: 0 0 8px currentColor;
}
.divider {
  width: 2px;
  height: 20px;
  background: var(--color-border);
  flex-shrink: 0;
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
  position: relative;
}
/* Nebula 标签：紧凑、毛玻璃顶栏、激活=文字变电光青（无大底色块） */
.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  height: 34px;
  border-radius: var(--radius-md);
  cursor: pointer;
  position: relative;
  will-change: transform;
  transition: background-color var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease),
    transform var(--t-fast) var(--ease-bounce);
  color: var(--color-text-primary);
  font-family: var(--font-family-cn);
  line-height: 1.2;
  letter-spacing: 0.2px;
  font-size: 13px;
  font-weight: 500;
}
/* hover 顶部微光条 (电光青) */
.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 0.6px;
  opacity: 0;
  background: linear-gradient(90deg, transparent, rgba(var(--tech-cyan-rgb), 0.6), transparent);
  transition: opacity var(--t-fast) var(--ease);
}
.nav-item:hover::before {
  opacity: 1;
}
.nav-item:hover {
  background: rgba(var(--tech-cyan-rgb), 0.07);
  transform: translateY(-1px);
}
.nav-item:active {
  transform: scale(0.97);
  transition-duration: var(--t-snap);
}
.nav-item:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--tech-cyan-rgb), 0.3);
}
/* 激活态：文字/图标变电光青 */
.nav-item.active {
  color: var(--tech-cyan);
  font-weight: 600;
}
.nav-item.active .nav-label {
  color: var(--tech-cyan);
  font-weight: 600;
}
.nav-item .nav-label {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: var(--color-text-primary);
  transition: color var(--t-fast) var(--ease);
}
.nav-item svg {
  flex-shrink: 0;
  transition: color var(--t-fast) var(--ease);
}
/* 品牌色图标 (未激活时) */
.nav-item.color-red svg {
  color: var(--brand-red);
}
.nav-item.color-gold svg {
  color: var(--brand-gold-strong);
}
.nav-item.color-green svg {
  color: var(--brand-green);
}
.nav-item.color-blue svg {
  color: var(--brand-blue);
}
/* 激活时图标统一变电光青 */
.nav-item.active svg {
  color: var(--tech-cyan);
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--t-fast) var(--ease-bounce),
    color var(--t-fast) var(--ease-bounce),
    transform var(--t-fast) var(--ease-bounce),
    box-shadow var(--t-fast) var(--ease-bounce);
}
.nav-btn:hover {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(var(--tech-cyan-rgb), 0.35);
}
.nav-btn:active {
  transform: scale(0.96);
  transition-duration: var(--t-snap);
  box-shadow: none;
}
.nav-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--tech-cyan-rgb), 0.35);
}
</style>
