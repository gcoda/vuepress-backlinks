const { path } = require("@vuepress/shared-utils")

module.exports = (options = {}, ctx) => ({
  name: "vuepress-backlinks",
  ready() {
    ctx.backLinks = ctx.pages
      .map(page => ({
        regularPath: page.regularPath,
        backLinks: ctx.pages
          .filter(link =>
            link.pageLinks //
              .includes(path.trimExt(page.regularPath))
          )
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

    // regex source: https://stackoverflow.com/questions/44511043
    // /regex-to-match-local-markdown-links
    const pageLinks = $page._strippedContent
      .match(
        /((!?\[[^\]]*?\])\((?:(?!http|www\.|\#|\.com|\.net|\.info|\.org).)*?\))/g
      )
      .map(mdLink => {
        const match = mdLink.match(/\((.*)\)/u)
        const linkPath = path.trimExt(match && match[1])
        const { root } = path.parse(linkPath)

        const link = root === "/" ? linkPath : path.join(pageDir, linkPath)

        return link
      })
    
    Object.assign($page, { pageLinks })
  },

  async clientDynamicModules() {
    return [
      {
        name: "backlinks.js",
        content: `export default ${JSON.stringify(ctx.backLinks, null, 2)}`,
      },
    ]
  },

  enhanceAppFiles: [path.resolve(__dirname, "clientPlugin.js")],
})
