<template>
  <div class="about-view">
    <!-- 品牌信息卡片（居中，lzc2vsdx 风格） -->
    <section class="about-card">
      <div class="about-badge">
        <svg width="56" height="56" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 4 H20.5 L26 9.5 V24.5 Q26 27.5 23 27.5 H8 Q5 27.5 5 24.5 V7 Q5 4 8 4 Z"
            stroke="#fff" stroke-width="2" stroke-linejoin="round" fill="none"
          />
          <path d="M20.5 4 V9.5 H26" stroke="#fff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none" />
          <path d="M10 13.5 H22" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" />
          <path d="M10 17 H16" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" />
          <circle cx="22" cy="24" r="6" stroke="#fff" stroke-width="2" fill="none" />
          <g stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
            <path d="M19 21 L22 24.5 L25 21" />
            <path d="M22 24.5 V27.5" />
            <path d="M19.5 23 H24.5" />
            <path d="M19.5 25.5 H24.5" />
          </g>
        </svg>
      </div>

      <h2 class="about-name">{{ BRAND_NAME }}</h2>

      <p class="about-slogan">{{ BRAND_SLOGAN }}</p>

      <span class="about-version">版本: v{{ VERSION }}</span>

      <p class="about-copy">
        © {{ BRAND_YEAR }} {{ BRAND_NAME }} · Powered by
        <a :href="BRAND_POWERED_URL" target="_blank" rel="noopener noreferrer">LightOS</a>
      </p>
    </section>
  </div>
</template>

<script setup>
import pkg from '../../../package.json';
import { BRAND_NAME, BRAND_SLOGAN, BRAND_POWERED_URL, BRAND_YEAR } from '../../constants/brand';

const VERSION = pkg.version;
</script>

<style scoped>
.about-view {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ═══ 品牌信息卡片（居中，lzc2vsdx 风格） ═══ */
.about-card {
  background: var(--color-bg-card);
  border: 0.6px solid var(--color-border);
  border-radius: var(--radius-md);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 24px;
}
.about-badge {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  border: 0.6px solid var(--color-border);
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--glow-sm);
}
.about-name {
  margin-top: 26px;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
  font-family: var(--font-family-display);
}
.about-slogan {
  margin-top: 14px;
  font-size: 15px;
  color: var(--color-text-secondary);
  text-align: center;
  line-height: 1.5;
}
.about-version {
  margin-top: 10px;
  font-size: 13px;
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
}
.about-copy {
  margin-top: 26px;
  font-size: 13px;
  color: var(--color-text-faint);
}
.about-copy a {
  color: var(--color-text-secondary);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color var(--t-fast) var(--ease);
}
.about-copy a:hover {
  color: var(--tech-cyan);
}
</style>
