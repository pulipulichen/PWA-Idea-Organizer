
//import './vendors/jQuery.YoutubeBackground/jquery.youtubebackground.js'
import YouTubePlayer from './YouTubePlayer/YouTubePlayer.vue'
import HTMLVideoPlayer from './HTMLVideoPlayer/HTMLVideoPlayer.vue'
import endSound from './sounds/good-morning-502.mp3'
import tickSound1 from './sounds/wood-clock-ticking1.ogg'
import tickSound2 from './sounds/wood-clock-ticking2.ogg'

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
      isVolumeMute: false,
      wholeTime: Number(this.syncConfig.tomatoTimerMinutes * 60),
      //wholeTime: 25,
      progressLength: Math.PI * 2 * 100,
      BGMPlayer: null,
      BGMVolume: 50,
      endSoundObject: new Audio(endSound),
      tickSound1Object: new Audio(tickSound1),
      tickSound2Object: new Audio(tickSound2),
    }
  },
  components: {
    'youtube-player': YouTubePlayer,
    HTMLVideoPlayer
  },
  computed: {
    // TomatoTimerComputed.js
  },
  watch: {
    //TomatoTimerWatch.js
  },
  async mounted () {
    this.init()
  },
  methods: {
    // TomatoTimerMethods.js
  } // methods
}

import TomatoTimerWatch from './TomatoTimerWatch.js'  
TomatoTimerWatch(TomatoTimer)

import TomatoTimerMethods from './TomatoTimerMethods.js'  
TomatoTimerMethods(TomatoTimer)

import TomatoTimerComputed from './TomatoTimerComputed.js'  
TomatoTimerComputed(TomatoTimer)

export default TomatoTimer