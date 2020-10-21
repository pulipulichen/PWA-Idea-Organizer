/* global Node */
import $ from 'jquery'

//let summernoteLoader = () => import('./summernote/summernote-lite.webpack.js')
import ConfigModal from './ConfigModal/ConfigModal.vue'
import TomatoTimer from './TomatoTimer/TomatoTimer.vue'
import ExitBlocker from './ExitBlocker/ExitBlocker.vue'

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
      inited: false,
      isBlockExit: false,
      //googleSheetAPIURL: 'https://script.google.com/macros/s/AKfycbxN92FLWBYYjc4Q6dgxAMQEnaLa-ZhkkoxfsInXoNu4NnuQJ9Hs/exec'
    }
  },
  components: {
    'config-modal': ConfigModal,
    'tomato-timer': TomatoTimer,
    'exit-blocker': ExitBlocker
  },
  computed: {
    enableSync () {
      return (typeof(this.clientConfig.googleSheetAPIURL) === 'string')
    }
  },
  watch: {
    // 轉移到 IndexWatchSync.js
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
    
    //var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    //alert(height)
    //var addressBarSize = parseFloat(getComputedStyle(document.documentElement).perspective) - document.documentElement.clientHeight
    //alert(addressBarSize)
    
    this.toastr = new Toastr({
      "positionClass": "toast-bottom-right index-toast"
    })
    //this.toastr.prop('id', 'indexToast')
    this.toastr.$container.id = 'indexToast'
    //console.log()
    
    this.loading = false
    this.inited = true
    $(document.body).addClass('inited')
  },
  methods: {
    onTomatoTimerTimeour () {
      //window.alert('ok')
      //this.toastr.success(this.$t('Time to break'))
    }
  }
}

import IndexWatchSync from './IndexWatchSync.js'
IndexWatchSync(Index)

import IndexEditor from './IndexEditor.js'
IndexEditor(Index)

import IndexSync from './IndexSync.js'
IndexSync(Index)

export default Index