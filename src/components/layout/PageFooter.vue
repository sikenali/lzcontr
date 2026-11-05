<template>
  <footer class="page-footer">
    <div class="footer-left">
      <div class="footer-logo">
        <svg width="10" height="13" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 2h8l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
            stroke="#fff" stroke-width="2.2" stroke-linejoin="round" fill="none"
          />
        </svg>
      </div>
      <span class="footer-brand">{{ BRAND_PRODUCT }}</span>
    </div>
    <div class="footer-right">
      <span class="copyright">
        © {{ BRAND_YEAR }} {{ BRAND_NAME }} · Powered by
        <a :href="BRAND_POWERED_URL" target="_blank" rel="noopener noreferrer">LightOS</a>
      </span>
    </div>
  </footer>
</template>

<script setup>
import { BRAND_NAME, BRAND_PRODUCT, BRAND_POWERED_URL, BRAND_YEAR } from '../../constants/brand';
</script>

<style scoped>
.page-footer {
  height: var(--footer-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background: linear-gradient(
    180deg,
    var(--color-bg-white),
    var(--color-bg-secondary)
  );
  border-top: 1px solid var(--color-border);
  margin-top: auto;
  transition: background-color var(--t-base) var(--ease);
}
.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-logo {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--t-base) var(--ease);
}
.footer-brand {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}
.footer-right {
  display: flex;
  align-items: center;
}
.copyright {
  font-size: 14px;
  color: var(--color-text-muted);
}
.copyright a {
  color: var(--color-primary);
}
.copyright a:hover {
  text-decoration: underline;
}
</style>
