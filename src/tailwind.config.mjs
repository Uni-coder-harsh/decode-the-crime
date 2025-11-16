/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.04em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.03em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '500' }],
                xl: ['1.25rem', { lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '600' }],
                '2xl': ['1.5rem', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '600' }],
                '3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '700' }],
                '4xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '700' }],
                '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.03em', fontWeight: '800' }],
                '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '800' }],
                '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.05em', fontWeight: '900' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.06em', fontWeight: '900' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.07em', fontWeight: '900' }],
            },
            fontFamily: {
                heading: "space grotesk",
                paragraph: "azeret-mono"
            },
            colors: {
                // Hacker theme colors
                background: '#0a0a0a',
                foreground: '#00ff41',
                card: '#111111',
                'card-foreground': '#00ff41',
                popover: '#111111',
                'popover-foreground': '#00ff41',
                primary: '#00ff41',
                'primary-foreground': '#000000',
                secondary: '#1a1a2e',
                'secondary-foreground': '#00d4ff',
                muted: '#16213e',
                'muted-foreground': '#888888',
                accent: '#7b2cbf',
                'accent-foreground': '#ffffff',
                destructive: '#ff0040',
                'destructive-foreground': '#ffffff',
                border: '#00ff41',
                input: '#111111',
                ring: '#00ff41',
                // Custom hacker colors
                'neon-green': '#00ff41',
                'neon-blue': '#00d4ff',
                'neon-purple': '#7b2cbf',
                'dark-bg': '#0a0a0a',
                'dark-card': '#111111',
                'matrix-green': '#00ff41'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
