/* global fetch */

import $ from 'jquery'

export default function (Index) {
  let $window = $(window)
  let lastBlurTime = null
  let delayedSyncTimer = null
  let syncWait = 5000

  Index.methods.initCheckSyncData = function () {
    if (!this.enableSync) {
      return false
    }

    let minInterval = 30 * 60 * 1000
    let resetTomatoTimerMinInterval = 5 * 60 * 60 * 1000
    let delayedSyncWait = 30 * 1000

    $window.bind('blur', () => {
      lastBlurTime = (new Date()).getTime()

      if (delayedSyncTimer !== null) {
        clearTimeout(delayedSyncTimer)
        delayedSyncTimer = null
      }
    })

    $window.bind('focus', () => {
      let time = (new Date()).getTime()

      if (!lastBlurTime || lastBlurTime + minInterval > time) {
        return false
      }

      if (lastBlurTime + resetTomatoTimerMinInterval < time
              && this.$refs.TomatoTimer) {
        this.$refs.TomatoTimer.resetTimer()
      }

      if (delayedSyncTimer !== null) {
        clearTimeout(delayedSyncTimer)
      }

      delayedSyncTimer = setTimeout(async () => {
        delayedSyncTimer = null

        // Do not replace local data while a local change is waiting to be saved.
        if (this.saveContentsToCloudTimer !== null
                || this.saveConfigToCloudTimer !== null
                || this.isBlockExit === true) {
          return false
        }

        try {
          let data = await this.getDataFromGoogleSheet()
          if (!data) {
            return false
          }

          let contents = data.contents
          if (this.contents !== contents) {
            this.editor.summernote('code', contents)
            this.contents = contents
          }

          let configs = JSON.parse(data.configs)
          if (typeof(configs) === 'object' && configs !== null) {
            Object.keys(configs).forEach(key => {
              this.syncConfig[key] = configs[key]
            })
          }
        }
        catch (error) {
          console.error('Delayed sync failed', error)
        }
      }, delayedSyncWait)
    })
  }

  Index.methods.getDataFromGoogleSheet = function () {
    return new Promise((resolve, reject) => {
      fetch(this.clientConfig.googleSheetAPIURL)
        .then(async response => {
          let data = await response.json()
          resolve(data)
        })
        .catch(error => {
          console.error('Error', error)
          reject(error)
        })
    })
  }

  Index.methods.postDataToGoogleSheet = async function (data) {
    try {
      $.post(this.clientConfig.googleSheetAPIURL, data).fail(() => {}).error(() => {})
    }
    catch (e) {
    }
  }

  Index.methods.initData = async function () {
    if (!this.enableSync) {
      this.contents = localStorage.getItem('contents')
    }

    this.initCheckSyncData()
    return new Promise(async (resolve) => {
      window.googleDocCallback = function () { return true; };
      let data = await this.getDataFromGoogleSheet()
      let contents = data.contents

      let configs = data.configs
      configs = JSON.parse(configs)
      if (typeof(configs) === 'object') {
        Object.keys(configs).forEach(key => {
          this.syncConfig[key] = configs[key]
        })
      }

      this.contents = contents
      resolve(contents)
    })
  }

  Index.methods.startSyncConfig = function () {
    if (this.loading === true) {
      return false
    }
    if (Object.keys(this.syncConfig).length === 0) {
      return false
    }

    if (this.saveConfigToCloudTimer !== null) {
      clearTimeout(this.saveConfigToCloudTimer)
    }
    else {
      this.isBlockExit = true
    }

    this.saveConfigToCloudTimer = setTimeout(() => {
      this.postDataToGoogleSheet({
        configs: JSON.stringify(this.syncConfig)
      })

      setTimeout(() => {
        this.saveConfigToCloudTimer = null
        this.isBlockExit = false
      }, 1000)
    }, 6000)
  }

  Index.methods.startSyncContents = function () {
    if (this.loading === true) {
      return false
    }

    if (!this.contents || this.contents === '' || !this.enableSync) {
      return false
    }

    if (this.saveContentsToCloudTimer !== null) {
      clearTimeout(this.saveContentsToCloudTimer)
    }
    else {
      this.isBlockExit = true
    }

    if (this.config.saveToCloud === false) {
      this.isBlockExit = false
      return false
    }

    this.saveContentsToCloudTimer = setTimeout(() => {
      this.startSyncContentsPost()
    }, syncWait)
  }

  Index.methods.startSyncContentsPost = function () {
    this.postDataToGoogleSheet({
      contents: this.contents
    })

    setTimeout(() => {
      this.saveContentsToCloudTimer = null
      this.isBlockExit = false
    }, 1000)
  }

  Index.methods.setCustomStyle = function () {
    if (this.styleNode) {
      $(this.styleNode).remove()
    }

    let styles = this.syncConfig.customStyle
    if (!styles || styles.trim() === '') {
      return false
    }

    let css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet) {
      css.styleSheet.cssText = styles;
    }
    else {
      css.appendChild(document.createTextNode(styles));
    }
    document.getElementsByTagName('head')[0].appendChild(css)
    this.styleNode = css
  }

  Index.methods.syncNow = function () {
    clearTimeout(this.saveConfigToCloudTimer)
    this.saveConfigToCloudTimer = null
    clearTimeout(this.saveContentsToCloudTimer)
    this.saveContentsToCloudTimer = null

    this.postDataToGoogleSheet({
      contents: this.contents,
      configs: JSON.stringify(this.syncConfig)
    })

    this.isBlockExit = false
  }
}