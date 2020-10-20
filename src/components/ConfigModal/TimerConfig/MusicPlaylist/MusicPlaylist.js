import draggable from 'vuedraggable'

let MusicPlaylist = {
  props: ['config', 'utils', 'clientConfig', 'syncConfig'],
  data() {    
    this.$i18n.locale = this.config.locale
    return {
      searchKeyword: '',
      myArray: [
        {
          id: 2,
          name: 'A',
        },
        {
          id: 1,
          name: 'B',
        },
        {
          id: 4,
          name: 'C',
        },
      ]
    }
  },
  components: {
    draggable,
  },
  computed: {
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    isMatchSearchKeyword (keyword) {
      let searchKeyword = this.searchKeyword.trim().toLowerCase()
      if (searchKeyword === '') {
        return true
      }
      else {
        return (keyword.toLowerCase().indexOf(searchKeyword) > -1)
      }
    }
  } // methods
}

export default MusicPlaylist