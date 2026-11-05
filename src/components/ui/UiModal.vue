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
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: overlay-in 0.25s ease;
}
.ui-modal-panel {
  background: var(--color-bg-secondary, #f7f3ea);
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: panel-in 0.25s ease;
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
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
