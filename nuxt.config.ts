// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-08-08",
  devtools: { enabled: true },
  telemetry: false,
  css: ["~/assets/css/main.css"],
  icon: {
    provider: "server",
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
    serverBundle: {
      collections: ["lucide"],
    },
  },
  app: {
    head: {
      htmlAttrs: {
        class: "dark",
        lang: "en",
      },
      bodyAttrs: {
        class: "theme-dark",
      },
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
        },
      ],
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/hints",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxtjs/i18n",
  ],

  i18n: {
    locales: [
      { code: "en", language: "en-US", file: "en.json" },
      { code: "nl", language: "nl-NL", file: "nl.json" },
    ],
    defaultLocale: "en",
    strategy: "no_prefix",
    langDir: "locales",
    vueI18n: "./i18n.config.ts",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "portfolio-locale",
      redirectOn: "root",
    },
  },
});
