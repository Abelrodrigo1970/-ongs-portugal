/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#38a169',  // Verde mais claro que o anterior
          700: '#2f855a',  // Verde mais escuro para hover
          800: '#276749',
          900: '#22543d',
        },
        // Verde claro UNIVA
        univa: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // ODS colors mapping
        ods: {
          1: '#e5243b',   // Erradicar a pobreza
          2: '#dda63a',   // Erradicar a fome
          3: '#4c9f38',   // Saúde de qualidade
          4: '#c5192d',   // Educação de qualidade
          5: '#ff3a21',   // Igualdade de Género
          6: '#26bde2',   // Água Potável e Saneamento
          7: '#fcc30b',   // Energias Renováveis e Acessíveis
          8: '#a21942',   // Trabalho Digno e Crescimento Económico
          9: '#fd6925',   // Indústria, Inovação e Infraestruturas
          10: '#dd1367',  // Redução das Desigualdades
          11: '#fd9d24',  // Cidades e Comunidades Sustentáveis
          12: '#bf8b2e',  // Consumo e Produção Sustentáveis
          13: '#3f7e44',  // Ação Climática
          14: '#0a97d9',  // Proteger a Vida Marinha
          15: '#56c02b',  // Proteger a Vida Terrestre
          16: '#00689d',  // Paz, Justiça e Instituições Eficazes
          17: '#19486a',  // Parcerias para a Implementação dos Objetivos
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '6': '0.1rem',  // Custom p-6 padding
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}


