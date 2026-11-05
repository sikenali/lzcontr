<template>
  <div class="quote-view">
    <div class="page-head">
      <div>
        <div class="breadcrumb">
          <span>首页</span>
          <span class="sep">/</span>
          <span>报价单</span>
          <span class="sep">/</span>
          <span class="current">布局 B · 居中标题</span>
        </div>
        <h1 class="page-title">报价单 · 填写（布局 B）</h1>
        <p class="page-desc">项目名称居中作为大标题，报价公司与报价日期分别左右，适合对外发送的正式报价</p>
      </div>
      <QuotationLayoutTabs v-model="store.layout" />
    </div>

    <section class="ui-card info-card">
      <div class="center-title-block">
        <label class="center-label">项目名称（居中显示）</label>
        <input v-model="store.form.project" class="center-title" :class="{ 'has-error': errors.project }" placeholder="请输入项目名称" />
        <span v-if="errors.project" class="err-msg">{{ errors.project }}</span>
        <input v-model="store.form.subtitle" class="center-sub" placeholder="副标题：机房基础设施升级与配套服务" />
      </div>
      <div class="info-grid">
        <div class="field">
          <label class="form-label">报价公司 <span class="req">*</span></label>
          <input v-model="store.form.company" class="ui-input" :class="{ 'has-error': errors.company }" />
          <span v-if="errors.company" class="err-msg">{{ errors.company }}</span>
        </div>
        <div class="field">
          <label class="form-label">报价日期</label>
          <input v-model="store.form.date" type="date" class="ui-input" />
        </div>
        <div class="field">
          <label class="form-label">客户名称 <span class="req">*</span></label>
          <input v-model="store.form.customer" class="ui-input" :class="{ 'has-error': errors.customer }" />
          <span v-if="errors.customer" class="err-msg">{{ errors.customer }}</span>
        </div>
        <div class="field">
          <label class="form-label">报价编号</label>
          <input v-model="store.form.no" class="ui-input" />
        </div>
      </div>
    </section>

    <QuotationDetailTable v-model="store.rows" />

    <QuotationNotesCard v-model="store.notes" />

    <div class="next-area">
      <button class="btn-primary next-btn" :disabled="store.saving" @click="onNext">
        {{ store.saving ? '保存中…' : '下一步' }}
        <RiArrowRightLine v-if="!store.saving" size="16" />
      </button>
      <p class="next-hint">
        <RiInformationLine size="14" />
        下一步可预览报价单版式并导出 PDF / Excel
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import QuotationLayoutTabs from '../components/quotation/QuotationLayoutTabs.vue';
import QuotationDetailTable from '../components/quotation/QuotationDetailTable.vue';
import QuotationNotesCard from '../components/quotation/QuotationNotesCard.vue';
import { useQuotationStore } from '../stores/quotation';
import { RiCalendarLine, RiArrowRightLine, RiInformationLine } from '@remixicon/vue';
import { ElMessage } from '../utils/toast';

const router = useRouter();
const store = useQuotationStore();
const errors = reactive({});

onMounted(() => {
  store.setLayout('b');
  if (!store.rows.length) {
    store.setRows([
      { name: '精密空调（下送风）', spec: 'CR-35kW', qty: '4 台', price: '86,000', amount: '344,000' },
      { name: '模块化 UPS 系统', spec: 'UPS-200kVA', qty: '2 套', price: '138,000', amount: '276,000' },
      { name: '安装调试与培训服务', spec: '标准实施包', qty: '1 项', price: '68,000', amount: '68,000' },
      { name: '', spec: '', qty: '', price: '', amount: '' },
    ]);
  }
  if (!store.notes) {
    store.setNotes(
      '本报价有效期 30 天，含设备供货、安装调试与三年质保；付款方式为 30% 预付 + 60% 到货验收 + 10% 质保金。'
    );
  }
});

function validate() {
  let ok = true;
  if (!store.form.project.trim()) {
    errors.project = '项目名称不能为空';
    ok = false;
  }
  if (!store.form.company.trim()) {
    errors.company = '报价公司不能为空';
    ok = false;
  }
  if (!store.form.customer.trim()) {
    errors.customer = '客户名称不能为空';
    ok = false;
  }
  return ok;
}

async function onNext() {
  if (!validate()) {
    ElMessage.warning('请先完善必填项');
    return;
  }
  try {
    await store.save();
    ElMessage.success('报价单已保存，正在跳转…');
    router.push('/generate');
  } catch (e) {
    ElMessage.error(e.message || '保存失败，请重试');
  }
}
</script>

<style scoped>
.quote-view {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}
.info-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.center-title-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
.center-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
}
.center-title {
  width: 100%;
  max-width: 640px;
  height: 56px;
  text-align: center;
  border: 0.7px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 22px;
  font-weight: 600;
  font-family: inherit;
  transition: background-color var(--t-base) var(--ease),
    border-color var(--t-base) var(--ease);
}
.center-title:focus {
  outline: none;
  background: var(--color-bg-white);
  border-color: var(--color-primary);
}
.center-title.has-error {
  border-color: var(--color-error);
}
.center-sub {
  width: 100%;
  max-width: 420px;
  height: 44px;
  text-align: center;
  border: 0.7px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-family: inherit;
  transition: background-color var(--t-base) var(--ease),
    border-color var(--t-base) var(--ease);
}
.center-sub:focus {
  outline: none;
  background: var(--color-bg-white);
  border-color: var(--color-primary);
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
}
.input-icon-wrap {
  position: relative;
}
.input-icon-wrap .input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-faint);
  pointer-events: none;
}
.input-icon-wrap .ui-input {
  padding-right: 36px;
}
.field .has-error {
  border-color: var(--color-error);
}
.err-msg {
  font-size: 12px;
  color: var(--color-error);
}
.next-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 8px 0 16px;
}
.next-btn {
  min-width: 180px;
}
.next-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.next-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-faint);
}
</style>
