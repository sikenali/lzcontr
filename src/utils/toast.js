// 顶部居中 Toast (per DESIGN.md 第9节)
import { reactive } from 'vue';

let id = 0;
export const toasts = reactive([]);

function push(type, message, duration) {
  const tid = ++id;
  toasts.push({ id: tid, type, message });
  setTimeout(() => {
    const idx = toasts.findIndex((t) => t.id === tid);
    if (idx > -1) toasts.splice(idx, 1);
  }, duration);
  return tid;
}

export const ElMessage = {
  success: (m) => push('success', m, 2500),
  error: (m) => push('error', m, 2500),
  warning: (m) => push('warning', m, 2500),
  info: (m) => push('info', m, 2000),
};

export function removeToast(id) {
  const idx = toasts.findIndex((t) => t.id === id);
  if (idx > -1) toasts.splice(idx, 1);
}
