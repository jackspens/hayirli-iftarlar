/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ramadan: {
                    50: '#fefbec',
                    100: '#fdf2c5',
                    200: '#fae38e',
                    300: '#f6cd4a',
                    400: '#f2b51a',
                    500: '#eaa20d',
                    600: '#cb7b09',
                    700: '#a7560b',
                    800: '#894310',
                    900: '#713612',
                    950: '#411b06',
                }
            }
        },
    },
    plugins: [],
}
