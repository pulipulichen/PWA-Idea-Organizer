import $ from 'jquery'

let StyleConfig = {
  props: ['config', 'utils', 'clientConfig', 'syncConfig'],
  data() {    
    this.$i18n.locale = this.config.locale
    return {
    }
  },
//  components: {
//  },
//  computed: {
//    sharable() {
//      return (typeof(window.navigator.share) === 'object')
//    }
//  },
//  watch: {
//  },
//  mounted() {
//  },
  methods: {
    initCheckbox () {
      $(this.$refs.main).checkbox()
    },
//    async shareYouTubeURL() {
//      await window.navigator.share({
//        titile: 'youtube music',
//        url: this.syncConfig.musicURL
//      })
//    }
  } // methods
}

export default StyleConfig