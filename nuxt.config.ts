// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-scheduler'],
  devServer: {
    host: '0.0.0.0',
    port: 4000,
    https: {
      key: '/etc/letsencrypt/live/bloaryth.com/privkey.pem',
      cert: '/etc/letsencrypt/live/bloaryth.com/fullchain.pem'
    }
  }
})
