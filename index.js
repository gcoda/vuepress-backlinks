// const { path } = require('@vuepress/shared-utils')
const path = require('path')
module.exports = (options = {}, ctx) => ({
  name: 'vuepress-backlinks',
  extendMarkdown: md => {
    md.use(require('./wikilink'))
  },
  ready() {
    ctx.backLinks = ctx.pages
      .map(page => ({
        regularPath: page.regularPath,
        backLinks: ctx.pages
          .filter(link => {
            return link.pageLinks
              .reduce((links, l) => [...links, l.path], [])
              .filter(parsedPath => {
                const pagePath = page.path.replace(path.extname(page.path), '')
                return page._permalink
                  ? path.resolve(page._permalink) === parsedPath
                  : pagePath === parsedPath
              }).length
          })
          .map(link => ({
            title: link.title,
            path: link.path,
          })),
      }))
      .reduce(
        (map, page) => ({
          ...map,
          [page.regularPath]: page.backLinks,
        }),
        {}
      )
  },
  extendPageData($page) {
    const pageDir = path.parse($page.regularPath).dir
    const content = $page._strippedContent || ''

    const wikiLinksMatch = content.match(/\[{2}\s*(.+?)\s*\]{2}/g) || []
    const wikiLinks = wikiLinksMatch.map(mdLink => {
      const match = mdLink.match(/\[\[((.*))\]\]/u) || ''
      const wl = match[1] && match[1].split('|')
      const linkPath = wl[wl.length - 1]
      const title = wl[0]

      const link = path.resolve(pageDir, linkPath)
      return { title, path: link }
    })

    // regex source: https://stackoverflow.com/questions/44511043
    const linksMatch =
      content.match(
        /((!?\[[^\]]*?\])\((?:(?!http|www\.|\#|\.com|\.net|\.info|\.org).)*?\))/g
      ) || []
    const pageLinks = linksMatch
      .map(mdLink => {
        const match = mdLink.match(/\((.*)\)/u)
        const matchTitle = mdLink.match(/\[(.*)\]/u)

        const title = matchTitle && matchTitle[1]
        const linkPath = match && match[1]

        const link = path
          .resolve(pageDir, linkPath)
          .replace(path.extname(linkPath), '')

        return { title, path: link }
      })
      .concat(wikiLinks)

    if (!$page.title)
      Object.assign($page, { title: $page.path.split(/\/|_/).join(' ') })

    Object.assign($page, { pageLinks })
    // ? Object.assign($page, { parsedLinks: pageLinks })
  },

  async clientDynamicModules() {
    return [
      {
        name: 'backlinks.js',
        content: `export default ${JSON.stringify(ctx.backLinks, null, 2)}`,
      },
    ]
  },

  enhanceAppFiles: [path.resolve(__dirname, 'clientPlugin.js')],
})
