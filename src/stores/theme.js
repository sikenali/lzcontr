import { defineStore } from 'pinia';

const STORAGE_KEY = 'lzcontr-theme';

function loadTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    /* ignore */
  }
  return { mode: 'light', accent: 'red', layout: 'topbar' };
}

// 强调色表 (per DESIGN.md 6.3)
export const ACCENTS = {
  red: { name: '朱红·默认', light: '#BE3B2E', dark: '#E05050' },
  gold: { name: '鎏金', light: '#D3A93F', dark: '#E0B84A' },
  green: { name: '玉绿', light: '#3E8C6E', dark: '#5CB98C' },
  blue: { name: '云蓝', light: '#4A72A8', dark: '#82AEDD' },
  ink: { name: '黛墨', light: '#2F3640', dark: '#9AA3B2' },
};

export const useThemeStore = defineStore('theme', {
  state: () => loadTheme(),
  getters: {
    isDark: (s) => s.mode === 'dark',
    accentMeta: (s) => ACCENTS[s.accent] || ACCENTS.red,
  },
  actions: {
    apply() {
      const root = document.documentElement;
      root.setAttribute('data-theme', this.mode);
      const accent = ACCENTS[this.accent] || ACCENTS.red;
      root.style.setProperty(
        '--color-primary',
        this.mode === 'dark' ? accent.dark : accent.light
      );
      root.style.setProperty('--brand-red-strong', this.mode === 'dark' ? accent.dark : accent.light);
      root.style.setProperty(
        '--color-primary-soft',
        this.mode === 'dark'
          ? 'color-mix(in srgb, ' + (this.mode === 'dark' ? accent.dark : accent.light) + ' 18%, #1C1C1F)'
          : 'color-mix(in srgb, ' + accent.light + ' 12%, #FFF)'
      );
      this.save();
    },
    setMode(mode) {
      this.mode = mode;
      this.apply();
    },
    setAccent(accent) {
      this.accent = accent;
      this.apply();
    },
    setLayout(layout) {
      this.layout = layout;
      this.save();
    },
    save() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ mode: this.mode, accent: this.accent, layout: this.layout })
        );
      } catch (e) {
        /* ignore */
      }
    },
    reset() {
      this.mode = 'light';
      this.accent = 'red';
      this.layout = 'topbar';
      this.apply();
    },
  },
});
