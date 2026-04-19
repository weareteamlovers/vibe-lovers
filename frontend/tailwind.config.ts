import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#090909',
        paper: '#f3efe6',
        mist: '#d7d0c5',
        line: 'rgba(243,239,230,0.12)',
        accent: '#dad1bf',
      },
      fontFamily: {
        sans: [
          '"SF Pro Text"',
          '"SF Pro KR"',
          '"SF Pro Display"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Apple SD Gothic Neo"',
          '"Pretendard Variable"',
          'Pretendard',
          '"Noto Sans KR"',
          '"Malgun Gothic"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 12px 50px rgba(0,0,0,0.18)',
      },
      backgroundImage: {
        grain:
          'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06), transparent 30%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.05), transparent 28%), radial-gradient(circle at 50% 100%, rgba(255,255,255,0.04), transparent 30%)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseLine: {
          '0%,100%': { opacity: '0.45' },
          '50%': { opacity: '0.9' },
        },
      },
      animation: {
        marquee: 'marquee 24s linear infinite',
        pulseLine: 'pulseLine 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;