/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: { primary: "#7700FF" },
            fontFamily: {
                sans: ["Noto Sans", "system-ui", "sans-serif"]
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
}
