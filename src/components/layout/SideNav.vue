<template>
  <aside class="side-nav">
    <!-- 品牌 mark（点击回上传页） -->
    <button class="side-brand" title="返回" @click="goHome">
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    </button>

    <!-- 主工具导航：3 标签竖排（DESIGN-1 §2.2，激活态无竖线，背景微透+主色） -->
    <nav class="side-nav-list" role="navigation" aria-label="主工具导航">
      <button
        v-for="item in SUB_APP_LIST"
        :key="item.name"
        class="side-item"
        :class="{ active: activeTab === item.name }"
        :aria-current="activeTab === item.name ? 'page' : undefined"
        @click="switchTab(item)"
      >
        <component :is="iconFor(item.iconClass)" size="20" />
        <span class="side-label">{{ item.shortTitle }}</span>
      </button>
    </nav>

    <div class="side-version">v1.0.1</div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SUB_APP_LIST } from '../../constants/brand';
import {
  RiFileShield2Line,
  RiFileList3Line,
  RiPriceTag3Line,
} from '@remixicon/vue';

const route = useRoute();
const router = useRouter();

const activeTab = computed(() => route.meta.tab || '');

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
/* Nebula SideNav：64px 冷白毛玻璃 + tech-cyan 激活（无竖线） */
.side-nav {
  width: 64px;
  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 12px;
  gap: 8px;
  background: rgba(var(--bg-rgb), 0.88);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border-right: 0.6px solid var(--color-border-soft);
  transition: background-color var(--t-base) var(--ease),
    border-color var(--t-base) var(--ease);
}
[data-theme="dark"] .side-nav {
  background: rgba(15, 22, 35, 0.92);
  border-right: 0.6px solid var(--color-border);
}
.side-brand {
  width: 48px;
  height: 36px;
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tech-cyan);
  border-radius: var(--radius-sm);
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color var(--t-fast) var(--ease), color var(--t-fast) var(--ease);
}
.side-brand:hover {
  background: rgba(var(--tech-cyan-rgb), 0.08);
}
.side-nav-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex: 1;
  padding: 0 8px;
}
.side-item {
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: background-color var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease),
    transform var(--t-fast) var(--ease-bounce);
}
.side-item:hover {
  background: rgba(var(--tech-cyan-rgb), 0.06);
}
.side-item:active {
  transform: scale(0.95);
  transition-duration: var(--t-snap);
}
.side-item.active {
  background: rgba(var(--tech-cyan-rgb), 0.1);
  color: var(--tech-cyan);
  font-weight: 600;
}
.side-item.active svg {
  color: var(--tech-cyan);
}
.side-item.active .side-label {
  color: var(--tech-cyan);
  font-weight: 600;
}
.side-item:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--tech-cyan-rgb), 0.3);
}
.side-item svg {
  flex-shrink: 0;
  color: var(--color-text-secondary);
  transition: color var(--t-fast) var(--ease);
}
.side-label {
  font-size: 10px;
  line-height: 1;
  letter-spacing: 0.2px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  transition: color var(--t-fast) var(--ease);
}
.side-version {
  font-size: 9px;
  color: var(--color-text-faint);
  font-family: var(--font-family-mono);
  flex-shrink: 0;
}
</style>
