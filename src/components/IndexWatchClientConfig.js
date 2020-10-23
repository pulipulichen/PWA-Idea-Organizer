/* global Node */

export default function (Index) {
  Index.watch["clientConfig.timerSize"] = function () {
    this.saveClientConfig()
  }
  
  Index.watch["clientConfig.timerEnableTickingSound"] = function () {
    this.saveClientConfig()
  }
  
  Index.watch["clientConfig.enableTypeWriterSound"] = function () {
    if (this.inited === false) {
      return false
    }
    this.editor.summernote('setOption', {
      enableTypeWriterSoundEffect: this.clientConfig.enableTypeWriterSound
    })

    this.saveClientConfig()
  }
  
  // -----------------------
  
  Index.methods.saveClientConfig = function () {
    let config = JSON.stringify(this.clientConfig)
    localStorage.setItem('clientConfig', config)
  }
  
  Index.methods.restoreClientConfig = function () {
    let config = localStorage.getItem('clientConfig')
    if (!config) {
      return false
    }
    
    config = JSON.parse(config)
    for (let key in config) {
      this.clientConfig[key] = config[key]
    }
  }
}