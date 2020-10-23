let config = {
  debug: {
    ErrorHandler: {
      verbose: true
    }
  },
  locale: 'zh-TW',
  
  googleSheetAPIURL: 'https://script.google.com/macros/s/AKfycbxN92FLWBYYjc4Q6dgxAMQEnaLa-ZhkkoxfsInXoNu4NnuQJ9Hs/exec',
  enableSound: true,
  enableTomatoTimer: true,
  tomatoTimerSeconds: 25,
  musicURL: 'https://www.youtube.com/watch?v=I1-zm1H4VvA',
  saveToCloud: true
}

import styleConfig from './styles/style.config.js'
config.styleConfig = styleConfig

//import readingConfig from './../config/reading.js'
//config.readingConfig = readingConfig

import productionConfig from './config.production.js'
if (process.env.NODE_ENV === 'production') {
  for (let name in productionConfig) {
    config[name] = productionConfig[name]
  }
}

export default config