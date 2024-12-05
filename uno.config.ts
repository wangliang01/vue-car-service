import { defineConfig } from '@unocss/vite';
import transformerDirectives from '@unocss/transformer-directives';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import presetUno from '@unocss/preset-uno';
import presetIcons from '@unocss/preset-icons';
import type { Theme } from '@unocss/preset-uno';
import { presetSoybeanAdmin } from '@sa/uno-preset';
import { themeVars } from './src/theme/vars';

export default defineConfig<Theme>({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist']
    }
  },
  theme: {
    ...themeVars,
    fontSize: {
      'icon-xs': '0.875rem',
      'icon-small': '1rem',
      icon: '1.125rem',
      'icon-large': '1.5rem',
      'icon-xl': '2rem'
    }
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm'
  },
  presets: [
    presetUno({ dark: 'class' }),
    presetSoybeanAdmin(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        material: async () => {
          const icons = await import('@iconify-json/material-symbols/icons.json');
          return icons.default;
        }
      }
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()]
});
