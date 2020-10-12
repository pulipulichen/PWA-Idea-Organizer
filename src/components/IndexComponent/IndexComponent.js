import $ from 'jquery'
import './summernote/summernote-lite.webpack.js'
//let summernoteLoader = () => import(/* webpackChunkName: "summernote" */ './summernote/summernote-lite.webpack.js')
//let summernoteLoader = () => import('./summernote/summernote-lite.webpack.js')

let IndexComponent = {
  props: ['lib', 'status', 'config'],
  data() {    
    this.$i18n.locale = this.config.locale
    return {
      editor: null
    }
  },
//  components: {
//  },
//  computed: {
//  },
//  watch: {
//  },
  async mounted() {
    //summernoteLoader()
    this.initEditor()
  },
  methods: {
    initEditor () {
      this.editor = $(this.$refs.editor)
      //console.log(this.editor.length, this.editor.summernote)
      this.editor.summernote(this._summernoteOptions())
      
      let contents = localStorage.getItem('contents')
      if (contents !== null) {
        this.editor.summernote("code", contents)
      }
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
        ['history', ['undo', 'redo']],
        ['list', ['ul', 'ol', 'indent', 'outdent']],
        ['color', ['forecolor', 'backcolor', 'underline']],
        ['format', ['removeFormat' , 'removeElement']],
        ['insert', ['hr']],
        ['manage', ['copyRichFormat', 'clearTarget']]
      ]
    },
    _callbacksOnChange (contents) {
      //console.log(contents)
      //console.log('onChange:', contents, $editable);
      localStorage.setItem('contents', contents)
    },
    _onImageUpload () {
      
    }
    
  } // methods
}

export default IndexComponent