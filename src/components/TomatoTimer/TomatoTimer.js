let TomatoTimer = {
  props: ['config', 'utils', 'clientConfig', 'syncConfig', 'defaultSeconds'],
  data() {
    this.$i18n.locale = this.config.locale
    return {
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
      progressLength: Math.PI * 2 * 100
    }
  },
//  components: {
//  },
//  computed: {
//  },
//  watch: {
//  },
  mounted() {
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
  },
  methods: {
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
      
      if (typeof(time) === 'number') {
        this.wholeTime = time
      }
      
      this.update(this.wholeTime, this.wholeTime); //refreshes progress bar
      this.displayTimeLeft(this.wholeTime)
      
      this.isStarted = false
      this.isPaused = false
      
      this.pauseBtn.classList.remove('pause');
      this.pauseBtn.classList.add('play');
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