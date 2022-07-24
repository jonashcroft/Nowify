<template>
  <div id="app">
    <div
      v-if="player.playing"
      class="now-playing"
      :class="getNowPlayingClass()"
    >
      <div ref="coverDiv" class="now-playing__cover">
        <img
          ref="trackAlbum"
          :src="player.trackAlbum.image"
          :alt="player.trackTitle"
          class="now-playing__image"
        />
      </div>
      <div class="now-playing__details">
        <h1
          ref="trackTitle"
          class="now-playing__track"
          v-text="player.trackTitle"
        ></h1>
        <h2
          ref="trackArtists"
          class="now-playing__artists"
          v-text="getTrackArtists"
        ></h2>
        <progress
          ref="progressBar"
          max="1"
          class="now-playing__progressBar"
          :value="player.progressPercent"
        ></progress>
      </div>
    </div>
    <div v-else class="now-playing" :class="getNowPlayingClass()">
      <h1 ref="heading" class="now-playing__idle-heading">
        No music is playing 😔
      </h1>
      <h2 ref="secondary" class="now-playing__idle-secondary">
        💿 Hover your phone over an album cover to get started
      </h2>
    </div>
  </div>
</template>
<script src="node_modules/colorthief/dist/color-thief.umd.js"></script>

<script>
// import * as Vibrant from 'node-vibrant'
// const ColorThief = require('/color-thief-2.3.2/dist/color-thief.js')
// import { ColorThief } from '/color-thief-2.3.2/dist/color-thief.js'
// const ColorThief = require('colorthief')
import ColorThief from '/node_modules/colorthief/dist/color-thief.mjs'

import { gsap } from 'gsap'
import props from '@/utils/props.js'

export default {
  name: 'NowPlaying',

  props: {
    auth: props.auth,
    endpoints: props.endpoints,
    player: props.player
  },

  data() {
    return {
      pollPlaying: '',
      playerResponse: {},
      playerData: this.getEmptyPlayer(),
      colourPalette: '',
      swatches: []
    }
  },

  computed: {
    /**
     * Return a comma-separated list of track artists.
     * @return {String}
     */
    getTrackArtists() {
      return this.player.trackArtists.join(', ')
    }
  },

  mounted() {
    this.setDataInterval()
  },

  beforeDestroy() {
    clearInterval(this.pollPlaying)
  },

  methods: {
    /**
     * Make the network request to Spotify to
     * get the current played track.
     */
    async getNowPlaying() {
      let data = {}

      try {
        const response = await fetch(
          `${this.endpoints.base}/${this.endpoints.nowPlaying}`,
          {
            headers: {
              Authorization: `Bearer ${this.auth.accessToken}`
            }
          }
        )

        /**
         * Fetch error.
         */
        if (!response.ok) {
          throw new Error(`An error has occured: ${response.status}`)
        }

        /**
         * Spotify returns a 204 when no current device session is found.
         * The connection was successful but there's no content to return.
         */
        if (response.status === 204) {
          data = this.getEmptyPlayer()
          this.playerData = data

          this.$nextTick(() => {
            this.$emit('spotifyTrackUpdated', data)
          })

          return
        }

        data = await response.json()
        // console.log(data)
        // console.log(data.progress_ms)
        // console.log(data.progress_ms / 1000)
        // console.log(data.timestamp / 60)

        this.playerResponse = data
      } catch (error) {
        this.handleExpiredToken()

        data = this.getEmptyPlayer()
        this.playerData = data

        this.$nextTick(() => {
          this.$emit('spotifyTrackUpdated', data)
        })
      }
    },

    /**
     * Get the Now Playing element class.
     * @return {String}
     */
    getNowPlayingClass() {
      const playerClass = this.player.playing ? 'active' : 'idle'
      return `now-playing--${playerClass}`
    },

    /**
     * Get the colour palette from the album cover.
     */
    getAlbumColours() {
      /**
       * No image (rare).
       */
      if (!this.player.trackAlbum?.image) {
        return
      }

      /**
       * Run node-vibrant to get colours.
       */
      console.log('track album', this.player.trackAlbum)
      // Vibrant.from(this.player.trackAlbum.image)
      //   .quality(1)
      //   .clearFilters()
      //   .getPalette()
      //   .then(palette => {
      //     this.handleAlbumPalette(palette)
      //   })
      // console.log('ColorThief', ColorThief)

      // const colorThief = new ColorThief()
      // console.log('colorThief', colorThief)
      // const img = document.querySelector('img')
      // console.log(img)
      // let primaryCol
      // // Make sure image is finished loading
      // if (img.complete) {
      //   primaryCol = ColorThief.getColor(img)
      // } else {
      //   img.addEventListener('load', function() {
      //     ColorThief.getColor(img)
      //   })
      // }

      // const img = Promise.resolve(process.cwd(), this.player.trackAlbum)
      // const img = document.querySelector('img')
      const colorThief = new ColorThief()
      // const palette = colorThief.getPalette(this.$refs.trackAlbum.image)
      const img = document.querySelector('img')

      console.log(img)
      const imageURL = img.src
      let googleProxyURL =
        'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url='

      img.crossOrigin = 'Anonymous'
      document.querySelector('img').src =
        googleProxyURL + encodeURIComponent(imageURL)
      img.src = googleProxyURL + encodeURIComponent(imageURL)
      console.log(img)
      const handleFunc = this.handleAlbumPalette

      let primaryCol
      if (img.complete) {
        console.log('iother case e e')
        primaryCol = colorThief.getColor(img)
        this.handleAlbumPalette(primaryCol)
      } else {
        img.addEventListener('load', function() {
          console.log('in this')
          console.log(img.complete)
          primaryCol = colorThief.getColor(img)
          console.log(primaryCol)
          handleFunc(primaryCol)
        })
      }

      // const primaryCol = colorThief.getColor(this.player.trackAlbum.image)
      console.log('primaryCol', primaryCol)
      this.handleAlbumPalette(primaryCol)
    },

    /**
     * Return a formatted empty object for an idle player.
     * @return {Object}
     */
    getEmptyPlayer() {
      return {
        playing: false,
        trackAlbum: {},
        trackArtists: [],
        trackId: '',
        trackTitle: ''
      }
    },

    /**
     * Poll Spotify for data.
     */
    setDataInterval() {
      clearInterval(this.pollPlaying)
      this.pollPlaying = setInterval(() => {
        this.getNowPlaying()
      }, 2500)
    },

    /**
     * Set the stylings of the app based on received colours.
     */
    setAppColours() {
      document.documentElement.style.setProperty(
        '--color-text-primary',
        this.colourPalette.text
      )
      document.documentElement.style.setProperty(
        '--color-text-alternate',
        this.colourPalette.text === '#000000' ? '#ffffff' : '#000000'
      )
      document.documentElement.style.setProperty(
        '--colour-background-now-playing',
        this.colourPalette.background
      )
    },

    /**
     * Handle newly updated Spotify Tracks.
     */
    handleNowPlaying() {
      if (
        this.playerResponse.error?.status === 401 ||
        this.playerResponse.error?.status === 400
      ) {
        this.handleExpiredToken()

        return
      }

      console.log(this.playerResponse)
      /**
       * Player is active, but user has paused.
       */
      if (this.playerResponse.is_playing === false) {
        this.playerData = this.getEmptyPlayer()

        return
      }

      /**
       * The newly fetched track is the same as our stored
       * one, we don't want to update the DOM yet.
       */
      if (this.playerResponse.item?.id === this.playerData.trackId) {
        this.playerData.progressPercent =
          this.playerResponse.progress_ms / this.playerResponse.item.duration_ms
        return
      }

      /**
       * Store the current active track.
       */
      // console.log('duration ms', this.playerResponse.item.duration_ms)
      this.playerData = {
        playing: this.playerResponse.is_playing,
        trackArtists: this.playerResponse.item.artists.map(
          artist => artist.name
        ),
        trackTitle: this.playerResponse.item.name,
        progressPercent: 0,
        trackId: this.playerResponse.item.id,
        trackAlbum: {
          title: this.playerResponse.item.album.name,
          image: this.playerResponse.item.album.images[0].url
        }
      }
    },

    /**
     * Handle newly stored colour palette:
     * - Map data to readable format
     * - Get and store random colour combination.
     */
    handleAlbumPalette(palette) {
      const componentToHex = c => {
        var hex = c.toString(16)
        return hex.length == 1 ? '0' + hex : hex
      }
      const rgbToHex = (r, g, b) => {
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
      }

      // console.log(palette)
      // let albumColours = Object.keys(palette)
      //   .filter(item => {
      //     return item === null ? null : item
      //   })
      //   .map(colour => {
      //     // console.log(colour)
      //     // console.log(palette[colour].getTitleTextColor())
      //     // console.log(palette[colour].getHex())
      //     return {
      //       text: palette[colour].getTitleTextColor(),
      //       background: palette[colour].getHex()
      //     }
      //   })

      // this.swatches = albumColours
      // console.log(albumColours)
      // console.log(albumColours.length)
      // this.colourPalette = albumColours[Math.floor(albumColours.length / 2)]
      console.log('inside handle')
      console.log(rgbToHex(palette[0], palette[1], palette[2]))
      this.colourPalette = {
        text:
          palette[0] * 0.299 + palette[1] * 0.587 + palette[2] * 0.114 > 186
            ? '#000000'
            : '#ffffff',
        background: rgbToHex(palette[0], palette[1], palette[2])
      }
      gsap.to('.now-playing', {
        color: this.colourPalette.text,
        backgroundColor: this.colourPalette.background,
        duration: 1
      })

      this.setAppColours()
      this.$nextTick(() => {
        this.setAppColours()
      })
    },

    /**
     * Handle an expired access token from Spotify.
     */
    handleExpiredToken() {
      clearInterval(this.pollPlaying)
      this.$emit('requestRefreshToken')
    }
  },
  watch: {
    /**
     * Watch the auth object returned from Spotify.
     */
    auth: function(oldVal, newVal) {
      if (newVal.status === false) {
        clearInterval(this.pollPlaying)
      }
    },

    /**
     * Watch the returned track object.
     */
    playerResponse: function() {
      this.handleNowPlaying()
    },

    /**
     * Watch our locally stored track data.
     */
    playerData: function() {
      this.$emit('spotifyTrackUpdated', this.playerData)
      console.log('the track has changed')
      gsap.fromTo(
        [this.$refs.trackTitle, this.$refs.trackArtists],
        {
          autoAlpha: 0,
          stagger: 0.5,
          scale: 0.95
          // duration: 2
        },
        {
          autoAlpha: 1,
          stagger: 0.5,
          scale: 1,
          duration: 1
        }
      )
      gsap.to('.now-playing', {
        color: this.colourPalette.text,
        backgroundColor: this.colourPalette.background,
        duration: 1
      })

      this.$nextTick(() => {
        this.getAlbumColours()
      })
    }
  }
}
</script>

<style src="@/styles/components/now-playing.scss" lang="scss" scoped></style>
