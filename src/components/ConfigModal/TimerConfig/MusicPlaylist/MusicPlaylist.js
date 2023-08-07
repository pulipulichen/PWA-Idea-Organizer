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
      addType: 'youtube',
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
      if (url === '' || 
            url.startsWith('http') === false || 
            url.split('/').length < 4 || 
            (url.indexOf('youtu') === -1 && url.indexOf('googl') === -1)) {
        // console.log('addURL false')
        this.isAddable = false
        return false
      }
      
      if (url.indexOf('youtu') > -1) {
        let youtubeID = YouTubeVideoIDParser(url)
        // console.log({youtubeID})
        if (youtubeID === false) {
          this.isAddable = false
          return false
        }

        for (let i = 0; i < this.syncConfig.musicPlaylist.length; i++) {
          //console.log(i)
          let item = this.syncConfig.musicPlaylist[i]
          //console.log(item)
          let itemYouTubeID = YouTubeVideoIDParser(item.url)
          
          if (itemYouTubeID === youtubeID) {
            // console.log({itemYouTubeID})
            this.isAddable = false
            return false
          }
        }
      }
      else {
        for (let i = 0; i < this.syncConfig.musicPlaylist.length; i++) {
          //console.log(i)
          let item = this.syncConfig.musicPlaylist[i]
          
          if (item.url === url) {
            // console.log({itemYouTubeID})
            this.isAddable = false
            return false
          }
        }
      }
       
      this.isAddable = true
      return true
    }
  },
  mounted () {
    //console.log(this.syncConfig.musicPlaylist)
       // this.init()
    //console.log('go')

    // let defaultYouTubeLink = 'https://www.youtube.com/watch?v=I1-zm1H4VvA'
    let defaultYouTubeLink = this.getPlayQuery()

    if (defaultYouTubeLink) {
      setTimeout(() => {
        //this.youtubeURL = defaultYouTubeLink
        //this.play()
        this.setPlay(defaultYouTubeLink)
      }, 3000)
    }
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
    setPlay (url, start, end, type) {
      url = url.trim()
      if (url === '') {
        return false
      }
      this.syncConfig.musicURL = url
      this.syncConfig.musicVideoStart = start
      this.syncConfig.musicVideoEnd = end

      if (!type) {
        type = 'youtube'
      }
      this.syncConfig.musicType = type
      
      // 重新調整順序
      this.syncConfig.musicPlaylist.sort((a, b) => {
        if (a.url === url) {
          return -1
        }
        else if (b.url === url) {
          return 1
        }
        else {
          return 0
        }
      })
      
      this.$parent.$parent.hide()
      this.$parent.$parent.$parent.$refs.TomatoTimer.playTimer()
    },
    openURL (url) {
      window.open(url, '_blank')
    },
    onMusicPlaylistChange () {
      //console.log('111')
      // console.log(this.syncConfig.musicPlaylist)
      this.syncConfig.musicPlaylist = this.syncConfig.musicPlaylist.concat([])
      //console.log(this.syncConfig.musicPlaylist)
    },
    addItem () {
      //console.log(this.syncConfig.musicPlaylist)
      this.syncConfig.musicPlaylist.unshift({
        title: this.addTitle,
        url: this.addURL,
        type: this.addType
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

      // let youtubeID = YouTubeVideoIDParser(url)
      // //console.log(url, youtubeID)
      // return (youtubeID !== false)

      return true
    },
    getPlayQuery () {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      let play = urlParams.get('play')
      play = decodeURIComponent(play)
      if (YouTubeVideoIDParser(play)) {
        return play
      }
      else {
        return false
      }
    },
    popup (url, name = '_blank') {
      // console.log(url.target.target)
      if (typeof(url) !== 'string') {
        name = url.target.target
        url = url.target.href
      }

      if (typeof(url) !== 'string') {
        return false
      }
      // console.log(url, name)
      this.utils.PopupUtils.openURLFullscreen(url, name)
    }
  } // methods
}

export default MusicPlaylist