import draggable from 'vuedraggable'

let MusicPlaylist = {
  props: ['config', 'utils', 'clientConfig', 'syncConfig'],
  data() {    
    this.$i18n.locale = this.config.locale
    return {
      searchKeyword: ''
    }
  },
  components: {
    draggable,
  },
  computed: {
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    isMatchPlayingURL (url) {
      url = url.trim()
      if (url === '') {
        return false
      }
      
      return (this.syncConfig.musicURL === url)
    },
    isMatchSearchKeyword (keyword) {
      let searchKeyword = this.searchKeyword.trim().toLowerCase()
      if (searchKeyword === '') {
        return true
      }
      else {
        return (keyword.toLowerCase().indexOf(searchKeyword) > -1)
      }
    },
    removeItem (i) {
      if (i >= this.syncConfig.musicPlaylist.length) {
        return false
      }
      
      this.syncConfig.musicPlaylist.splice(i, 1)
    },
    setPlay (url) {
      url = url.trim()
      if (url === '') {
        return false
      }
      this.syncConfig.musicURL = url
    },
    onMusicPlaylistChange () {
      //console.log('111')
      this.syncConfig.musicPlaylist = this.syncConfig.musicPlaylist.concat([])
    }
  } // methods
}

export default MusicPlaylist