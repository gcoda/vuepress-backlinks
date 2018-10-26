# Back Links

## Now with Wiki Links

* simplest form of ikiwiki style links `[[text|url]]` only

`this.$backLinks` on each page with links to page refers to it

it uses computed method from generated map loaded as module, might be a bit to slow on large sites

```
<router-link v-for="link in $backLinks" :to='link.path'>{{ link.title }}</router-link>
```

works with vuepress@1.0.0-alpha.16
