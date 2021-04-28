import './vendors/youtube-iframe-player-api/iframe_api.js'
import YouTubeVideoIDParser from './youtube-video-id-parser.js'

let YoutubePlayer = {
  props: ['display', 'youtubeURL', 'volume', 'isMute', 'isPause'],
  data() {    
    //this.$i18n.locale = this.config.locale
    return {
      waitAction: null,
      inited: false,
      player: null,
      state: null,
      playerID: null
    }
  },
//  components: {
//  },
  computed: {
    volumeNumber () {
      if (isNaN(this.volume)) {
        return 100
      }
      return Number(this.volume)
    },
    videoID () {
      let id = YouTubeVideoIDParser(this.youtubeURL)
      if (id === false) {
        id = 'I1-zm1H4VvA'
      }
      return id
    },
    isReady () {
      return (this.inited === true 
              && this.player 
              && typeof(this.player.setVolume) === 'function')
    }
  },
  watch: {
    volume () {
      if (this.inited === false) {
        return false
      }
      
      this.player.setVolume(this.volumeNumber)
    },
    youtubeURL () {
      this.player.destroy()
      this.player = null
      this.state = null
      this.inited = false
      //this.waitAction = null
      //console.log('youtube url changed', this.waitAction)
      setTimeout(() => {
        this.init()
      }, 100)
      
    },
    state () {
      //console.log(this.state)
      if (this.state === 0) {
        // 自動重播
        this.play()
        setTimeout(() => {
          this.player.setVolume(this.volumeNumber)
        }, 0)
      }
    },
    isMute () {
      if (this.isMute === true) {
        this.player.mute()
      }
      else {
        this.player.unMute()
      }
    },
    isPause () {
      if (this.isPause === true) {
        this.player.pauseVideo()
      }
      else {
        this.player.playVideo()
      }
    }
  },
  
/*
  watch: {
    inited () {
      console.log(this.inited)
      if (this.inited === true) {
        console.log(this.waitAction)
        if (this.waitAction === 'play') {
          this.play()
        }
        else if (this.waitAction === 'pause') {
          this.pause()
        }
      }
    }
  }, 
 */
 
//  mounted () {
//    this.init()
//  },
  methods: {
    init() {
      if (this.inited === true) {
        //console.log('已經初始化了')
        return false
      }
      //console.log('開始初始化')
      
      let _this = this
      return new Promise(async (resolve) => {
        let id 
        let inited = false
        while (true) {
          id = 'YouTubePlayer' + (new Date).getTime()
          if (!document.getElementById(id)) {
            break
          }
          else {
            await this.sleep()
          }
        }
        
        this.$refs.Main.id = id
           
        //console.log(111)
        let onYouTubeIframeAPIReady = () => {
          //console.log(122)
           
           this.player = new window.YT.Player(id, {
            height: '1',
            width: '1',
            //height: '150',
            //width: '300',
            playerVars: { 
              'autoplay': 0, 
              'controls': 1,
              showinfo: 0,
              branding: 0,
              rel: 0,
            },
            //videoId: 'M7lc1UVf-VE',
            videoId: this.videoID,
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          })
          //console.log(222)
        }

        // 4. The API will call this function when the video player is ready.
        let onPlayerReady = (event) => {
          //console.log(333)
          event.target.setVolume(0)
          event.target.mute()
          event.target.setLoop(true)
          
          event.target.playVideo()
        }

        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        //var done = false;
        let onPlayerStateChange = (event) => {
          //console.log(this.BGMPlayerState)
          this.state = event.data
          if (inited === false && event.data === 1) {
            inited = true
            //setTimeout(() => {
              event.target.pauseVideo()
              //console.log(1)
              
              //setTimeout(() => {
                event.target.setVolume(this.volumeNumber)
                if (this.isMute === false) {
                  event.target.unMute()
                }
                //console.log(2)
                
                //this.BGMPlayer = event.target
                //console.log(this.BGMPlayer)
                //setTimeout(() => {
                  //console.log(3)
                  //event.target.setVolume(100)
                  //event.target.unMute()
                  _this.inited = true
                  _this.checkWaitAction()
                  resolve(true)
                //}, 0)
              //}, 0)
            //}, 0)
          }
        }
        
        onYouTubeIframeAPIReady()
      })
    },
    checkWaitAction () {
      //console.log(this.inited)
      if (this.inited === true) {
        //console.log(this.waitAction)
        if (this.waitAction === 'play') {
          this.play()
        }
        else if (this.waitAction === 'pause') {
          this.pause()
        }
      }
    },
    sleep(ms = 100) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    play () {
      //console.log('play', this.inited)
      this.waitAction = 'play'
      this.init()
      //console.log(this.inited, this.isReady)
      if (this.isReady === false) {
        return false
      }
      
//      if (typeof(this.player.setVolume) !== 'function') {
//        this.inited = false
//        this.init()
//        return false
//      }
      if (typeof(this.player.setVolume) !== 'function') {
        //console.log('play is not ready. wait for restart')
        setTimeout(() => {
          this.play()
        }, 3000)
        return false
      }
      
      //console.log(this.player)
      this.player.setVolume(this.volumeNumber)
      //console.log(this.isMute)
      if (this.isMute === false) {
        this.player.unMute()
      }
      this.player.playVideo()
    },
    pause () {
      this.waitAction = 'pause'
      this.init()
      if (this.isReady === false) {
        return false
      }
      
      if (typeof(this.player.setVolume) !== 'function') {
        //console.log('play is not ready. wait for restart')
        setTimeout(() => {
          this.pause()
        }, 3000)
        return false
      }
      
//      if (typeof(this.player.setVolume) !== 'function') {
//        this.inited = false
//        this.init()
//        return false
//      }
      //console.log('pauseVideo()')   
      this.player.pauseVideo()
    },
    reset () {
      this.pause()
      //console.log('reset', this.isPause)
      if (this.player) {
        this.player.seekTo(0)
        
        if (this.isPause === true) {
          setTimeout(() => {
            this.pause()
          }, 100)
          
        }
      }
    },
//    setMute (isMute) {
//      
//    }
  } // methods
}

export default YoutubePlayer