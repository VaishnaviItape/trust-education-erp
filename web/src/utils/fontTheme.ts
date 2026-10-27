export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: string;
  description: string;
}

export interface FontSizeOption {
  id: string;
  label: string;
  sizePx: number;
  scalePercent: number;
  description: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    category: 'Modern Sans',
    description: 'Crisp, contemporary enterprise UI styling (Default)',
  },
  {
    id: 'inter',
    name: 'Inter',
    family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    category: 'UI Precision',
    description: 'Engineered for dense data tables, numbers, and high legibility',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    family: "'Poppins', sans-serif",
    category: 'Geometric Sans',
    description: 'Clean geometry, friendly aesthetic, and rounded clarity',
  },
  {
    id: 'roboto',
    name: 'Roboto',
    family: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
    category: 'Material Sans',
    description: 'Standard Google Material Design system font',
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    family: "'Open Sans', sans-serif",
    category: 'Humanist Sans',
    description: 'Neutral, warm, open forms optimized for screen interfaces',
  },
  {
    id: 'noto-sans',
    name: 'Noto Sans',
    family: "'Noto Sans', sans-serif",
    category: 'Universal / Regional',
    description: 'Harmonized script support for English and Indian languages',
  },
  {
    id: 'segoe',
    name: 'Segoe UI (System)',
    family: "'Segoe UI', -apple-system, system-ui, sans-serif",
    category: 'Native OS',
    description: 'Native Windows & OS desktop system font for maximum speed',
  },
  {
    id: 'merriweather',
    name: 'Merriweather (Serif)',
    family: "'Merriweather', Georgia, serif",
    category: 'Academic Serif',
    description: 'Traditional academic editorial style with elegant serifs',
  },
];

export const AVAILABLE_FONT_SIZES: FontSizeOption[] = [
  {
    id: 'compact',
    label: 'Compact (85%)',
    sizePx: 12.5,
    scalePercent: 85,
    description: 'High-density display (shows maximum rows and compact cards)',
  },
  {
    id: 'standard',
    label: 'Standard (100%)',
    sizePx: 14,
    scalePercent: 100,
    description: 'Default balanced ERP sizing across all screens',
  },
  {
    id: 'comfortable',
    label: 'Comfortable (110%)',
    sizePx: 15.5,
    scalePercent: 110,
    description: 'Relaxed reading with slightly enlarged text',
  },
  {
    id: 'large',
    label: 'Large (120%)',
    sizePx: 17,
    scalePercent: 120,
    description: 'High-visibility text for effortless scanning',
  },
  {
    id: 'extra-large',
    label: 'Extra Large (135%)',
    sizePx: 19,
    scalePercent: 135,
    description: 'Maximum accessibility and projection display mode',
  },
];

export class FontThemeService {
  private static FONT_KEY = 'trust_erp_font_family';
  private static SIZE_KEY = 'trust_erp_font_size';

  public static getFontFamily(): string {
    if (typeof window === 'undefined') return 'plus-jakarta';
    return localStorage.getItem(this.FONT_KEY) || 'plus-jakarta';
  }

  public static getFontSize(): string {
    if (typeof window === 'undefined') return 'standard';
    return localStorage.getItem(this.SIZE_KEY) || 'standard';
  }

  public static getScalePercent(): number {
    const sizeId = this.getFontSize();
    const preset = AVAILABLE_FONT_SIZES.find((s) => s.id === sizeId);
    if (preset) return preset.scalePercent;
    const num = parseInt(sizeId, 10);
    return !isNaN(num) ? num : 100;
  }

  public static applySettings(fontId: string, sizeId: string): { font: FontOption; size: FontSizeOption } {
    const font = AVAILABLE_FONTS.find((f) => f.id === fontId) || AVAILABLE_FONTS[0];
    let size = AVAILABLE_FONT_SIZES.find((s) => s.id === sizeId);

    if (!size) {
      // Support direct typed percentage (e.g. "135")
      const num = parseInt(sizeId, 10);
      if (!isNaN(num) && num >= 70 && num <= 180) {
        const matchingPreset = AVAILABLE_FONT_SIZES.find((s) => s.scalePercent === num);
        if (matchingPreset) {
          size = matchingPreset;
        } else {
          size = {
            id: String(num),
            label: `Custom (${num}%)`,
            sizePx: parseFloat(((14 * num) / 100).toFixed(1)),
            scalePercent: num,
            description: `Custom scaling set to ${num}%`,
          };
        }
      } else {
        size = AVAILABLE_FONT_SIZES[1];
      }
    }

    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--erp-font-family', font.family);
      document.documentElement.style.setProperty('--erp-font-size', `${size.sizePx}px`);
      document.body.style.fontFamily = font.family;
      localStorage.setItem(this.FONT_KEY, font.id);
      localStorage.setItem(this.SIZE_KEY, size.id);
    }

    return { font, size };
  }

  public static applyCustomPercent(fontId: string, percent: number): { font: FontOption; size: FontSizeOption } {
    const clamped = Math.max(75, Math.min(160, Math.round(percent)));
    const matchingPreset = AVAILABLE_FONT_SIZES.find((s) => s.scalePercent === clamped);
    return this.applySettings(fontId, matchingPreset ? matchingPreset.id : String(clamped));
  }

  public static init() {
    this.applySettings(this.getFontFamily(), this.getFontSize());
  }

  public static resetToDefault(): { font: FontOption; size: FontSizeOption } {
    return this.applySettings('plus-jakarta', 'standard');
  }
}
