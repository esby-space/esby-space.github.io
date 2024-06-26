import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    plugins: [typography],
    darkMode: "selector",
    theme: {
        extend: {
            colors: {
                primary: "#7700FF",
                lightish: "#D4D4D8",
                darkish: "#3F3F46"
            },
            fontFamily: {
                sans: ["Noto Sans", "system-ui", "sans-serif"],
            },
        },
    },
};
