export default function (app) {
  if (!app.computed) {
    app.computed = {}
  }

  app.computed.isPlaying = function () {
    return (this.isStarted === true && this.isPaused === false)
  }

  app.computed.isBGMPlayerPause = function () {
    if (this.isPaused === true) {
      return true
    }
    //console.log(this.isPaused)
    return this.isVolumeMute
  }

  app.computed.musicTitle = function () {
    let url = this.syncConfig.musicURL
    //console.log(url)
    //console.log(this.syncConfig.musicPlaylist)
    if (!this.syncConfig.musicPlaylist) {
      return url
    }
    
    for (let i = this.syncConfig.musicPlaylist.length - 1; i > -1; i--) {
      //console.log(i, url, this.syncConfig.musicPlaylist[i].url)
      if (url === this.syncConfig.musicPlaylist[i].url) {
        return this.syncConfig.musicPlaylist[i].title
      }
    }
    return url
  }

  app.computed.isYouTubePlayer = function  () {
    let url = this.syncConfig.musicURL
    return url.indexOf('youtu') > -1
  }

  app.computed.isHTMLVideoPlayer = function  () {
    let url = this.syncConfig.musicURL
    return url.indexOf('googl') > -1
  }
}