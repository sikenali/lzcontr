<template>
  <teleport to="body">
    <transition name="pv-fade">
      <div v-if="visible" class="pv-overlay" @click.self="close">
        <div class="pv-shell" :class="{ fullscreen: fullscreen }">
          <!-- 顶栏 -->
          <div class="pv-topbar">
            <div class="pv-title">
              <RiFile3Line size="16" />
              在线预览 · {{ q.form.project || '报价单' }}
            </div>
            <div class="pv-actions">
              <button class="pv-btn" @click="toggleFullscreen">
                <RiFullscreenLine v-if="!fullscreen" size="14" />
                <RiFullscreenExitLine v-else size="14" />
                {{ fullscreen ? '退出全屏' : '全屏' }}
              </button>
              <button class="pv-btn close" title="关闭" @click="close">
                <RiCloseLine size="16" />
              </button>
            </div>
          </div>

          <!-- 文档内容 -->
          <div class="pv-scroll" ref="scrollRef">
            <div class="doc-page">
              <div class="doc-header">
                <div class="doc-brand">LZContr · 合同条款库</div>
                <h2 class="doc-title">{{ q.form.project || '报价单' }}</h2>
                <div class="doc-subtitle">{{ q.form.subtitle }}</div>
              </div>

              <table class="doc-info">
                <tbody>
                  <tr><td class="lbl">报价公司</td><td>{{ q.form.company }}</td><td class="lbl">报价日期</td><td>{{ q.form.date }}</td></tr>
                  <tr><td class="lbl">报价编号</td><td>{{ q.form.no }}</td><td class="lbl">客户名称</td><td>{{ q.form.customer }}</td></tr>
                  <tr><td class="lbl">联系人 / 电话</td><td>{{ q.form.contact }}</td><td class="lbl">报价有效期</td><td>{{ q.form.validity }}</td></tr>
                </tbody>
              </table>

              <h3 class="doc-sec-title">报价明细</h3>
              <table class="doc-detail">
                <thead>
                  <tr>
                    <th class="c">序号</th>
                    <th>产品名称</th>
                    <th>规格型号</th>
                    <th class="c">数量</th>
                    <th class="r">单价（元）</th>
                    <th class="r">金额（元）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in visibleRows" :key="i">
                    <td class="c">{{ String(i + 1).padStart(2, '0') }}</td>
                    <td>{{ r.name }}</td>
                    <td>{{ r.spec }}</td>
                    <td class="c">{{ r.qty }}</td>
                    <td class="r">{{ r.price }}</td>
                    <td class="r">{{ r.amount || '—' }}</td>
                  </tr>
                  <tr class="sum-row">
                    <td colspan="5" class="r sum-label">小计</td>
                    <td class="r sum-val">{{ fmt(subtotal) }}</td>
                  </tr>
                  <tr class="sum-row">
                    <td colspan="5" class="r sum-label">税额 13%</td>
                    <td class="r sum-val">{{ fmt(tax) }}</td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="5" class="r sum-label">含税总计</td>
                    <td class="r sum-val big">¥{{ fmt(total) }}</td>
                  </tr>
                </tbody>
              </table>

              <h3 class="doc-sec-title">报价说明与条款</h3>
              <p class="doc-notes">{{ q.notes || '（无）' }}</p>

              <div class="doc-footer">
                <span>LZContr · 合同条款库</span>
                <span>第 1 页 / 共 1 页</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RiFile3Line, RiFullscreenLine, RiFullscreenExitLine, RiCloseLine } from '@remixicon/vue';
import { useQuotationStore } from '../../stores/quotation';

const props = defineProps({
  visible: { type: Boolean, default: false },
  fullscreen: { type: Boolean, default: false },
});
const emit = defineEmits(['update:visible', 'update:fullscreen', 'close']);

const q = useQuotationStore();
const scrollRef = ref(null);

// 过滤空行
const visibleRows = computed(() => (q.rows || []).filter((r) => r.name || r.spec || r.qty || r.price));

function parseNum(s) {
  const m = String(s || '').match(/[\d,]+(\.\d+)?/);
  return m ? parseFloat(m[0].replace(/,/g, '')) : 0;
}
const subtotal = computed(() => visibleRows.value.reduce((s, r) => s + parseNum(r.amount), 0));
const tax = computed(() => subtotal.value * 0.13);
const total = computed(() => subtotal.value + tax.value);
const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function toggleFullscreen() {
  emit('update:fullscreen', !props.fullscreen);
  if (!props.fullscreen && scrollRef.value) {
    setTimeout(() => scrollRef.value.scrollTo({ top: 0 }), 50);
  }
}
function close() {
  emit('update:visible', false);
  emit('close');
}
</script>

<style scoped>
.pv-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(20, 18, 14, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}
.pv-shell {
  width: min(960px, 100%);
  max-height: 100%;
  background: var(--color-bg-secondary);
  border: 0.7px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.pv-shell.fullscreen {
  width: 100%;
  height: 100%;
  border-radius: 0;
}
.pv-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  background: var(--color-bg-white);
  border-bottom: 0.7px solid var(--color-border);
  flex-shrink: 0;
}
.pv-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pv-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pv-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border: 0.7px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-white);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  transition: border-color var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease);
}
.pv-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.pv-btn.close {
  width: 34px;
  padding: 0;
  justify-content: center;
}
.pv-scroll {
  overflow-y: auto;
  padding: 32px;
  flex: 1;
}
/* 文档页 */
.doc-page {
  max-width: 720px;
  margin: 0 auto;
  background: var(--color-bg-white);
  border: 0.7px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 48px 52px;
  box-shadow: var(--shadow-xs);
  color: var(--color-text-body);
}
.doc-header {
  text-align: center;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 20px;
  margin-bottom: 24px;
}
.doc-brand {
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--color-text-faint);
  margin-bottom: 12px;
}
.doc-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}
.doc-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
}
.doc-info {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 28px;
  font-size: 13px;
}
.doc-info td {
  padding: 7px 10px;
  border: 0.7px solid var(--color-border);
}
.doc-info .lbl {
  width: 18%;
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
  font-weight: 500;
}
.doc-sec-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 20px 0 12px;
  padding-left: 10px;
  border-left: 3px solid var(--color-primary);
}
.doc-detail {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.doc-detail th {
  background: var(--color-bg-secondary);
  padding: 9px 10px;
  border: 0.7px solid var(--color-border);
  font-weight: 600;
  color: var(--color-text-secondary);
}
.doc-detail td {
  padding: 8px 10px;
  border: 0.7px solid var(--color-border);
}
.doc-detail .c { text-align: center; }
.doc-detail .r { text-align: right; }
.sum-row td {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-weight: 500;
}
.sum-label { text-align: right; }
.total-row td {
  font-weight: 700;
  color: var(--color-text-primary);
}
.sum-val.big {
  color: var(--color-primary);
  font-size: 15px;
}
.doc-notes {
  font-size: 13px;
  line-height: 1.8;
  color: var(--color-text-body);
  white-space: pre-wrap;
}
.doc-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 36px;
  padding-top: 14px;
  border-top: 0.7px solid var(--color-border);
  font-size: 11px;
  color: var(--color-text-faint);
}
/* 过渡 */
.pv-fade-enter-active,
.pv-fade-leave-active {
  transition: opacity 0.2s ease;
}
.pv-fade-enter-from,
.pv-fade-leave-to {
  opacity: 0;
}
</style>
