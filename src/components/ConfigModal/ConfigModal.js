import $ from 'jquery'

import SyncConfig from './SyncConfig/SyncConfig.vue'
import StyleConfig from './StyleConfig/StyleConfig.vue'
import TableOfContents from './TableOfContents/TableOfContents.vue'

import Author from './Author/Author.vue'

let ConfigModal = {
  props: ['config', 'utils', 'clientConfig', 'syncConfig'],
  data() {    
    this.$i18n.locale = this.config.locale
    return {
      modal: null,
    }
  },
  components: {
    'sync-config': SyncConfig,
    'style-config': StyleConfig,
    'author': Author,
    'table-of-contents': TableOfContents
  },
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
        this.modal = $(this.$refs.modal).modal({
          duration: 100,
          autofocus: false,
          onVisible: () => {
            this.$refs.toc.updateActiveLink()
          }
        })
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