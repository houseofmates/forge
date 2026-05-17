import { createDarkTheme, BrandVariants, Theme } from '@fluentui/react-components'

// pkm brand palette - proper yellow ramp from dark to light
// brand colors should be variants of the primary brand color (yellow #f6b012)
const pkmBrand: BrandVariants = {
  10: '#1a1508', // darkest yellow tint
  20: '#332a0f',
  30: '#4d3f16',
  40: '#66541e',
  50: '#806925',
  60: '#997e2d',
  70: '#b39434',
  80: '#f6b012', // primary accent yellow
  90: '#f7b92a',
  100: '#f9c242',
  110: '#facb5a',
  120: '#fbd472',
  130: '#fcdd8a',
  140: '#fde6a2',
  150: '#feefba',
  160: '#fff8d2' // lightest yellow tint
}

const basePkmTheme = createDarkTheme(pkmBrand)

// pkm custom theme - warm dark aesthetic
export const pkmTheme: Theme = {
  ...basePkmTheme,

  // backgrounds - solid, no gradients
  colorNeutralBackground1: '#050505',
  colorNeutralBackground2: '#0a0a0a',
  colorNeutralBackground3: '#111111',
  colorNeutralBackground4: '#1a1a1a',
  colorNeutralBackground5: '#252525',
  colorNeutralBackground6: '#333333',

  colorNeutralBackground1Hover: '#111111',
  colorNeutralBackground1Pressed: '#0a0a0a',
  colorNeutralBackground1Selected: '#1a1a1a',

  colorNeutralBackground2Hover: '#1a1a1a',
  colorNeutralBackground2Pressed: '#111111',
  colorNeutralBackground2Selected: '#252525',

  colorNeutralBackground3Hover: '#1a1a1a',
  colorNeutralBackground3Pressed: '#0a0a0a',
  colorNeutralBackground3Selected: '#252525',

  // subtle backgrounds
  colorSubtleBackground: 'transparent',
  colorSubtleBackgroundHover: '#1a1a1a',
  colorSubtleBackgroundPressed: '#111111',
  colorSubtleBackgroundSelected: '#252525',

  // brand colors - yellow accent
  colorBrandBackground: '#f6b012',
  colorBrandBackgroundHover: '#f9c042',
  colorBrandBackgroundPressed: '#d99a0e',
  colorBrandBackgroundSelected: '#f6b012',

  colorBrandBackground2: '#1a1a0a',
  colorBrandBackground2Hover: '#252515',
  colorBrandBackground2Pressed: '#111108',

  colorBrandForeground1: '#f6b012',
  colorBrandForeground2: '#f9c042',
  colorBrandForegroundLink: '#3c9fdd',
  colorBrandForegroundLinkHover: '#5cb3e8',
  colorBrandForegroundLinkPressed: '#2a8bc9',
  colorBrandForegroundLinkSelected: '#3c9fdd',

  // text colors - white, yellow, blue only
  colorNeutralForeground1: '#ffffff',
  colorNeutralForeground2: '#ffffff',
  colorNeutralForeground3: '#3c9fdd',
  colorNeutralForeground4: '#3c9fdd',
  colorNeutralForegroundDisabled: 'rgba(255, 255, 255, 0.38)',

  colorNeutralForeground1Hover: '#ffffff',
  colorNeutralForeground1Pressed: '#ffffff',
  colorNeutralForeground1Selected: '#f6b012',

  colorNeutralForeground2Hover: '#f6b012',
  colorNeutralForeground2Pressed: '#f6b012',
  colorNeutralForeground2Selected: '#f6b012',

  colorNeutralForegroundOnBrand: '#050505',

  // strokes/borders
  colorNeutralStroke1: '#333333',
  colorNeutralStroke2: '#252525',
  colorNeutralStroke3: '#1a1a1a',
  colorNeutralStrokeAccessible: '#4a4a4a',
  colorNeutralStrokeAccessibleHover: '#f6b012',
  colorNeutralStrokeAccessiblePressed: '#d99a0e',
  colorNeutralStrokeAccessibleSelected: '#f6b012',
  colorNeutralStrokeOnBrand: '#050505',
  colorNeutralStrokeOnBrand2: '#0a0a0a',
  colorNeutralStrokeOnBrand2Hover: '#111111',
  colorNeutralStrokeOnBrand2Pressed: '#050505',
  colorNeutralStrokeOnBrand2Selected: '#f6b012',

  colorBrandStroke1: '#f6b012',
  colorBrandStroke2: '#d99a0e',
  colorBrandStroke2Hover: '#f9c042',
  colorBrandStroke2Pressed: '#b8840c',
  colorBrandStroke2Contrast: '#f6b012',

  // compound brand
  colorCompoundBrandBackground: '#f6b012',
  colorCompoundBrandBackgroundHover: '#f9c042',
  colorCompoundBrandBackgroundPressed: '#d99a0e',
  colorCompoundBrandForeground1: '#f6b012',
  colorCompoundBrandForeground1Hover: '#f9c042',
  colorCompoundBrandForeground1Pressed: '#d99a0e',
  colorCompoundBrandStroke: '#f6b012',
  colorCompoundBrandStrokeHover: '#f9c042',
  colorCompoundBrandStrokePressed: '#d99a0e',

  // status colors - semantic
  colorPaletteRedBackground1: '#1a0808',
  colorPaletteRedBackground2: '#2d0f0f',
  colorPaletteRedBackground3: '#ef4444',
  colorPaletteRedForeground1: '#ef4444',
  colorPaletteRedForeground2: '#f87171',
  colorPaletteRedForeground3: '#fca5a5',
  colorPaletteRedBorderActive: '#ef4444',
  colorPaletteRedBorder1: '#ef4444',
  colorPaletteRedBorder2: '#dc2626',

  colorPaletteGreenBackground1: '#081a0a',
  colorPaletteGreenBackground2: '#0f2d12',
  colorPaletteGreenBackground3: '#22c55e',
  colorPaletteGreenForeground1: '#22c55e',
  colorPaletteGreenForeground2: '#4ade80',
  colorPaletteGreenForeground3: '#86efac',
  colorPaletteGreenBorderActive: '#22c55e',
  colorPaletteGreenBorder1: '#22c55e',
  colorPaletteGreenBorder2: '#16a34a',

  colorPaletteYellowBackground1: '#1a1808',
  colorPaletteYellowBackground2: '#2d2a0f',
  colorPaletteYellowBackground3: '#f6b012',
  colorPaletteYellowForeground1: '#f6b012',
  colorPaletteYellowForeground2: '#f9c042',
  colorPaletteYellowForeground3: '#fbd072',
  colorPaletteYellowBorderActive: '#f6b012',
  colorPaletteYellowBorder1: '#f6b012',
  colorPaletteYellowBorder2: '#d99a0e',

  // transparent backgrounds
  colorTransparentBackground: 'transparent',
  colorTransparentBackgroundHover: 'rgba(255, 255, 255, 0.05)',
  colorTransparentBackgroundPressed: 'rgba(255, 255, 255, 0.02)',
  colorTransparentBackgroundSelected: 'rgba(246, 176, 18, 0.1)',

  // typography - varela round applied via css
  fontFamilyBase: "'Varela Round', -apple-system, BlinkMacSystemFont, sans-serif",
  fontFamilyMonospace: "'JetBrains Mono', 'Fira Code', monospace",
  fontFamilyNumeric: "'Varela Round', -apple-system, BlinkMacSystemFont, sans-serif",

  // shadows - none/minimal (no glows)
  shadow2: '0 1px 2px rgba(0, 0, 0, 0.3)',
  shadow4: '0 2px 4px rgba(0, 0, 0, 0.4)',
  shadow8: '0 4px 8px rgba(0, 0, 0, 0.5)',
  shadow16: '0 8px 16px rgba(0, 0, 0, 0.6)',
  shadow28: '0 14px 28px rgba(0, 0, 0, 0.7)',
  shadow64: '0 32px 64px rgba(0, 0, 0, 0.8)',

  // border radius
  borderRadiusNone: '0',
  borderRadiusSmall: '4px',
  borderRadiusMedium: '8px',
  borderRadiusLarge: '12px',
  borderRadiusXLarge: '16px',
  borderRadiusCircular: '50%',

  // curves for motion
  curveAccelerateMax: 'cubic-bezier(0.9, 0.1, 1, 0.2)',
  curveAccelerateMid: 'cubic-bezier(0.7, 0, 0.9, 0.2)',
  curveAccelerateMin: 'cubic-bezier(0.4, 0, 0.6, 0.2)',
  curveDecelerateMax: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
  curveDecelerateMid: 'cubic-bezier(0.1, 0.7, 0.2, 0.9)',
  curveDecelerateMin: 'cubic-bezier(0.2, 0.4, 0.2, 0.6)',
  curveEasyEase: 'cubic-bezier(0.33, 0, 0.67, 1)',
  curveEasyEaseMax: 'cubic-bezier(0.8, 0, 0.2, 1)',
  curveLinear: 'cubic-bezier(0, 0, 1, 1)',

  // durations
  durationUltraFast: '50ms',
  durationFaster: '100ms',
  durationFast: '150ms',
  durationNormal: '200ms',
  durationGentle: '250ms',
  durationSlow: '300ms',
  durationSlower: '400ms',
  durationUltraSlow: '500ms'
}

export default pkmTheme
