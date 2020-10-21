import $ from 'jquery'
//import './vendors/jQuery.YoutubeBackground/jquery.youtubebackground.js'
import YouTubePlayer from './YouTubePlayer/YouTubePlayer.vue'
import endSound from './good-morning-502.mp3'

let TomatoTimer = {
  props: ['config', 'utils', 'clientConfig', 'syncConfig', 'toastr'],
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
      wholeTime: Number(this.syncConfig.tomatoTimerSeconds),
      //wholeTime: 25,
      progressLength: Math.PI * 2 * 100,
      BGMPlayer: null,
      BGMVolume: 50,
      endSoundObject: new Audio(endSound)
    }
  },
  components: {
    'youtube-player': YouTubePlayer
  },
//  computed: {
//  },
  watch: {
    isPaused () {
      if (!this.BGMPlayer) {
        return false
      }
      
      //console.log('pause', this.isPaused, this.BGMPlayerState, this.BGMPlayer)
      if (this.isPaused === true) {
        this.BGMPlayer.pause()
      }
      else if (this.isPaused === false) {
        this.BGMPlayer.play()
      }
    },
    isStarted () {
      //console.log('isStarted', this.isStarted, this.BGMPlayerState, this.BGMPlayer)
      if (!this.BGMPlayer) {
        return false
      }
      
      //this.BGMPlayer.playVideo()
      if (this.isStarted === true) {
        this.BGMPlayer.play()
      }
      else if (this.isStarted === false) {
        this.BGMPlayer.pause()
      }
    },
    BGMVolume () {
      localStorage.setItem('BGMVolume', this.BGMVolume)
    }
  },
  async mounted () {
    this.BGMVolume = localStorage.getItem('BGMVolume')
    if (isNaN(this.BGMVolume) === false && typeof(this.BGMVolume) === 'string') {
      this.BGMVolume = Number(this.BGMVolume)
    }
    else {
      this.BGMVolume = 50
    }
    
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
    this.BGMPlayer = this.$refs.BGMPlayer
    this.initSlider()
    this.inited = true
  },
  methods: {
    
    changeWholeTime(seconds) {
      //console.log(typeof(seconds), typeof(this.wholeTime))
      if ((this.wholeTime + seconds) > 0) {
        this.wholeTime += seconds;
        this.update(this.wholeTime, this.wholeTime);
        this.syncConfig.tomatoTimerSeconds = this.wholeTime
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
          
          this.onTimeout()
          return;
        }
        this.displayTimeLeft(this.timeLeft);
      }, 1000)
    },
    onTimeout () {
      this.endSoundObject.play()
      this.toastr.success(this.$t('Time to break'), null, {
          onclick: () => {
            //window.alert('aaa')
            this.endSoundObject.pause()
            this.endSoundObject.currentTime = 0
          }
      })
      this.$emit('timeout')
    },
    pauseTimer(event) {
      
      if (this.isStarted === false) {
        //console.log(this.wholeTime)
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
        this.BGMPlayer.reset()
      }
    },
    displayTimeLeft(timeLeft) { //displays time on the input
      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      this.displayOutput.textContent = displayString;
      this.update(timeLeft, this.wholeTime);
    },
    initSlider() {
      
      let mainColor = '#F7958E'
      let bg = function (n) {
        //console.log(n)
        r.css({
          'background-image': `-webkit-linear-gradient(left ,${mainColor} 0%,${mainColor} ` + n + '%,#fff ' + n + '%, #fff 100%)'
        });
      }
      var r = $(this.$refs.VolumeSlider)
      
      setTimeout(() => {
        bg(r.val())
      }, 0)
      
      r.on('mouseenter', function () {
        var p = r.val();
        r.on('click', function () {
          p = r.val();
          bg(p);
        });
        r.on('mousemove', function () {
          p = r.val();
          bg(p);
        });
      });
      
    }
  } // methods
}

export default TomatoTimer