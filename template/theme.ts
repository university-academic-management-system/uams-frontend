import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                accent: {
                    50: { value: '#f2f2ff' },
                    100: { value: '#e6e6ff' },
                    200: { value: '#ccccff' },
                    300: { value: '#b3b3ff' },
                    400: { value: '#9999ff' },
                    500: { value: '#8080ff' },
                    600: { value: '#6666ff' },
                    700: { value: '#4d4dff' },
                    800: { value: '#42429C' }, // Your base color
                    900: { value: '#33337a' },
                    950: { value: '#262659' }
                }
            },
            fonts: {
                heading: { value: "system-ui, sans-serif" },
                body: { value: "system-ui, sans-serif" },
            },
        },
        semanticTokens: {
            colors: {
                accent: {
                    solid: {
                        value: "{colors.accent.800}", // main solid color for buttons, etc.
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
                        value: "{colors.accent.900}", // stronger emphasis (headings, etc.)
                    },
                    focusRing: {
                        value: "{colors.accent.500}", // focus outlines, inputs, etc.
                    },
                },
                border: {
                    default: {
                        value: "{colors.gray.200}",
                    },
                },
            },
        },

        textStyles: {
            h1: { value: { fontSize: "2xl", fontWeight: "semibold" } },
        },
    },
    preflight: true,
    globalCss: {
        "html, body, #root": { height: "100%" },
    },
})

export const system = createSystem(defaultConfig, config)
