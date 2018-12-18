import backLinks from '@dynamic/backlinks'

export default ({ Vue }) => {
  Vue.mixin({
    computed: {
      $backLinksMap() {
        return backLinks
      },
      $backLinks() {
        return backLinks[this.$page.regularPath]
      },
      $pageLinks() {
        const pages = this.$site.pages.filter(
          sitePage =>
            this.$page.pageLinks
              .map(x => x.path.replace(/\//g, ''))
              .filter(
                x => x === sitePage.path.replace(/\//g, '').replace('.html', '')
              ).length > 0
        )
        return pages.filter(x => x.path.length > 1)
      },
    },
  })
}
