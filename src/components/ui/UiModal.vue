<template>
  <teleport to="body">
    <div v-if="visible" class="ui-modal-overlay" @click.self="onOverlayClick">
      <div
        class="ui-modal-panel"
        :style="{
          width: width,
          maxWidth: maxWidth + 'px',
          height: height,
        }"
      >
        <div class="ui-modal-body" :style="{ flexDirection: bodyDirection }">
          <slot></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  width: { type: String, default: '600px' },
  maxWidth: { type: Number, default: 600 },
  height: { type: String, default: 'calc(100vh - 40px)' },
  bodyDirection: { type: String, default: 'column' },
  showFooter: { type: Boolean, default: true },
  closeOnClickOverlay: { type: Boolean, default: true },
});
const emit = defineEmits(['update:visible', 'close']);

function close() {
  emit('update:visible', false);
  emit('close');
}
function onOverlayClick() {
  if (props.closeOnClickOverlay) close();
}

function onKeydown(e) {
  if (e.key === 'Escape') close();
}
onMounted(() => document.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.ui-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: overlay-in 0.25s ease;
}
[data-theme="dark"] .ui-modal-overlay {
  background: rgba(0, 0, 0, 0.7);
}
.ui-modal-panel {
  background: var(--color-bg-card);
  border: 0.6px solid var(--color-border);
  border-radius: 14px;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: panel-in 0.25s ease;
}
[data-theme="dark"] .ui-modal-panel {
  background: rgba(10, 22, 40, 0.95);
  border-color: rgba(var(--tech-cyan-rgb), 0.12);
  box-shadow:
    0 8px 48px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(var(--tech-cyan-rgb), 0.06);
}
.ui-modal-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
@keyframes overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes panel-in {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
