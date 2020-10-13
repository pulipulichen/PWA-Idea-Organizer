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
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    initCheckbox () {
      $(this.$refs.main).checkbox()
    }
  } // methods
}

export default StyleConfig