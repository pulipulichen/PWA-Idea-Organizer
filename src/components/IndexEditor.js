/* global Node */

import $ from 'jquery'

export default function (Index) {
  Index.methods.initEditor = async function () {
    await (() => import(/* webpackChunkName: "vendors/summernote" */ './vendors/summernote/summernote-lite.webpack.js'))()
    this.editor = $(this.$refs.editor)
    let contents = this.contents

    this.editor.summernote(this._summernoteOptions())
    if (contents !== null) {
      //console.log(this.editor.length, this.editor.summernote)
      this.editor.summernote("code", contents)
      this.setDocumentTitle(contents)
    }

    setTimeout(() => {
      this.enableChange = true
    }, 100)
    
  }
  
  Index.methods._summernoteOptions = function () {
    let options = {
      //lang: 'zh-TW',
      lang: this.config.locale,
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
      enableTypeWriterSoundEffect: this.syncConfig.enableSound,
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
        ["#c0392b", "#d35400", "#27ae60", "#16a085", "#f39c12"]
      ],
      foreColorsName: [
        ["MIDNIGHT BLUE", "ASBESTOS", "SILVER", "WISTERIA", "POMERANATE"], 
        ["BELIZE HOLE", "PUMPKIN", "NEPHRITIS", "ORANGE", "GREEN SEA"]
      ],
      backColors: [
        ["#34495e", "#95a5a6", "#ecf0f1", "#9b59b6", "#e74c3c"], 
        ["#3498db", "#e67e22", "#2ecc71", "#f1c40f", "#1abc9c"]
      ],
      backColorsName: [
        ["WET ASPHALT", "CONCRETE", "CLOUDS", "AMETHYST", "ALIZARIN"], 
        ["PETER RIVER", "CARROT", "EMERALD", "SUN FLOWER", "TURQUOISE"]
      ],
      enableCustomColors: false
    }

    if (typeof (this.placeholder) === 'string') {
      options.placeholder = this.placeholder
    }

    return options
  }
  
  Index.methods._summernoteOptionsToolbar = function () {
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
  }
  Index.methods._callbacksOnChange = function (contents) {
    //console.log(enableChange)
    if (this.enableChange === false) {
      return false
    }

    //console.log(contents)
    //console.log('onChange:', contents, $editable);
    this.setDocumentTitle(contents)
    localStorage.setItem('contents', contents)
    //this.saveToCloud(contents)
    this.contents = contents
  }
  
  
  Index.methods._getTextArrayFromHTMLString = function (string) {
    let output = []
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
  }
    
  Index.methods.setDocumentTitle = function (contents) {
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
  }
  
  Index.methods._onImageUpload = function () { 
    // do nothin
  }
}