/* global __webpack_public_path__ */
import Vue from 'vue'


// ----------------------------------
// plugins

import i18n from './i18n/i18n.js'

// ----------------------

import './styles/styles.js'
import template from './index.tpl'
import config from './config.js'

// --------------------
// Components or routes

//import components from './components/index.js'
import './components/index.js'

// -----------------------
// 確認 baseURL

let baseURL = __webpack_public_path__
baseURL = baseURL.split('/').slice(0, 3).join('/')

let baseScript = document.currentScript
if (baseScript) {
  
  let src = baseScript.src
  //console.log(src)
  if (src.startsWith('/')) {
    src = window.location.href
    console.log(src)
  }
  else {
    baseURL = src.split('/').slice(0, 3).join('/')
  }
  //console.log(baseURL)
  //if (enableBrowserTest && baseScript[0].src.startsWith(testBaseURL)) {
  //if (enableBrowserTest) {
  //}
  
  
  let appNode = document.createElement("div");
  appNode.id = 'app'
  baseScript.parentNode.insertBefore(appNode, baseScript);
  //baseScript.before(`<div id="app"></div>`)
}
config.baseURL = baseURL

// ---------------
// 錯誤訊息的設置

window.onerror = function(message, source, lineno, colno, error) {
  if (error === null) {
    error = message
  }
  //console.error(error)
  VueController.data.errors.push(error)
}

Vue.config.errorHandler  = function(err, vm, info) {
  //console.log(`errorHandler Error: ${err.stack}\nInfo: ${info}`);
  //console.error(err)
  VueController.data.errors.push(err)
}

// -----------------------

let VueController = {
  data: {
    config: config,
    status: {
    },
    progress: {
    },
    lib: {
    },
    errors: [],
    persistAttrs: [
    ]
  },
//  computed: { },
//  watch: {},
  //created: function () {
  //},
  mounted: function () {
//    
//    //console.log(this.lib.auth.nextStep)
    this.lib.Main = this.$refs.Main
  },
  
  //methods: { }, // methods: {
  
  
  // --------------------------
  // Basic configuration
  el: '#app',
  i18n: i18n,
  
  template: template,
  //components: components
}

if (typeof(baseURL) === 'string') {
  setTimeout(() => {
    new Vue(VueController)
    //$('body > #TestMessage').remove()
  }, 0)
}

// @Test
//window.VueController = VueController

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {

      // registration failed
      console.log('ServiceWorker registration failed: ', err);
    });
}