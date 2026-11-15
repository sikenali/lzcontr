// 顶部居中 Toast (per DESIGN-1.md 第9节)
import { reactive } from 'vue';

let id = 0;
const LEAVE_MS = 200; // 离场动画时长
export const toasts = reactive([]);

function dismiss(tid) {
  const idx = toasts.findIndex((t) => t.id === tid);
  if (idx === -1 || toasts[idx].leaving) return;
  toasts[idx].leaving = true;
  setTimeout(() => {
    const i = toasts.findIndex((t) => t.id === tid);
    if (i > -1) toasts.splice(i, 1);
  }, LEAVE_MS);
}

function push(type, message, duration) {
  const tid = ++id;
  toasts.push({ id: tid, type, message });
  setTimeout(() => dismiss(tid), duration);
  return tid;
}

export const ElMessage = {
  success: (m) => push('success', m, 2500),
  error: (m) => push('error', m, 2500),
  warning: (m) => push('warning', m, 2500),
  info: (m) => push('info', m, 2000),
};

export function removeToast(id) {
  dismiss(id);
}
