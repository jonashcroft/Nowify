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
import props from '@/utils/props.js';

const searchParams = new URLSearchParams()
const currentParams = new URLSearchParams(window.location.search)

export default {
  name: 'AuthoriseSpotify',
  props: {
    auth: props.auth,
    endpoints: props.endpoints
  },
  data() {
    return {
      localAuth: { ...this.auth }
    }
  },
  mounted() {
    /**
     * Set access token on load.
     */
    this.getUrlAuthCode();
  },
  methods: {
    initAuthorise() {
      this.setAuthUrl()
      window.location.href = `${this.endpoints.auth}?${searchParams.toString()}`
    },
    getUrlAuthCode() {
      const urlAuthCode = currentParams.get('code')
      if (!urlAuthCode) {
        return
      }
      this.localAuth.authCode = urlAuthCode
      this.$emit('update-auth', this.localAuth)
    },
    async requestAccessTokens(grantType = 'authorization_code') {
      let fetchData = {
        grant_type: grantType
      }
      if (grantType === 'authorization_code') {
        fetchData.code = this.localAuth.authCode
        fetchData.redirect_uri = window.location.origin
      } else if (grantType === 'refresh_token') {
        fetchData.refresh_token = this.localAuth.refreshToken
      }

      const queryBody = new URLSearchParams(fetchData).toString()
      const clientDetails = btoa(`${this.localAuth.clientId}:${this.localAuth.clientSecret}`)
      try {
      const res = await fetch(`${this.endpoints.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${clientDetails}`
        },
        body: queryBody
      })

      const data = await res.json()
      this.handleAccessTokenResponse(data)
      } catch (error) {
        console.error("Error obtaining authorization token: ", error);
      }
    },
    handleAccessTokenResponse(accessTokenResponse = {}) {
      if (accessTokenResponse.error) {
        if (accessTokenResponse.error.error === 'invalid_grant' || accessTokenResponse.error.status === 401) {
          this.localAuth.authCode = ''
          this.localAuth.status = false
          this.$emit('update-auth', this.localAuth)
          return
        }
      }

      if (accessTokenResponse.access_token) {
        this.localAuth.accessToken = accessTokenResponse.access_token
        if (accessTokenResponse.refresh_token) {
          this.localAuth.refreshToken = accessTokenResponse.refresh_token
        }
        this.localAuth.status = true
        this.$emit('update-auth', this.localAuth)
      }
    },
    setAuthUrl() {
      searchParams.append('client_id', this.localAuth.clientId)
      searchParams.append('response_type', 'code')
      searchParams.append('redirect_uri', window.location.origin)
      searchParams.append('scope', 'user-read-currently-playing')
      searchParams.append('state', [
        Math.random().toString(33).substring(2),
        Math.random().toString(34).substring(3),
        Math.random().toString(35).substring(4),
        Math.random().toString(36).substring(5)
      ].join('-'))
    }
  },
  watch: {
    'localAuth.authCode': function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.requestAccessTokens()
      }
    },
    'localAuth.status': function(newVal, oldVal) {
      if (newVal !== oldVal && this.localAuth.refreshToken) {
        this.requestAccessTokens('refresh_token')
      }
    }
  }
}
</script>

<style src="@/styles/components/authorise.scss" lang="scss" scoped></style>
