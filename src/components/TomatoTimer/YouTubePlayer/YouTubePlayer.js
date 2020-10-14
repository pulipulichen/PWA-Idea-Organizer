import './vendors/youtube-iframe-player-api/iframe_api.js'

let YoutubePlayer = {
  props: ['display', 'youtubeURL', 'volume'],
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
    }
  },
  watch: {
    volume () {
      if (this.inited === false) {
        return false
      }
      
      this.player.setVolume(this.volumeNumber)
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
  mounted () {
    this.init()
  },
  methods: {
    init() {
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
            videoId: 'I1-zm1H4VvA',
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
                event.target.unMute()
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
      if (this.inited !== true) {
        this.waitAction = 'play'
        return false
      }
      
      this.player.setVolume(this.volumeNumber)
      this.player.unMute()
      this.player.playVideo()
    },
    pause () {
      if (this.inited !== true) {
        this.waitAction = 'pause'
        return false
      }
      this.player.pauseVideo()
    },
    reset () {
      this.pause()
      
      if (this.player) {
        this.player.seekTo(0)
      }
    }
  } // methods
}

export default YoutubePlayer