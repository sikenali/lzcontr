<template>
  <div class="ui-select" ref="rootRef">
    <button
      type="button"
      class="ui-select-trigger"
      :class="{ open: open, 'has-error': error }"
      :aria-haspopup="'listbox'"
      :aria-expanded="open"
      @click="toggle"
    >
      <span class="ui-select-value" :class="{ placeholder: !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <RiArrowDownSLine size="16" class="ui-select-arrow" :class="{ rotate: open }" />
    </button>

    <transition name="select-pop">
      <div v-if="open" class="ui-select-menu" role="listbox">
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          class="ui-select-option"
          :class="{ active: opt.value === modelValue }"
          role="option"
          :aria-selected="opt.value === modelValue"
          @click="select(opt.value)"
        >
          <span>{{ opt.label }}</span>
          <RiCheckLine v-if="opt.value === modelValue" size="14" class="opt-check" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { RiArrowDownSLine, RiCheckLine } from '@remixicon/vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '请选择' },
  error: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

const open = ref(false);
const rootRef = ref(null);

const selectedLabel = computed(() => {
  const o = props.options.find((x) => String(x.value) === String(props.modelValue));
  return o ? o.label : '';
});

function toggle() {
  open.value = !open.value;
}
function select(v) {
  emit('update:modelValue', v);
  open.value = false;
}

function onClickOutside(e) {
  if (rootRef.value && !rootRef.value.contains(e.target)) open.value = false;
}
function onKeydown(e) {
  if (e.key === 'Escape') open.value = false;
}
onMounted(() => {
  document.addEventListener('click', onClickOutside);
  document.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.ui-select {
  position: relative;
  width: 100%;
}
.ui-select-trigger {
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 12px 0 14px;
  border: 0.7px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  cursor: pointer;
  transition: background-color var(--t-base) var(--ease),
    border-color var(--t-base) var(--ease),
    box-shadow var(--t-base) var(--ease);
}
.ui-select-trigger:hover {
  border-color: var(--color-border-hover);
}
.ui-select-trigger.open,
.ui-select-trigger:focus {
  outline: none;
  background: var(--color-bg-white);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}
.ui-select-trigger.has-error {
  border-color: var(--color-error);
}
.ui-select-value {
  font-size: 14px;
  color: var(--color-text-body);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-select-value.placeholder {
  color: var(--color-text-muted);
}
.ui-select-arrow {
  color: var(--color-text-faint);
  flex-shrink: 0;
  transition: transform var(--t-base) var(--ease);
}
.ui-select-arrow.rotate {
  transform: rotate(180deg);
}
.ui-select-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 50;
  background: var(--color-bg-white);
  border: 0.7px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: 4px;
  max-height: 260px;
  overflow-y: auto;
}
.ui-select-option {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text-body);
  text-align: left;
  transition: background-color var(--t-fast) var(--ease);
}
.ui-select-option:hover {
  background: var(--color-bg-secondary);
}
.ui-select-option.active {
  color: var(--color-primary);
  font-weight: 500;
}
.opt-check {
  color: var(--color-primary);
  flex-shrink: 0;
}
.select-pop-enter-active,
.select-pop-leave-active {
  transition: opacity var(--t-fast) var(--ease),
    transform var(--t-fast) var(--ease);
}
.select-pop-enter-from,
.select-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
