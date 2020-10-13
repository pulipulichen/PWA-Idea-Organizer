/* global Node */

//let summernoteLoader = () => import('./summernote/summernote-lite.webpack.js')

let Index = {
  props: ['config'],
  data () {    
    this.$i18n.locale = this.config.locale
    return {
      //test: 'aaa',
      editor: null,
      loading: true,
      enableChange: false,
      saveToCloudTimer: null,
      googleSheetAPIURL: 'https://script.google.com/macros/s/AKfycbxN92FLWBYYjc4Q6dgxAMQEnaLa-ZhkkoxfsInXoNu4NnuQJ9Hs/exec'
    }
  },
//  components: {
//  },
//  computed: {
//  },
//  watch: {
//  },
  mounted() {
    
    //this.saveToCloudTimer = null
    //this.googleSheetAPIURL = 'https://script.google.com/macros/s/AKfycbxN92FLWBYYjc4Q6dgxAMQEnaLa-ZhkkoxfsInXoNu4NnuQJ9Hs/exec'
    
    //console.log(this)
    //summernoteLoader()
    this.initEditor()
  },
  methods: {}
}

import IndexEditor from './IndexEditor.js'
IndexEditor(Index)

export default Index