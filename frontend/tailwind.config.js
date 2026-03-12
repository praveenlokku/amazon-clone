/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                amazon_blue: {
                    light: "#232f3e",
                    DEFAULT: "#131921",
                },
                amazon_yellow: "#febd69",
                amazon_orange: "#f08804",
            },
        },
    },
    plugins: [],
}
