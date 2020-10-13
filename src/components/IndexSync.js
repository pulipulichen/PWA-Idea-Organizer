/* global Node */

import $ from 'jquery'

export default function (Index) {
  let preventUnloadEvent = function () {
    return true
  }
  let $window = $(window)
    
  Index.methods.loadData = async function () {
    if (!this.enableSync) {
      this.contents = localStorage.getItem('contents')
    }

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
    }, 3000)
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
      console.log('開始綁定')
      $window.bind('beforeunload', preventUnloadEvent)
    }
    
    this.saveToCloudTimer = setTimeout(() => {
      $.post(this.clientConfig.googleSheetAPIURL, {
        contents: this.contents
      })
      
      setTimeout(() => {
        this.saveToCloudTimer = null
        console.log('取消綁定')
        $window.unbind('beforeunload', preventUnloadEvent)
      }, 1000)
      
      //console.log('儲存：', contents)
    }, 3000)
  }
}