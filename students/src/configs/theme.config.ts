import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
    globalCss: {
        body: {
            backgroundColor: "{colors.bg}",
            color: "{colors.gray.800}",
            _dark: {
                backgroundColor: "{colors.bg.subtle}",
                color: "{colors.white}",
            },
        },
    },
    theme: {
        tokens: {
            colors: {
                test: {
                    value: "pink"
                },
                accent: {
                    DEFAULT: {
                        value: "#2926EB", // main brand accent
                    },
                    50: {
                        value: "#f8f8ff", // very light tint
                    },
                    100: {
                        value: "#f0f0ff",
                    },
                    200: {
                        value: "#e1e1ff",
                    },
                    300: {
                        value: "#d2d2ff",
                    },
                    400: {
                        value: "#c3c3ff",
                    },
                    500: {
                        value: "#2926EB", // base purple
                    },
                    600: {
                        value: "#2220c8",
                    },
                    700: {
                        value: "#1b1ba5",
                    },
                    800: {
                        value: "#14167e",
                    },
                    900: {
                        value: "#0d1157",
                    },
                },
            },

            fonts: {
                heading: { value: "Oak Sans, sans-serif" },
                body: { value: "Oak Sans, sans-serif" },
            },
        },
        semanticTokens: {
            colors: {
                accent: {
                    solid: {
                        value: "{colors.accent.600}", // main solid color for buttons, etc.
                    },
                    muted: {
                        value: "{colors.accent.400}", // lighter for hover or subtle accents
                    },
                    subtle: {
                        value: "{colors.accent.100}", // for light backgrounds
                    },
                    contrast: {
                        value: "{colors.accent.50}", // strong contrast areas
                    },
                    fg: {
                        value: "{colors.accent.700}", // text accent color
                    },
                    emphasized: {
                        value: "{colors.accent.800}", // stronger emphasis (headings, etc.)
                    },
                    focusRing: {
                        value: "{colors.accent.500}", // focus outlines, inputs, etc.
                    },
                },
                border: {
                    default: {
                        value: {
                            base: "{colors.gray.200}",
                            _dark: "{colors.gray.200}",
                        },
                    },
                },
            },
        },
    },
});

const themeSystem = createSystem(defaultConfig, config);
export default themeSystem;