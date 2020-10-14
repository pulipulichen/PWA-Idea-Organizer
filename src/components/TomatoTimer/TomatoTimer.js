import $ from 'jquery'
//import './vendors/jQuery.YoutubeBackground/jquery.youtubebackground.js'
import './vendors/youtube-iframe-player-api/iframe_api.js'

let TomatoTimer = {
  props: ['config', 'utils', 'clientConfig', 'syncConfig', 'defaultSeconds', 'bgm'],
  data() {
    this.$i18n.locale = this.config.locale
    return {
      inited: true,
      progressBar: null,
      indicator: null,
      pointer: null,
      displayOutput: null,
      pauseBtn: null,
      setterBtns: null,
      intervalTimer: null,
      timeLeft: null,
      isPaused: false,
      isStarted: false,
      wholeTime: this.defaultSeconds,
      //wholeTime: 25,
      progressLength: Math.PI * 2 * 100,
      BGMPlayer: null,
      BGMPlayerState: null
    }
  },
//  components: {
//  },
//  computed: {
//  },
  watch: {
    isPaused () {
      if (!this.BGMPlayer) {
        return false
      }
      
      //console.log('pause', this.isPaused, this.BGMPlayerState, this.BGMPlayer)
      if (this.isPaused === true
              && this.BGMPlayerState === 1) {
        this.BGMPlayer.pauseVideo()
      }
      else if (this.isPaused === false
              && this.BGMPlayerState === 2) {
        this.BGMPlayer.playVideo()
      }
    },
    isStarted () {
      //console.log('isStarted', this.isStarted, this.BGMPlayerState, this.BGMPlayer)
      if (!this.BGMPlayer) {
        return false
      }
      
      //this.BGMPlayer.playVideo()
      if (this.isStarted === true
              && (this.BGMPlayerState === 1
              || this.BGMPlayerState === -1
              || this.BGMPlayerState === 2)) {
        this.BGMPlayer.playVideo()
      }
      else if (this.isStarted === false
              && this.BGMPlayerState === 2) {
        this.BGMPlayer.pauseVideo()
      }
    }
  },
  async mounted () {
    //circle start
    this.progressBar = this.$refs.Progress
    this.indicator = this.$refs.Indicator //  document.getElementById('e-indicator'); // 不知道為什麼找不到這個 
    this.pointer = this.$refs.Pointer
    //let length = Math.PI * 2 * 100;

    this.progressBar.style.strokeDasharray = this.progressLength;

    //circle ends
    this.displayOutput = this.$refs.DisplayRemainTime
    this.pauseBtn = this.$refs.Pause
    //this.setterBtns = document.querySelectorAll('button[data-setter]');
    this.setterBtns = this.$refs.DataSetterButtons

    //let intervalTimer;
    //let timeLeft;
    //let wholeTime = 0.5 * 60; // manage this to set the whole time 
    //let isPaused = false;
    //let isStarted = false;

    this.resetTimer()
    //this.update(this.wholeTime, this.wholeTime); //refreshes progress bar
    //this.displayTimeLeft(this.wholeTime)
    
    //console.log('有嗎？')
    await this.initBGM()
    this.inited = true
  },
  methods: {
    initBGM() {
      return new Promise(async (resolve) => {
        let inited = false
        //console.log(111)
        let onYouTubeIframeAPIReady = () => {
          //console.log(122)
           this.BGMPlayer = new window.YT.Player('BGMContainer', {
            //height: '1',
            //width: '1',
            height: '60',
            width: '100',
            playerVars: { 
              'autoplay': 0, 
              'controls': 0,
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
          event.target.playVideo()
        }

        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        //var done = false;
        let onPlayerStateChange = (event) => {
          //console.log(this.BGMPlayerState)
          this.BGMPlayerState = event.data
          if (inited === false && event.data === 1) {
            setTimeout(() => {
              inited = true
              setTimeout(() => {
                event.target.pauseVideo()
                event.target.setLoop(true)
                event.target.setVolume(100)
                //this.BGMPlayer = event.target
                //console.log(this.BGMPlayer)
                resolve(true)
              }, 0)
            }, 0)
          }
        }
        
        onYouTubeIframeAPIReady()
      })
    },
    sleep(ms = 100) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    changeWholeTime(seconds) {
      if ((this.wholeTime + seconds) > 0) {
        this.wholeTime += seconds;
        this.update(this.wholeTime, this.wholeTime);
      }
    },
    update(value, timePercent) {
      var offset = -this.progressLength - this.progressLength * value / (timePercent);
      this.progressBar.style.strokeDashoffset = offset;
      this.pointer.style.transform = `rotate(${360 * value / (timePercent)}deg)`;
    }, 
    onSetterButtonClick (event) {
      var param = event.target.dataset.setter
      //console.log(param)
      switch (param) {
        case 'minutes-plus':
          this.changeWholeTime(1 * 60);
          break;
        case 'minutes-minus':
          this.changeWholeTime(-1 * 60);
          break;
        case 'seconds-plus':
          this.changeWholeTime(1);
          break;
        case 'seconds-minus':
          this.changeWholeTime(-1);
          break;
      }
      this.displayTimeLeft(this.wholeTime);
    },
    timer(seconds) { //counts time, takes seconds
      let remainTime = Date.now() + (seconds * 1000);
      this.displayTimeLeft(seconds);

      this.intervalTimer = setInterval(() => {
        this.timeLeft = Math.round((remainTime - Date.now()) / 1000);
        if (this.timeLeft < 0) {
          clearInterval(this.intervalTimer);
          this.isStarted = false;
          //this.setterBtns.forEach(function (btn) {
          //  btn.disabled = false;
          //  btn.style.opacity = 1;
          //});
          this.displayTimeLeft(this.wholeTime);
          this.pauseBtn.classList.remove('pause');
          this.pauseBtn.classList.add('play');
          
          this.$emit('timeout')
          return;
        }
        this.displayTimeLeft(this.timeLeft);
      }, 1000)
    },
    pauseTimer(event) {
      
      if (this.isStarted === false) {
        console.log(this.wholeTime)
        this.timer(this.wholeTime);
        this.isStarted = true;
        
        this.pauseBtn.classList.remove('play');
        this.pauseBtn.classList.add('pause');

        this.setterBtns.forEach(function (btn) {
          btn.disabled = true;
          btn.style.opacity = 0.5;
        });
      } 
      else if (this.isPaused) {
        this.pauseBtn.classList.remove('play');
        this.pauseBtn.classList.add('pause');
        
        this.timer(this.timeLeft);
        this.isPaused = this.isPaused ? false : true
      } 
      else {
        this.pauseBtn.classList.remove('pause');
        this.pauseBtn.classList.add('play');
        
        clearInterval(this.intervalTimer);
        this.isPaused = this.isPaused ? false : true;
      }
    },
    resetTimer (time) {
      clearInterval(this.intervalTimer)
      
      //console.log(time, typeof(time))
      if (isNaN(time) === false) {
        time = Number(time)
      }
      if (typeof(time) === 'number') {
        this.wholeTime = time
      }
      
      this.update(this.wholeTime, this.wholeTime); //refreshes progress bar
      this.displayTimeLeft(this.wholeTime)
      
      this.isStarted = false
      this.isPaused = false
      
      this.pauseBtn.classList.remove('pause');
      this.pauseBtn.classList.add('play');
      
      if (this.BGMPlayer) {
        this.BGMPlayer.seekTo(0)
      }
    },
    displayTimeLeft(timeLeft) { //displays time on the input
      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      this.displayOutput.textContent = displayString;
      this.update(timeLeft, this.wholeTime);
    }
  } // methods
}

export default TomatoTimer