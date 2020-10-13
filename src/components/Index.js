/* global Node */
import $ from 'jquery'

//let summernoteLoader = () => import('./summernote/summernote-lite.webpack.js')
import ConfigModal from './ConfigModal/ConfigModal.vue'

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
      //googleSheetAPIURL: 'https://script.google.com/macros/s/AKfycbxN92FLWBYYjc4Q6dgxAMQEnaLa-ZhkkoxfsInXoNu4NnuQJ9Hs/exec'
    }
  },
  components: {
    'config-modal': ConfigModal
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
      this.startSyncConfig()
    },
    'syncConfig.customStyle' () {
      //console.log('watch customStyle')
      this.startSyncConfig()
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
    
    
    await this.loadData()
    await this.initEditor()
    this.$refs.ConfigModal.show()
    
    this.loading = false
  },
  methods: {
  }
}

import IndexEditor from './IndexEditor.js'
IndexEditor(Index)

import IndexSync from './IndexSync.js'
IndexSync(Index)

export default Index