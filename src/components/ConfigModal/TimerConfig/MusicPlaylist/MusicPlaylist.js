import draggable from 'vuedraggable'
import YouTubeVideoIDParser from './youtube-video-id-parser.js'

let MusicPlaylist = {
  props: ['config', 'utils', 'clientConfig', 'syncConfig'],
  data() {    
    this.$i18n.locale = this.config.locale
    return {
      searchKeyword: '',
      addTitle: '',
      addURL: '',
      isAddable: false
    }
  },
  components: {
    draggable,
  },
  /*
  computed: {
    isAddable () {
      let url = this.addURL.trim()
      console.log(url, )
      if (url === ''
              || url.startsWith('http') === false
              || url.split('/').length < 4
              || url.indexOf('youtu') === -1) {
        console.log('false')
        return false
      }
      
      let youtubeID = YouTubeVideoIDParser(url)
      console.log(youtubeID)
      if (!youtubeID) {
        return false
      }
      
      for (let i = 0; i < this.syncConfig.musicPlaylist.length; i++) {
        let itemYouTubeID = YouTubeVideoIDParser(this.syncConfig.musicPlaylist[i].url)
        console.log(itemYouTubeID)
        if (itemYouTubeID === youtubeID) {
          return false
        }
      }
      return true
    }
  },
   * 
   */
  watch: {
    addURL () {
      let url = this.addURL.trim()
      //console.log(url, )
      if (url === ''
              || url.startsWith('http') === false
              || url.split('/').length < 4
              || url.indexOf('youtu') === -1) {
        //console.log('false')
        this.isAddable = false
        return false
      }
      
      let youtubeID = YouTubeVideoIDParser(url)
      if (youtubeID === false) {
        this.isAddable = false
        return false
      }
      for (let i = 0; i < this.syncConfig.musicPlaylist.length; i++) {
        //console.log(i)
        let item = this.syncConfig.musicPlaylist[i]
        //console.log(item)
        let itemYouTubeID = YouTubeVideoIDParser(item.url)
        //console.log(itemYouTubeID)
        if (itemYouTubeID === youtubeID) {
          this.isAddable = false
          return false
        }
      }
      this.isAddable = true
      return true
    }
  },
//  mounted () {
//    //console.log(this.syncConfig.musicPlaylist)
//  },
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
      this.$parent.$parent.hide()
    },
    onMusicPlaylistChange () {
      //console.log('111')
      //console.log(this.syncConfig.musicPlaylist)
      this.syncConfig.musicPlaylist = this.syncConfig.musicPlaylist.concat([])
      //console.log(this.syncConfig.musicPlaylist)
    },
    addItem () {
      //console.log(this.syncConfig.musicPlaylist)
      this.syncConfig.musicPlaylist.unshift({
        title: this.addTitle,
        url: this.addURL
      })
      
      this.addTitle = ''
      this.addURL = ''
      
      setTimeout(() => {
        //console.log(this.$refs.MusicPlaylistItem[0], this.$refs.MusicPlaylistItemPlayButton[0])
        if (this.$refs.MusicPlaylistItem[0]) {
          this.$refs.MusicPlaylistItem[0].scrollIntoView({
              behavior: 'auto',
              block: 'center',
              inline: 'center'
          })
        }
        if (this.$refs.MusicPlaylistItemPlayButton[0]) {
          this.$refs.MusicPlaylistItemPlayButton[0].focus()
        }
      }, 0)
        
    },
    isValidedURL (url) {
      url = url.trim()
      if (url === '') {
        return false
      }
      let youtubeID = YouTubeVideoIDParser(url)
      //console.log(url, youtubeID)
      return (youtubeID !== false)
    }
  } // methods
}

export default MusicPlaylist