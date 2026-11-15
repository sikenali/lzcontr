import { defineStore } from 'pinia';

const STORAGE_KEY = 'lzcontr-theme';

function loadTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    /* ignore */
  }
  return { mode: 'light', accent: 'cyan', layout: 'topbar' };
}

// 强调色表 (per DESIGN-1 §6.3 Nebula 五色，参考 lzc2vsdx)
export const ACCENTS = {
  cyan:  { name: '电光青·默认', color: '#00D4AA', soft: '#E8FFF8', on: '#0A1628', deep: '#0A6B5A' },
  gold:  { name: '赛博金',      color: '#FFB347', soft: '#FFF8E6', on: '#0A1628', deep: '#C67A10' },
  green: { name: '玉绿',        color: '#00A878', soft: '#E6FFF4', on: '#0A1628', deep: '#008A62' },
  blue:  { name: '琉璃蓝',      color: '#4A9EFF', soft: '#EBF4FF', on: '#0A1628', deep: '#2D7FD9' },
  coral: { name: '霓虹珊瑚',    color: '#FF4D6D', soft: '#FFF0F3', on: '#0A1628', deep: '#D13A56' },
};

export const useThemeStore = defineStore('theme', {
  state: () => loadTheme(),
  getters: {
    isDark: (s) => s.mode === 'dark',
    accentMeta: (s) => ACCENTS[s.accent] || ACCENTS.cyan,
  },
  actions: {
    apply() {
      const root = document.documentElement;
      root.setAttribute('data-theme', this.mode);
      root.setAttribute('data-accent', this.accent);
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
      this.accent = 'cyan';
      this.layout = 'topbar';
      this.apply();
    },
  },
});
