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
      container: null,
      $toc: null
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
        this.updateActiveLink()
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
        scrollContainer: this.rootContainer,
        // Which headings to grab inside of the contentSelector element.
        headingSelector: this.headings,
        // For headings inside relative or absolute positioned containers within content.
        hasInnerContainers: true,
        disableTocScrollSync: true,
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
      this.$toc = $(this.$refs.toc)
      
      this.$toc.css({
        width: this.width,
        top: this.top
      })
      setTimeout(() => {
        //console.log('ok嗎？')
        let activeLiClassName = 'is-active-li'
        this.$toc.find('.' + activeLiClassName).removeClass(activeLiClassName)
        this.$toc.find('li:first').addClass(activeLiClassName)
        //console.log(this.$toc.find('.' + activeLiClassName).text())
        
        let activeLinkClassName = 'is-active-link'
        this.$toc.find('.' + activeLinkClassName).removeClass(activeLinkClassName)
        this.$toc.find('a:first').addClass(activeLinkClassName)
        //console.log(this.$toc.find('.' + activeLiClassName).text())
      }, 0)  
    },
    getHeadingOffsets: function () {
      let offsets = {}
      let rootTop = this.rootContainer.offset().top
      
      let headings = this.rootContainer.find(this.headings)
      for (let i = 0; i < headings.length; i++) {
        let heading = headings.eq(i)
        let top = heading.offset().top - rootTop
        let id = heading.attr('id')
        offsets[id] = top
      }
      return offsets
      //console.log(headings)
    },
    activeLink: function (id) {
      if (!this.$toc) {
        return false
      }
      
      let activeLiClassName = 'is-active-li'
      this.$toc.find('.' + activeLiClassName).removeClass(activeLiClassName)
      
      let activeLinkClassName = 'is-active-link'
      this.$toc.find('.' + activeLinkClassName).removeClass(activeLinkClassName)
      
      let a = this.$toc.find(`a[href="#${id}"]`).addClass(activeLinkClassName)
      a.parents('li:first').addClass(activeLiClassName)
      //console.log(this.$toc.find('.' + activeLiClassName).text())
    },
    updateActiveLink: function (event) {
      //console.log(event)
      let target = this.rootContainer[0]
      let scrollTop = target.scrollTop
      let scrollHeight = target.scrollHeight
      let containerHeight = target.clientHeight
      //console.log(scrollTop + containerHeight, scrollHeight)
      let headingOffsets = this.getHeadingOffsets()
      //console.log(headingOffsets)
      let lastHeading = {}
      let idList = Object.keys(headingOffsets)
      
      if (scrollTop + containerHeight > scrollHeight - 10) {
        let id = idList.slice(-1)
        return this.activeLink(id)
      }
      
      for (let i = 0; i < idList.length; i++) {
        let id = idList[i]
        let top = headingOffsets[id]
        if (i === 0 && top > 0) {
          return this.activeLink(id)
        }
        
        if (top < 0) {
          lastHeading = {id, top}
        }
        else {
          let lastTop = Math.abs(lastHeading.top)
          if (lastTop < top) {
            return this.activeLink(lastHeading.id)
          }
          else {
            return this.activeLink(id)
          }
        }
      }
      
      return this.activeLink(lastHeading.id)
    },
    initContainer: function () {
      //this.container = window.$(this.$refs.toc)
      //container.prependTo('body')

      //this.rootContainer = $(this.$refs.toc).parent()
      this.rootContainer = $(this.contentSelector)
      this.rootContainer.addClass('tocbot')
      
      this.rootContainer.bind('scroll', (event) => {
        this.updateActiveLink(event)
      })
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