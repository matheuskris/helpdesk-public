/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js, jsx, ts, tsx}", "./src/**/*.{js, jsx, ts, tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(calc(100% + 24px))" },
          "100%": { transform: "translateX(0)" },
        },
        swipeOut: {
          "0%": { transform: "translateX(var(--radix-toast-swipe-move-x))" },
          "100%": { transform: "translateX(0)" },
        },
        hide: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
      animation: {
        slideOpen: "slideIn 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        hideClose: "hide 100ms ease-in",
        swipeOutEnd: "swipeOut 100ms ease-out",
      },
      data: {
        toastOpen: 'state~="open"',
        toastClosed: 'state~="closed"',
        toastMoved: 'swipe~="move"',
        toastCancel: 'swipe~="cancel"',
        toastEnd: 'swipe~="end"',
      },
    },
  },
  plugins: [],
};
