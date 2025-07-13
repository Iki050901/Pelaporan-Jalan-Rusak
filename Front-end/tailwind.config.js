module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Rubik', 'ui-sans-serif', 'system-ui'],
                poppins: ['Poppins', 'sans-serif'],
            },
            animation: {
                'fadeIn': "fadeIn 0.3s ease-out forwards",
            },
            keyframes: {
                'fadeIn': {
                    "0%": { opacity: 0, transform: "scale(0.95)" },
                    "100%": { opacity: 1, transform: "scale(1)" },
                },
                'slide-down': {
                    '0%': { transform: 'translateY(-20%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'animation': {
                    'fade-in': 'fade-in 0.3s ease-out',
                    'slide-down': 'slide-down 0.3s ease-out',
                }
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require('@tailwindcss/aspect-ratio'),
    ],
};