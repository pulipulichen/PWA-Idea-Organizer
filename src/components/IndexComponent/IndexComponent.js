import $ from 'jquery'
//import './summernote/summernote-lite.webpack.js'
let summernoteLoader = () => import(/* webpackChunkName: "vendors/summernote" */ './summernote/summernote-lite.webpack.js')

//let summernoteLoader = () => import('./summernote/summernote-lite.webpack.js')

let IndexComponent = {
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
      //count: 22
      //saveToCloudTimer: null,
      //googleSheetAPIURL: 
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
  methods: {
    async initEditor () {
      await summernoteLoader()
      this.editor = $(this.$refs.editor)
      
      //console.log(this.editor.length, this.editor.summernote)
      this.editor.summernote(this._summernoteOptions())
      
      /*
      let contents = localStorage.getItem('contents')
      if (contents !== null) {
        this.editor.summernote("code", contents)
        this.setDocumentTitle(contents)
      }
      */
      //console.log(this.googleSheetAPIURL)
      $.getJSON(this.googleSheetAPIURL, (data) => {
        //console.log(contents)
        //console.log(c)
        let contents = data.contents
        //console.log(contents)
        
        if (contents !== null) {
          this.editor.summernote("code", contents)
          this.setDocumentTitle(contents)
          
          setTimeout(() => {
            this.enableChange = true
            this.loading = false
          }, 100)
        }
      })
    },
    _summernoteOptions () {
      let options = {
        lang: 'zh-TW',
        //airMode: true,
        toolbar: this._summernoteOptionsToolbar(),
        toolbarPosition: 'bottom',
        popover: {
          air: [
            ['font', ['forecolor', 'backcolor', 'bold', 'underline', 'clear']]
            //['font', ['bold', 'underline']]
          ]
        },
        //enableAirPopover: this._summernoteOptionsEnableAirPopover(),
        enableStatusbar: false,
        toolbarAlign: 'right',
        toolbarCompact: true,
        toolbarOverflow: true,
        placeholder: '<ul><li>What do you write...</li></ul>',
        focus: true,
        //container: this.editor.parent(),
        //maxHeight: '5em',
        //disableDragAndDrop: true,
        callbacks: {
          onImageUpload: async (files) => {
            this._onImageUpload(files)
          },
          onChange: this._callbacksOnChange
        },
        // https://flatuicolors.com/palette/defo
        foreColors: [
          ["#2c3e50", "#7f8c8d", "#bdc3c7", "#8e44ad", "#2980b9"], 
          ["#c0392b", "#d35400", "#27ae60", "#16a085", "#f39c12"], 
        ],
        foreColorsName: [
          ["MIDNIGHT BLUE", "ASBESTOS", "SILVER", "WISTERIA", "POMERANATE"], 
          ["BELIZE HOLE", "PUMPKIN", "NEPHRITIS", "ORANGE", "GREEN SEA"], 
        ],
        backColors: [
          ["#34495e", "#95a5a6", "#ecf0f1", "#9b59b6", "#e74c3c"], 
          ["#3498db", "#e67e22", "#2ecc71", "#f1c40f", "#1abc9c"], 
        ],
        backColorsName: [
          ["WET ASPHALT", "CONCRETE", "CLOUDS", "AMETHYST", "ALIZARIN"], 
          ["PETER RIVER", "CARROT", "EMERALD", "SUN FLOWER", "TURQUOISE"], 
        ],
        enableCustomColors: false
      }

      if (typeof (this.placeholder) === 'string') {
        options.placeholder = this.placeholder
      }

      return options
    },
    _summernoteOptionsToolbar () {
      return [
        // [groupName, [list of button]]
        ['sort', ['toggleSortMode']],
        ['history', ['undo', 'redo', 'removeElement']],
        ['list', ['ul', 'ol', 'indent', 'outdent']],
        ['style', ['strikethrough', 'underline', 'backgroundColorRed', 'backgroundColorYellow', 'backgroundColorGreen', 'backgroundColorBlue', 'backgroundColorPurple']],
        ['format', ['removeFormat']],
        ['insert', ['hr']],
        ['manage', ['copyRichFormat', 'clearTarget']]
      ]
    },
    _callbacksOnChange (contents) {
      //console.log(enableChange)
      if (this.enableChange === false) {
        return false
      }
      
      //console.log(contents)
      //console.log('onChange:', contents, $editable);
      this.setDocumentTitle(contents)
      localStorage.setItem('contents', contents)
      this.saveToCloud(contents)
    },
    saveToCloud (contents) {
      //console.log(contents)
      if (!contents || contents === '') {
        return false
      }
      
      if (this.saveToCloudTimer !== null) {
        clearTimeout(this.saveToCloudTimer)
      }
      
      this.saveToCloudTimer = setTimeout(() => {
        $.post(this.googleSheetAPIURL, {
          contents
        })
        //console.log('儲存：', contents)
      }, 3000)
    },
    _getTextArrayFromHTMLString (string) {
      let elements = $('<div>' + string + '</div>').find('*')
      for (let i = 0; i < elements.length; i++) {
        let element = elements.eq(i)
        let nodes = element.contents()
        for (let n = 0; n < nodes.length; n++) {
          let node = nodes[n]
          if (node.nodeType !== Node.TEXT_NODE) {
            continue
          }
          output.push(node.textContent)
        }
      }
      return output
    },
    setDocumentTitle(contents) {
      let output = []
      let title = ''
      let titleLimit = 50
      
      let elements = $('<div>' + contents + '</div>').find('*')
      for (let i = 0; i < elements.length; i++) {
        let element = elements.eq(i)
        let nodes = element.contents()
        for (let n = 0; n < nodes.length; n++) {
          let node = nodes[n]
          if (node.nodeType !== Node.TEXT_NODE) {
            continue
          }
          output.push(node.textContent)
          title = output.join(' ')
          if (title.length > titleLimit) {
            break
          }
        }
        
        if (title.length > titleLimit) {
          break
        }
      }
      
      if (title.length > 0) {
        document.title = title
      }
    },
    _onImageUpload () { 
    }
    
  } // methods
}

window.googleDocCallback = function () { return true; };

export default IndexComponent