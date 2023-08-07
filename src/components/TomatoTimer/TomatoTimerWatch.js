

export default function (app) {
  if (!app.watch) {
    app.watch = {};
  }

  app.watch.isPaused = function () {
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
  }
  app.watch.isStarted  = function () {
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
  }

  app.watch.BGMVolume = function () {
    localStorage.setItem('BGMVolume', this.BGMVolume)
    this.isVolumeMute = false
  }
  // 'clientConfig.displayWidgets' () {
  //   this.resetTimer()
  // }

}