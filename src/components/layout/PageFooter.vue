<template>
  <footer class="page-footer">
    <div class="footer-left">
      <div class="footer-logo">
        <svg width="18" height="20" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.5 2 H12 L16.5 6.5 V17 Q16.5 19 14.5 19 H4.5 Q2.5 19 2.5 17 V4 Q2.5 2 4.5 2 Z"
            stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" fill="none"
          />
          <path d="M12 2 V6.5 H16.5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" fill="none" />
          <path d="M5.5 10.5 H12.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none" />
          <circle cx="14" cy="15.5" r="4.2" stroke="currentColor" stroke-width="1.8" fill="none" />
          <g stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
            <path d="M12.6 13.5 L14 15.3 L15.4 13.5" />
            <path d="M14 15.3 V17.3" />
            <path d="M13 14.5 H15" />
            <path d="M13 15.8 H15" />
          </g>
        </svg>
      </div>
      <span class="footer-brand-text">{{ BRAND_PRODUCT }}</span>
    </div>

    <div class="footer-right">
      © {{ BRAND_YEAR }} {{ BRAND_NAME }} · Powered by
      <a :href="BRAND_POWERED_URL" target="_blank" rel="noopener noreferrer">LightOS</a>
    </div>
  </footer>
</template>

<script setup>
import { BRAND_NAME, BRAND_PRODUCT, BRAND_POWERED_URL, BRAND_YEAR } from '../../constants/brand';
</script>

<style scoped>
/* §2.1 PageFooter：48px，左右 24px（lzc2vsdx 样式，无中间图标按钮） */
.page-footer {
  height: var(--footer-h);
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(var(--bg-rgb), 0.75);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border-top: 0.6px solid rgba(var(--tech-cyan-rgb), 0.12);
  margin-top: auto;
  transition: background-color var(--t-base) var(--ease);
}

[data-theme="dark"] .page-footer {
  background: rgba(15, 22, 35, 0.88);
  border-top: 0.6px solid rgba(var(--tech-cyan-rgb), 0.08);
}

.footer-left {
  width: 320px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
}
.footer-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  transition: color var(--t-base) var(--ease);
}
.footer-brand-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  font-family: var(--font-family-display);
}

.footer-right {
  width: 320px;
  text-align: right;
  font-size: 12px;
  color: var(--color-text-muted);
  flex: none;
}
.footer-right a {
  color: var(--color-text-secondary);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color var(--t-fast) var(--ease);
}
.footer-right a:hover {
  color: var(--tech-cyan);
}

@media (max-width: 900px) {
  .page-footer {
    padding: 0 16px;
  }
  .footer-left,
  .footer-right {
    width: auto;
  }
  .footer-right {
    font-size: 11px;
  }
}
</style>
