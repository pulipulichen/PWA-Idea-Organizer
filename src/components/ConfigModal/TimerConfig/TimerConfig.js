import $ from 'jquery'
import MusicPlaylist from './MusicPlaylist/MusicPlaylist.vue'

let TimerConfig = {
  props: ['config', 'utils', 'clientConfig', 'syncConfig'],
  data() {    
    this.$i18n.locale = this.config.locale
    return {
    }
  },
  components: {
    "music-playlist": MusicPlaylist
  },
  computed: {
    playingMusicTitle () {
      let url = this.syncConfig.musicURL.trim()
      if (url === '') {
        return this.$t('(No title)')
      }
      
      for (let i = 0; i < this.syncConfig.musicPlaylist.length; i++) {
        let item = this.syncConfig.musicPlaylist[i]
        if (item.url === url) {
          return item.title.trim()
        }
      }
      return this.$t('(No title)')
    }
//    sharable() {
//      return (typeof(window.navigator.share) === 'object')
//    }
  },
//  watch: {
//  },
//  mounted() {
//  },
  methods: {
    initCheckbox () {
      $(this.$refs.main).checkbox()
    },
//    async shareYouTubeURL() {
//      await window.navigator.share({
//        titile: 'youtube music',
//        url: this.syncConfig.musicURL
//      })
//    }
  } // methods
}

export default TimerConfig