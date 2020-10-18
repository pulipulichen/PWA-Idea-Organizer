/* global Node, fetch */

import $ from 'jquery'

export default function (Index) {
//  let preventUnloadEvent = function () {
//    return true
//  }
  let $window = $(window)
  let $document = $(document)
  
  let lastBlurTime = null
  let checkSyncDataTimer = null
  let syncWait = 100
  let syncEnable = true
  
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
    $window.bind('focus', async () => {
      let time = (new Date()).getTime()
      if (!lastBlurTime || lastBlurTime + minInterval > time) {
        return false
      }
      
      this.loading = true
      let data = await this.getDataFromGoogleSheet()
      //return false
      //console.log('嘗試讀取')
      //$.getJSON(this.clientConfig.googleSheetAPIURL, (data) => {
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
      //})
    })
  }
  
  Index.methods.getDataFromGoogleSheet = function () {
    return new Promise(resolve => {
      fetch(this.clientConfig.googleSheetAPIURL)
              .then(async response => {
                //console.log(await response.json())
                let data = await response.json()
                resolve(data)
              })
              .catch(error => console.error("Error", error))
    })
  }
  
  Index.methods.postDataToGoogleSheet = async function (data) {
    try {
      $.post(this.clientConfig.googleSheetAPIURL, data).fail(() => {}).error(() => {})
      /*
      $.ajax({
        type: 'POST',
        crossDomain: true,
        headers: {  'Access-Control-Allow-Origin': location.origin },
        data: data,
        //dataType: 'jsonp',
        url: this.clientConfig.googleSheetAPIURL,
        success: function(jsondata){

        }
     })
     */
    }
    catch (e) {
      
    }
    //axios.post(this.clientConfig.googleSheetAPIURL, data)
    /*
    var options = {
      'method' : 'post',
      'payload' : data
    };
    await UrlFetchApp.fetch(this.clientConfig.googleSheetAPIURL, options)
    */
    /*
    return new Promise(resolve => {
      fetch(this.clientConfig.googleSheetAPIURL, {
        //method: 'POST',
        body: JSON.stringify(data),
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: '*', // include, same-origin, *omit
        headers: {
          'user-agent': 'Mozilla/4.0 MDN Example',
          'content-type': 'application/json'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
      })
      .then(async response => {
        //console.log(await response.json())
        let data = await response.json()
        resolve(data)
      })
      .catch(error => console.error("Error", error))
    })
     */
  }
  
  Index.methods.initData = async function () {
    if (!this.enableSync) {
      this.contents = localStorage.getItem('contents')
    }

    this.initCheckSyncData()
    return new Promise(async (resolve) => {
      window.googleDocCallback = function () { return true; };
      let data = await this.getDataFromGoogleSheet()
      
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
          
          this.contents = contents
      resolve(contents)
      //$.getJSON(this.clientConfig.googleSheetAPIURL, (data) => {
        
      //})
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
      //$window.bind('beforeunload', preventUnloadEvent)
      this.isBlockExit = true
    }

    
    this.configSaveToCloudTimer = setTimeout(() => {
      //console.log('startSyncConfig')
      //$.post(this.clientConfig.googleSheetAPIURL, {
      //  configs: JSON.stringify(this.syncConfig)
      //})
      this.postDataToGoogleSheet({
        configs: JSON.stringify(this.syncConfig)
      })
      
      setTimeout(() => {
        this.configSaveToCloudTimer = null
        //console.log('取消綁定')
        //$window.unbind('beforeunload', preventUnloadEvent)
        this.isBlockExit = false
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
      //$window.bind('beforeunload', preventUnloadEvent)
      this.isBlockExit = true
    }
    
    if (syncEnable === false) {
      this.isBlockExit = false
      return false
    }
    
    this.saveToCloudTimer = setTimeout(() => {
      this.postDataToGoogleSheet({
        //configs: JSON.stringify(this.syncConfig)
        contents: this.contents
      })
      
      setTimeout(() => {
        this.saveToCloudTimer = null
        //console.log('取消綁定')
        //$window.unbind('beforeunload', preventUnloadEvent)
        this.isBlockExit = false
      }, 1000)
      
      //console.log('儲存：', contents)
    }, syncWait)
    //}, 1000)
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