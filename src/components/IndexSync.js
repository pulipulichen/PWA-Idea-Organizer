/* global Node */

import $ from 'jquery'

export default function (Index) {
  let preventUnloadEvent = function () {
    return true
  }
  let $window = $(window)
  let $document = $(document)
  
  let lastBlurTime = null
  let checkSyncDataTimer = null
  
  Index.methods.initCheckSyncData = function () {
    if (!this.enableSync) {
      return false
    }
    //console.log('初始化了嗎？')
    $window.bind('blur', () => {
      lastBlurTime = (new Date()).getTime()
      //console.log('離開了')
    })
    
    let minInterval = 30 * 60 * 1000
    //let minInterval = 3 * 1000
    $window.bind('focus', () => {
      let time = (new Date()).getTime()
      if (!lastBlurTime || lastBlurTime + minInterval > time) {
        return false
      }
      
      this.loading = true
      //return false
      //console.log('嘗試讀取')
      $.getJSON(this.clientConfig.googleSheetAPIURL, (data) => {
        //console.log(contents)
        //console.log(c)
        let contents = data.contents
        if (this.contents !== contents) {
          this.editor.summernote("code", contents)
          this.contents = contents
        }

        let configs = data.configs
        configs = JSON.parse(configs)
        //console.log(data)
        if (typeof(configs) === 'object') {
          Object.keys(configs).forEach(key => {
            this.syncConfig[key] = configs[key]
          })
        }
        this.loading = false
      })
    })
  }
    
  Index.methods.initData = async function () {
    if (!this.enableSync) {
      this.contents = localStorage.getItem('contents')
    }

    this.initCheckSyncData()
    return new Promise((resolve) => {
      window.googleDocCallback = function () { return true; };
      $.getJSON(this.clientConfig.googleSheetAPIURL, (data) => {
        //console.log(contents)
        //console.log(c)
        let contents = data.contents

        let configs = data.configs
        configs = JSON.parse(configs)
        //console.log(data)
        if (typeof(configs) === 'object') {
          Object.keys(configs).forEach(key => {
            this.syncConfig[key] = configs[key]
          })
        }
        resolve(contents)
        this.contents = contents
      })
    })
  }
  Index.methods.startSyncConfig = function () {
    if (this.loading === true) {
      return false
    }
    //console.log(contents)
    if (Object.keys(this.syncConfig).length === 0) {
      return false
    }

    if (this.configSaveToCloudTimer !== null) {
      clearTimeout(this.configSaveToCloudTimer)
    }
    else {
      //console.log('開始綁定')
      $window.bind('beforeunload', preventUnloadEvent)
    }

    
    this.configSaveToCloudTimer = setTimeout(() => {
      //console.log('startSyncConfig')
      $.post(this.clientConfig.googleSheetAPIURL, {
        configs: JSON.stringify(this.syncConfig)
      })
      
      setTimeout(() => {
        this.configSaveToCloudTimer = null
        //console.log('取消綁定')
        $window.unbind('beforeunload', preventUnloadEvent)
      }, 1000)
      
      //console.log('儲存：', contents)
    }, 6000)
  }
  
  Index.methods.startSyncContents = function () {
    if (this.loading === true) {
      return false
    }
    
    //console.log(contents)
    if (!this.contents || this.contents === ''
            || !this.enableSync) {
      return false
    }

    if (this.saveToCloudTimer !== null) {
      clearTimeout(this.saveToCloudTimer)
    }
    else {
      //console.log('開始綁定')
      $window.bind('beforeunload', preventUnloadEvent)
    }
    
    this.saveToCloudTimer = setTimeout(() => {
      $.post(this.clientConfig.googleSheetAPIURL, {
        contents: this.contents
      })
      
      setTimeout(() => {
        this.saveToCloudTimer = null
        //console.log('取消綁定')
        $window.unbind('beforeunload', preventUnloadEvent)
      }, 1000)
      
      //console.log('儲存：', contents)
    }, 6000)
  }
  
  Index.methods.setCustomStyle = function () {
    if (this.styleNode) {
      $(this.styleNode).remove()
    }
    //console.log('aaa')
    
    let styles = this.syncConfig.customStyle
    
    //console.log(styles)
    if (!styles || styles.trim() === '') {
      return false
    }
    
    let css = document.createElement('style'); 
    css.type = 'text/css'; 
    //console.log(1)
    if (css.styleSheet) {
      //console.log(1.5)
      css.styleSheet.cssText = styles; 
    }
    else { 
      //console.log(1.7)
      css.appendChild(document.createTextNode(styles))
    }
    //console.log(2)
    document.getElementsByTagName("head")[0].appendChild(css)
    //console.log(3)
    this.styleNode = css
  }
}