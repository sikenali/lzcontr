import { ref, watch, onBeforeUnmount } from 'vue';

/**
 * 修改即保存：监听响应式数据，防抖后调用保存函数。
 * @param {Function} getSource - 返回被监听的响应式对象/数组
 * @param {Function} saveFn - 保存函数（调用 API）
 * @param {Object} opts
 * @param {number} opts.debounce - 防抖毫秒
 * @param {boolean} opts.enabled - 是否启用（默认 true）
 * @returns {{ status: Ref<string>, lastSavedAt: Ref<Date|null>, flush: Function }}
 *   status: idle | pending | saving | saved | error
 */
export function useAutosave(getSource, saveFn, { debounce = 800, enabled = true } = {}) {
  const status = ref('idle');
  const lastSavedAt = ref(null);
  let timer = null;
  let suppress = false;

  function stop() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  watch(
    getSource,
    () => {
      if (suppress || !enabled) return;
      status.value = 'pending';
      stop();
      timer = setTimeout(async () => {
        timer = null;
        status.value = 'saving';
        try {
          await saveFn();
          status.value = 'saved';
          lastSavedAt.value = new Date();
        } catch (e) {
          status.value = 'error';
        }
      }, debounce);
    },
    { deep: true }
  );

  // 立即保存一次（用于加载数据后的首次触发）
  async function flush() {
    stop();
    status.value = 'saving';
    try {
      await saveFn();
      status.value = 'saved';
      lastSavedAt.value = new Date();
    } catch (e) {
      status.value = 'error';
    }
  }

  // 加载数据期间抑制自动保存，加载完成后开启
  function pause() {
    suppress = true;
    stop();
  }
  function resume() {
    suppress = false;
  }

  onBeforeUnmount(stop);

  return { status, lastSavedAt, flush, pause, resume };
}

// 将保存状态格式化为展示文本
export function saveStatusText(status, lastSavedAt) {
  if (status === 'saving') return '保存中…';
  if (status === 'error') return '保存失败';
  if (status === 'saved' && lastSavedAt) {
    const t = new Date(lastSavedAt);
    const hh = String(t.getHours()).padStart(2, '0');
    const mm = String(t.getMinutes()).padStart(2, '0');
    return `已自动保存 ${hh}:${mm}`;
  }
  if (status === 'pending') return '待保存…';
  return '';
}
