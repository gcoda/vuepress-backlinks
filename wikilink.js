module.exports = function(md) {
  const wikiRegexp = /\[{2}\s*(.+?)\s*\]{2}/i
  md.core.ruler.before("normalize", "miniwikilinks", state => {
    state.src = (src => {
      while ((cap = wikiRegexp.exec(src))) {
        const wikiLink = cap[1].split("|")
        const title = wikiLink[0]
        const path = wikiLink[wikiLink.length - 1]
        src =
          src.slice(0, cap.index) +
          `[${title}](${path}.html)` +
          src.slice(cap.index + cap[0].length, src.length)
      }
      return src
    })(state.src)
  })
}
