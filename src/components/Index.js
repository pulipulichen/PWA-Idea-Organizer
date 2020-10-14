/* global Node */
import $ from 'jquery'

//let summernoteLoader = () => import('./summernote/summernote-lite.webpack.js')
import ConfigModal from './ConfigModal/ConfigModal.vue'
import TomatoTimer from './TomatoTimer/TomatoTimer.vue'

import Toastr from 'toastr2';
import 'toastr2/dist/toastr.min.css';

let Index = {
  props: ['config', 'utils', 'syncConfig', 'clientConfig'],
  data () {    
    this.$i18n.locale = this.config.locale
    return {
      contents: '',
      //test: 'aaa',
      editor: null,
      loading: true,
      enableChange: false,
      saveToCloudTimer: null,
      configSaveToCloudTimer: null,
      styleNode: null,
      toastr: null,
      //googleSheetAPIURL: 'https://script.google.com/macros/s/AKfycbxN92FLWBYYjc4Q6dgxAMQEnaLa-ZhkkoxfsInXoNu4NnuQJ9Hs/exec'
    }
  },
  components: {
    'config-modal': ConfigModal,
    'tomato-timer': TomatoTimer
  },
  computed: {
    enableSync () {
      return (typeof(this.clientConfig.googleSheetAPIURL) === 'string')
    }
  },
  watch: {
    'contents' () {
      this.startSyncContents()
    },
    'syncConfig.enableSound' () {
      if (this.loading === true) {
        return false
      }
      this.editor.summernote('setOption', {
        enableTypeWriterSoundEffect: this.syncConfig.enableSound
      })
      
      this.startSyncConfig()
    },
    'syncConfig.customStyle' () {
      if (this.loading === true) {
        return false
      }
      this.setCustomStyle()
      //console.log('watch customStyle')
      this.startSyncConfig()
    },
    'syncConfig.tomatoTimerSeconds' (tomatoTimerSeconds) {
      if (!this.$refs.TomatoTimer) {
        return false
      }
      
      this.$refs.TomatoTimer.resetTimer(tomatoTimerSeconds)
    }
  },
  async mounted () {
    
    //this.saveToCloudTimer = null
    //this.googleSheetAPIURL = 'https://script.google.com/macros/s/AKfycbxN92FLWBYYjc4Q6dgxAMQEnaLa-ZhkkoxfsInXoNu4NnuQJ9Hs/exec'
    
    //console.log(this)
    //summernoteLoader()
    //this.loading = false
    
    //setTimeout(() => {
      //this.$refs.ConfigModal.show()
    //}, 1000)
    
    
    await this.initData()
    await this.initEditor()
    this.setCustomStyle()
    //this.$refs.ConfigModal.show()
    
    this.loading = false
    
    //var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    //alert(height)
    //var addressBarSize = parseFloat(getComputedStyle(document.documentElement).perspective) - document.documentElement.clientHeight
    //alert(addressBarSize)
    
    this.toastr = new Toastr({
      "positionClass": "toast-bottom-right"
    })
  },
  methods: {
    onTomatoTimerTimeour () {
      //window.alert('ok')
      this.toastr.success(this.$t('Time to break'))
    }
  }
}

import IndexEditor from './IndexEditor.js'
IndexEditor(Index)

import IndexSync from './IndexSync.js'
IndexSync(Index)

export default Index