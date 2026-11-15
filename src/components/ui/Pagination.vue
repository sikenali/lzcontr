<template>
  <div class="ui-pagination" role="navigation" aria-label="分页">
    <span class="page-info">{{ infoText }}</span>

    <div class="page-btns">
      <!-- 上一页 -->
      <button
        type="button"
        class="page-btn"
        :disabled="current <= 1"
        aria-label="上一页"
        @click="go(current - 1)"
      >
        <RiArrowLeftSLine class="icon" />
      </button>

      <!-- 页码 -->
      <template v-for="p in pages" :key="p">
        <span v-if="p === '...'" class="page-ellipsis">…</span>
        <button
          v-else
          type="button"
          class="page-btn"
          :class="{ active: p === current }"
          :aria-current="p === current ? 'page' : undefined"
          @click="go(p)"
        >
          {{ p }}
        </button>
      </template>

      <!-- 下一页 -->
      <button
        type="button"
        class="page-btn"
        :disabled="current >= pageCount"
        aria-label="下一页"
        @click="go(current + 1)"
      >
        <RiArrowRightSLine class="icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  current: { type: Number, default: 1 },
  total: { type: Number, default: 0 },
  pageSize: { type: Number, default: 10 },
});
const emit = defineEmits(['change']);

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const from = computed(() =>
  props.total === 0 ? 0 : (props.current - 1) * props.pageSize + 1
);
const to = computed(() =>
  Math.min(props.total, props.current * props.pageSize)
);
const infoText = computed(() => `第 ${from.value}-${to.value} 条 / 共 ${props.total} 条`);

/** 生成页码序列，两侧 + 当前页，超长用省略号 */
const pages = computed(() => {
  const count = pageCount.value;
  const cur = props.current;
  if (count <= 7) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
  const set = new Set([1, 2, count - 1, count, cur - 1, cur, cur + 1]);
  const list = [...set].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of list) {
    if (p - prev > 1) out.push('...');
    out.push(p);
    prev = p;
  }
  return out;
});

function go(page) {
  const p = Math.min(Math.max(1, page), pageCount.value);
  if (p === props.current) return;
  emit('change', p);
}
</script>

<style scoped>
.ui-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  padding: 4px 0;
}
.page-info {
  font-size: 14px;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}
.page-btns {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: background-color var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease);
}
.page-btn:hover:not(:disabled):not(.active) {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}
.page-btn.active {
  background: var(--color-success);
  color: var(--color-on-primary);
  font-weight: 600;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-btn .icon {
  width: 16px;
  height: 16px;
}
.page-ellipsis {
  color: var(--color-text-muted);
  font-size: 14px;
  padding: 0 2px;
}
</style>
