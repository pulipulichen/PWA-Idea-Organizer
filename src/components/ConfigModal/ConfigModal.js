import $ from 'jquery'

let ConfigModal = {
  props: ['config', 'utils'],
  data() {    
    this.$i18n.locale = this.config.locale
    return {
      modal: null,
      userConfig: {
        googleSheetAPIURL: 'https://script.google.com/macros/s/AKfycbxN92FLWBYYjc4Q6dgxAMQEnaLa-ZhkkoxfsInXoNu4NnuQJ9Hs/exec'
      }
    }
  },
//  components: {
//  },
//  computed: {
//  },
//  watch: {
//  },
//  mounted() {
//  },
  methods: {
    getModal: async function () {
      if (!this.modal) {
        while ($(this.$refs.modal).length === 0) {
          console.log('找不到')
          await this.utils.AsyncUtils.sleep()
        }
        await this.utils.AsyncUtils.sleep()
        this.modal = $(this.$refs.modal)
      }
      return this.modal
    },
    show: async function () {
      let modal = await this.getModal()
      modal.modal('show')
    },
    hide: async function () {
      let modal = await this.getModal()
      modal.modal('hide')
    },
  } // methods
}

export default ConfigModal