<template>
  <aside class="side-card ui-card">
    <div class="side-head">
      <span class="side-title">合同章节</span>
      <span class="side-count">{{ selectedCount }} 项</span>
    </div>

    <div class="side-list">
      <div
        v-for="(item, i) in sections"
        :key="i"
        class="side-item"
        :class="{ active: item.active, editing: editingId === item.id }"
        @click="activate(item)"
      >
        <!-- 勾选：切换 selected -->
        <button
          type="button"
          class="side-check"
          :title="item.selected ? '取消勾选' : '勾选此章节'"
          @click.stop="toggleSelected(item)"
        >
          <RiCheckLine v-if="item.selected" size="14" class="sel-icon" />
          <span v-else class="side-dot"></span>
        </button>

        <!-- 重命名输入 / 名称 -->
        <input
          v-if="editingId === item.id"
          v-model="editingText"
          ref="editInput"
          class="side-edit-input"
          @click.stop
          @keyup.enter="commitEdit(item)"
          @keyup.esc="cancelEdit"
          @blur="commitEdit(item)"
        />
        <span v-else class="side-name" :title="item.name" @dblclick.stop="startEdit(item)">
          {{ item.name }}
        </span>

        <!-- hover 操作：编辑 / 删除 -->
        <div class="side-actions" @click.stop>
          <button type="button" class="side-act" title="重命名" @click="startEdit(item)">
            <RiEditLine size="13" />
          </button>
          <button type="button" class="side-act del" title="删除" @click="removeItem(item)">
            <RiDeleteBinLine size="13" />
          </button>
        </div>
      </div>
    </div>

    <button type="button" class="add-custom-btn" @click="addCustom">
      <RiAddLine size="16" />
      新增自定义条款
    </button>
  </aside>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { RiCheckLine, RiAddLine, RiEditLine, RiDeleteBinLine } from '@remixicon/vue';
import { ElMessage } from '../../utils/toast';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
});
const emit = defineEmits(['update:modelValue']);

// 直接引用父级数组，就地修改保持响应式
const sections = computed(() => props.modelValue);

const selectedCount = computed(() => sections.value.filter((s) => s.selected).length);

const editingId = ref(null);
const editingText = ref('');
const editInput = ref(null);
let idSeq = 1000;

// 确保每个条目有稳定 id（已有条目可能没有 id）
function getId(item) {
  if (!item.id) {
    item.id = 'sec-' + idSeq++;
  }
  return item.id;
}

// 激活章节（高亮）
function activate(item) {
  sections.value.forEach((s) => (s.active = false));
  item.active = true;
}

// 勾选 / 取消勾选
function toggleSelected(item) {
  item.selected = !item.selected;
}

// 开始重命名
async function startEdit(item) {
  editingId.value = getId(item);
  editingText.value = item.name;
  await nextTick();
  // v-for 内 ref 会被收集为数组
  const el = Array.isArray(editInput.value) ? editInput.value[0] : editInput.value;
  if (el) {
    el.focus();
    el.select();
  }
}

// 提交重命名
function commitEdit(item) {
  if (editingId.value !== getId(item)) return;
  const name = editingText.value.trim();
  if (name) {
    item.name = name;
    ElMessage.success(`已重命名为「${name}」`);
  }
  editingId.value = null;
}

// 取消重命名
function cancelEdit() {
  editingId.value = null;
}

// 删除章节
function removeItem(item) {
  const id = getId(item);
  const idx = sections.value.findIndex((s) => getId(s) === id);
  if (idx === -1) return;
  if (sections.value.length <= 1) {
    ElMessage.warning('至少保留一个章节');
    return;
  }
  const next = sections.value.filter((s) => getId(s) !== id);
  // 若删除的是当前激活项，激活第一项
  if (item.active && next.length) next[0].active = true;
  emit('update:modelValue', next);
  ElMessage.success(`已删除章节「${item.name}」`);
}

// 新增自定义条款
function addCustom() {
  const item = { id: 'sec-' + idSeq++, name: '自定义条款', active: false, selected: true };
  const next = [...sections.value, item];
  emit('update:modelValue', next);
  ElMessage.success('已新增自定义条款，双击可重命名');
}
</script>

<style scoped>
.side-card {
  width: 240px;
  flex-shrink: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 96px;
  align-self: flex-start;
}
.side-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}
.side-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}
.side-count {
  font-size: 12px;
  color: var(--color-text-muted);
}
.side-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.side-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 8px;
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--color-text-body);
  cursor: pointer;
  transition: background-color var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease);
}
.side-item:hover {
  background: var(--color-bg-secondary);
}
.side-item.active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 600;
}
.side-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  flex-shrink: 0;
  transition: background-color var(--t-fast) var(--ease);
}
.side-check:hover {
  background: var(--color-bg-white);
}
.sel-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}
.side-dot {
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: var(--color-border);
  flex-shrink: 0;
}
.side-item.active .side-dot {
  background: var(--color-primary);
}
.side-name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.side-edit-input {
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 0.7px solid var(--color-primary);
  border-radius: 6px;
  background: var(--color-bg-white);
  color: var(--color-text-primary);
  font-size: 13px;
  font-family: inherit;
}
.side-edit-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}
.side-actions {
  display: none;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}
.side-item:hover .side-actions {
  display: flex;
}
.side-act {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  color: var(--color-text-faint);
  transition: background-color var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease);
}
.side-act:hover {
  background: var(--color-bg-white);
  color: var(--color-primary);
}
.side-act.del:hover {
  color: var(--color-error);
}
.add-custom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  border: 1px dashed var(--color-border-hover);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 500;
  transition: border-color var(--t-base) var(--ease),
    background-color var(--t-base) var(--ease);
}
.add-custom-btn:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
}
</style>
