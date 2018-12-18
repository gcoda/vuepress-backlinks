import backLinks from '@dynamic/backlinks'

export default ({ Vue }) => {
  Vue.mixin({
    computed: {
      $backLinks() {
        return backLinks[this.$page.regularPath]
      },
    }
  })
}