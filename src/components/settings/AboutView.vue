<template>
  <div class="about-view">
    <div class="ui-card head-card">
      <div class="breadcrumb">
        <span>首页</span>
        <span class="sep">/</span>
        <span>设置中心</span>
        <span class="sep">/</span>
        <span class="current">关于</span>
      </div>
      <div class="head-title">关于</div>
      <div class="head-desc">版本信息与版权说明</div>
    </div>

    <div class="ui-card about-card">
      <div class="about-logo">
        <svg width="30" height="34" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 2h8l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" fill="none" />
          <path d="M13 2v4h4" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" fill="none" />
          <path d="M7.5 13h5M7.5 16h3.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </div>
      <div class="about-name">{{ BRAND_NAME }}</div>
      <div class="about-slogan">{{ BRAND_SLOGAN }}</div>
      <div class="about-version">版本 v1.0.0</div>
      <div class="about-divider"></div>
      <div class="about-copy">© {{ BRAND_YEAR }} {{ BRAND_NAME }} · sikenali</div>
      <div class="about-desc">Powered by LightOS</div>
    </div>
  </div>
</template>

<script setup>
import { BRAND_NAME, BRAND_SLOGAN, BRAND_YEAR } from '../../constants/brand';
</script>

<style scoped>
.about-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
}
.head-card {
  padding: 20px 24px;
}
.head-title {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--color-text-primary);
  margin-top: 10px;
}
.head-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-top: 8px;
}
.about-card {
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
.about-logo {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.about-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}
.about-slogan {
  font-size: 15px;
  color: var(--color-text-secondary);
}
.about-version {
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: var(--color-bg-secondary);
}
.about-divider {
  width: 100%;
  height: 0.7px;
  background: var(--color-border);
  margin: 16px 0;
}
.about-copy {
  font-size: 14px;
  color: var(--color-text-secondary);
}
.about-desc {
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>
