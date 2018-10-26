import backLinks from '@dynamic/backlinks'

export default ({ Vue }) => {
  Vue.mixin({
    computed: {
      // $backLinksMap () {
      //   return backLinks
      // },
      $backLinks () {
        return backLinks[this.$page.regularPath]
      },
    }
  })
}