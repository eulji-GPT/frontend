import { ref, onMounted, watch } from 'vue';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'eulgpt-theme';

// Reactive theme state
const currentTheme = ref<ThemeMode>('light');
const effectiveTheme = ref<'light' | 'dark'>('light');

// Media query for system preference
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Apply theme to document root
 * Uses Tailwind's dark mode class strategy
 */
function applyTheme(theme: 'light' | 'dark') {
  const html = document.documentElement;

  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  effectiveTheme.value = theme;
  console.log(`[Theme] Applied ${theme} mode`);
}

/**
 * Determine effective theme based on current mode
 */
function getEffectiveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return systemPrefersDark.matches ? 'dark' : 'light';
  }
  return mode;
}

/**
 * Update theme based on current mode
 */
function updateTheme() {
  const effective = getEffectiveTheme(currentTheme.value);
  applyTheme(effective);
}

/**
 * Set theme mode
 */
function setTheme(mode: ThemeMode) {
  currentTheme.value = mode;
  localStorage.setItem(THEME_STORAGE_KEY, mode);
  updateTheme();
}

/**
 * Load theme from localStorage
 */
function loadTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    currentTheme.value = stored;
  } else {
    currentTheme.value = 'light';
  }
  updateTheme();
}

/**
 * Initialize theme system
 */
function initTheme() {
  loadTheme();

  // Listen for system theme changes
  systemPrefersDark.addEventListener('change', (e) => {
    if (currentTheme.value === 'system') {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

export function useTheme() {
  onMounted(() => {
    // Initialize theme only once
    if (!document.documentElement.style.getPropertyValue('--bg-primary')) {
      initTheme();
    }
  });

  // Watch for theme changes
  watch(currentTheme, () => {
    updateTheme();
  });

  return {
    currentTheme,
    effectiveTheme,
    setTheme,
    loadTheme,
  };
}

// Auto-initialize theme on module load
if (typeof window !== 'undefined') {
  initTheme();
}
