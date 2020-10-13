import tocbot from './tocbot/tocbot.webpack.js'
import $ from 'jquery'

let TableOfContent = {
  props: ['config', 'headings', 'contentSelector', 'top', 'width'],
  data() {    
    this.$i18n.locale = this.config.locale
    //console.log(this.headings)
    return {
      inited: false,
      rootContainer: null,
      container: null
    }
  },
  /*
  components: {
  },
  computed: {
  },
  watch: {
  },
  */
  mounted() {
    //console.log('init')
    this.init()
  },
  destroyed () {
    this.inited = false
    tocbot.destroy()
    //console.log('reset')
    this.removeContainer()
  },
  methods: {
    init: function () {
      //console.log(1)
      this.initContainer()
      //console.log(2)
      let options = this.initOptions()
      //console.log(3)
      //console.log(options)
      setTimeout(() => {
        //console.log(options)
        tocbot.init(options)
        this.setStyle()
        //console.trace('inited')
      }, 0)
    },
    initOptions: function () {
      //let options = this.options
      //let height = this.config.styleConfig.TopMenuHeight
      //console.log()
      let height = '0'
      if (height.endsWith('px')) {
        height = height.slice(0, -2)
      }
      if (typeof(height) === 'string'){
        height = parseInt(height, 10)
      }

      let defaultOptions = {
        // Where to render the table of contents.
        tocSelector: '.js-toc',
        // Where to grab the headings to build the table of contents.
        contentSelector: this.contentSelector,
        scrollContainer: this.contentSelector,
        // Which headings to grab inside of the contentSelector element.
        headingSelector: this.headings,
        // For headings inside relative or absolute positioned containers within content.
        hasInnerContainers: true,
        //fixedSidebarOffset: height,
        //hasInnerContainers: true,
      }
      /*
      if (options !== undefined && typeof(options) === 'object') {
        for (let name in options) {
          defaultOptions[name] = options[name]
        }
      }
      */
      return defaultOptions
    },
    setStyle () {
      $(this.$refs.toc).css({
        width: this.width,
        top: this.top
      })
    },
    initContainer: function () {
      //this.container = window.$(this.$refs.toc)
      //container.prependTo('body')

      //this.rootContainer = $(this.$refs.toc).parent()
      this.rootContainer = $(this.contentSelector)
      this.rootContainer.addClass('tocbot')
    },
    removeContainer: function () {
      //this.container.remove()
      this.rootContainer.removeClass('tocbot')
    },
    
    refresh: function () {
      setTimeout(() => {
        tocbot.refresh()
        //console.log('refresh')
      }, 0)
    }
  } // methods
}

export default TableOfContent