<template>
  <div class="authorise">
    <h1 class="authorise__heading">Nowify</h1>

    <p class="authorise__copy">
      Nowify is a simple Spotify 'Now Playing' screen designed for the Raspberry
      Pi. Login with Spotify below and start playing some music!
    </p>

    <button
      class="authorise__button button button--authorise"
      @click="initAuthorise"
    >
      Login with Spotify
    </button>

    <p class="authorise__credit">
      <a href="https://github.com/jonashcroft/Nowify">View on GitHub</a>
    </p>
  </div>
</template>

<script>
import props from '@/utils/props.js'

const searchParams = new URLSearchParams()
const currentParams = new URLSearchParams(window.location.search)

export default {
  name: 'Authorise',

  components: {},

  props: {
    auth: props.auth,
    endpoints: props.endpoints
  },

  data() {
    return {}
  },

  computed: {},

  mounted() {
    /**
     * Set access token on load.
     */
    this.getUrlAuthCode()

    /**
     * Refresh token already exists - we must get a new one.
     */
    if (this.auth.refreshToken) {
      this.requestAccessTokens('refresh_token')
    }
  },

  methods: {
    /**
     * Initial Spotify auth, redirects the user to
     * Spotify to grant app consent, user will
     * be redirected back to the app.
     */
    initAuthorise() {
      this.setAuthUrl()
      window.location.href = `${this.endpoints.auth}?${searchParams.toString()}`
    },

    /**
     * Check to see if the URL contains an auth code
     * returned after the user grants consent from Spotify.
     */
    getUrlAuthCode() {
      const urlAuthCode = currentParams.get('code')

      if (!urlAuthCode) {
        return
      }

      this.auth.authCode = urlAuthCode
    },

    /**
     * Request the initial access and refresh tokens from Spotify.
     */
    async requestAccessTokens(grantType = 'authorization_code') {
      let fetchData = {
        grant_type: grantType
      }

      if (grantType === 'authorization_code') {
        ;(fetchData.code = this.auth.authCode),
          (fetchData.redirect_uri = window.location.origin +'/')
      }

      if (grantType === 'refresh_token') {
        fetchData.refresh_token = this.auth.refreshToken
      }

      const queryBody = new URLSearchParams(fetchData).toString()

      const clientDetails = btoa(
        `${this.auth.clientId}:${this.auth.clientSecret}`
      )

      const res = await fetch(`${this.endpoints.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${clientDetails}`
        },
        body: queryBody
      })

      const data = await res.json()
      const accessTokenResponse = data

      this.handleAccessTokenResponse(accessTokenResponse)
    },

    /**
     * Handle the data returned from Spotify.
     * @param {Object} accessTokenResponse - response object from fetch.
     */
    handleAccessTokenResponse(accessTokenResponse = {}) {
      /**
       * Auth token expired.
       */
      if (accessTokenResponse.error?.error === 'invalid_grant') {
        return
      }

      /**
       * Access Token has expired.
       */
      if (accessTokenResponse.error?.status === 401) {
        this.auth.authCode = ''
        this.auth.status = false

        return
      }

      /**
       * Successful.
       */
      if (accessTokenResponse.access_token) {
        this.auth.accessToken = accessTokenResponse.access_token

        if (accessTokenResponse.refresh_token) {
          this.auth.refreshToken = accessTokenResponse.refresh_token
        }

        this.auth.status = true

        /**
         * There has to be a better way than this.
         */
        const param = param != 'undefined' ? param : ''
        window.history.replaceState(
          null,
          null,
          location.protocol +
            '//' +
            location.host +
            location.pathname +
            location.search
              .replace(/[?&]code=[^&]+/, '')
              .replace(/^&/, '?')
              .replace(/[?&]state=[^&]+/, '')
              .replace(/^&/, '?')
        )
      }
    },

    /**
     * Set the initial Spotify authorisation URL
     * in which the user will be redirected to.
     */
    setAuthUrl() {
      searchParams.toString()
      searchParams.append('client_id', this.auth.clientId)
      searchParams.append('response_type', 'code')
      searchParams.append('redirect_uri', window.location.origin + '/')
      searchParams.append(
        'state',
        [
          Math.random()
            .toString(33)
            .substring(2),
          Math.random()
            .toString(34)
            .substring(3),
          Math.random()
            .toString(35)
            .substring(4),
          Math.random()
            .toString(36)
            .substring(5)
        ].join('-')
      )
      searchParams.append('scope', 'user-read-currently-playing')

      return `${this.endpoints.auth}?${searchParams.toString()}`
    }
  },

  watch: {
    /**
     * Watch authorisation code.
     */
    'auth.authCode': function() {
      this.requestAccessTokens()
    },

    /**
     * Watch authorisation status.
     */
    'auth.status': function() {
      if (this.auth.refreshToken) {
        this.requestAccessTokens('refresh_token')
      }
    }
  }
}
</script>

<style src="@/styles/components/authorise.scss" lang="scss" scoped></style>
