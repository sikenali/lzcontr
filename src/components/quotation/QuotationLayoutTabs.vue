<template>
  <div class="seg-tabs" role="tablist" aria-label="报价单布局切换">
    <button
      v-for="opt in options"
      :key="opt.key"
      class="seg-item"
      :class="{ active: activeKey === opt.key }"
      role="tab"
      :aria-selected="activeKey === opt.key"
      @click="go(opt.key)"
    >
      <component :is="opt.icon" size="14" />
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { RiLayoutRowLine, RiLayoutTopLine, RiLayoutColumnLine } from '@remixicon/vue';

const props = defineProps({
  modelValue: { type: String, default: 'a' },
});
defineEmits(['update:modelValue']);

const router = useRouter();
const route = useRoute();

const routeMap = { a: '/quotation/a', b: '/quotation/b', c: '/quotation/c' };
const options = [
  { key: 'a', label: '布局 A', icon: RiLayoutRowLine },
  { key: 'b', label: '布局 B', icon: RiLayoutTopLine },
  { key: 'c', label: '布局 C', icon: RiLayoutColumnLine },
];

// 从当前路由推断激活项
const activeKey = computed(() => {
  if (route.path.includes('/quotation/b')) return 'b';
  if (route.path.includes('/quotation/c')) return 'c';
  return props.modelValue || 'a';
});

function go(key) {
  const target = routeMap[key];
  if (route.path === target) return;
  router.push(target);
}
</script>

<style scoped>
.seg-tabs {
  display: inline-flex;
  padding: 4px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  gap: 2px;
}
.seg-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: background-color var(--t-base) var(--ease),
    color var(--t-base) var(--ease);
}
.seg-item:hover {
  color: var(--color-text-primary);
}
.seg-item.active {
  background: var(--color-bg-white);
  color: var(--color-primary);
  box-shadow: var(--shadow-xs);
}
</style>
