/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Stitch 디자인 시스템 "The Academic Architect" 컬러 토큰
        primary: {
          DEFAULT: '#091426',
          container: '#1E293B',
          fixed: '#D8E3FB',
          'fixed-dim': '#BCC7DE',
        },
        secondary: {
          DEFAULT: '#0058BE',
          container: '#2170E4',
          fixed: '#D8E2FF',
          'fixed-dim': '#ADC6FF',
        },
        surface: {
          DEFAULT: '#FBF8FA',
          bright: '#FBF8FA',
          dim: '#DCD9DB',
          tint: '#545F73',
          variant: '#E4E2E3',
          container: {
            DEFAULT: '#F0EDEF',
            low: '#F5F3F4',
            lowest: '#FFFFFF',
            high: '#EAE7E9',
            highest: '#E4E2E3',
          },
        },
        on: {
          primary: '#FFFFFF',
          secondary: '#FFFFFF',
          surface: '#1B1B1D',
          'surface-variant': '#45474C',
          background: '#1B1B1D',
        },
        background: '#FBF8FA',
        outline: '#75777D',
        'outline-variant': '#C5C6CD',
        error: {
          DEFAULT: '#BA1A1A',
          container: '#FFDAD6',
        },
        tertiary: {
          DEFAULT: '#1E1200',
          container: '#35260C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
        display: ['Manrope', 'Noto Sans KR', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
      },
      boxShadow: {
        card: '0px 8px 32px rgba(9, 20, 38, 0.08)',
        float: '0px 12px 32px rgba(9, 20, 38, 0.08)',
      },
    },
  },
  plugins: [],
}
