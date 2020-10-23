/* global Node */

export default function (Index) {
  Index.watch.contents = function () {
    this.startSyncContents()
  }
  
  Index.watch["syncConfig.enableSound"] = function () {
    if (this.inited === false) {
      return false
    }
    this.editor.summernote('setOption', {
      enableTypeWriterSoundEffect: this.syncConfig.enableSound
    })

    this.startSyncConfig()
  }
  
  Index.watch['syncConfig.customStyle'] = function () {
    if (this.inited === false) {
      return false
    }
    this.setCustomStyle()
    //console.log('watch customStyle')
    this.startSyncConfig()
  }
  
  Index.watch['syncConfig.musicURL'] = function () {
    if (this.inited === false) {
      return false
    }
    this.startSyncConfig()
  }
  
  Index.watch['syncConfig.enableTomatoTimer'] = function () {
    if (this.inited === false) {
      return false
    }
    this.startSyncConfig()
  }
  
  Index.watch['syncConfig.tomatoTimerSeconds'] = function (tomatoTimerSeconds) {
    if (this.inited === false) {
      return false
    }
    
    if (!this.$refs.TomatoTimer) {
      return false
    }

    //console.log(tomatoTimerSeconds)
    this.$refs.TomatoTimer.resetTimer(tomatoTimerSeconds)

    this.startSyncConfig()
  }
  
  Index.watch['syncConfig.musicPlaylist'] = function () {
    if (this.inited === false) {
      return false
    }
    //console.log(this.syncConfig.musicPlaylist)
    //return false
    this.startSyncConfig()
  }
}