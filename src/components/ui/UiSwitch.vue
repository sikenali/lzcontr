<template>
  <button
    class="ui-switch"
    :class="{ on: modelValue }"
    role="switch"
    :aria-checked="modelValue"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span class="knob"></span>
  </button>
</template>

<script setup>
defineProps({ modelValue: { type: Boolean, default: false } });
defineEmits(['update:modelValue']);
</script>

<style scoped>
.ui-switch {
  width: 42px;
  height: 24px;
  border-radius: 9999px;
  background: var(--color-bg-secondary);
  position: relative;
  border: 0.7px solid var(--color-border);
  transition: background-color var(--t-base) var(--ease),
    border-color var(--t-base) var(--ease);
  flex-shrink: 0;
}
.ui-switch .knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-text-faint);
  transition: transform var(--t-base) var(--ease),
    background-color var(--t-base) var(--ease);
}
.ui-switch.on {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.ui-switch.on .knob {
  transform: translateX(18px);
  background: #fff;
}
</style>
