/* eslint-disable no-nested-ternary */
// Docs: https://docs.github.com/en/actions
const core = require('@actions/core')
const { promises: fs } = require('fs')
const MarkdownIt = require('markdown-it')
const themeAuto = require('./styles/github-markdown')
const themeLight = require('./styles/github-markdown-light')
const themeDark = require('./styles/github-markdown-dark')

const md = new MarkdownIt({
  html: true,
})

async function mdToHtml(filePath, debug, theme, options) {
  // Read source file
  const content = await fs.readFile(filePath, 'utf8')
  if (debug) core.info(`content of ${filePath}: ${content}`)

  // converted to HTML
  const rendered = md.render(content)

  const titleTag = options.title ? `<title>${options.title}</title>` : ''
  const faviconTag = options.favicon ? `<link rel="icon" href="${options.favicon}" />` : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
${faviconTag}
${titleTag}
<style>
${theme === 'light'
    ? themeLight
    : theme === 'dark'
      ? themeDark
      : themeAuto}
/* recommended style from docs: https://github.com/sindresorhus/github-markdown-css */
.markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
}

@media (max-width: 767px) {
    .markdown-body {
        padding: 15px;
    }
}
</style>
</head>
<body class="markdown-body">
${rendered}
</body>
</html>`

  return html
}

(async () => {
  try {
    // 👉 Get config
    const debug = Boolean(JSON.parse(core.getInput('debug')))
    const theme = core.getInput('theme')
    const pageTitle = core.getInput('title')
    const favicon = core.getInput('favicon')

    if (debug) core.info(`debug: ${debug}`)

    if (debug) core.info(`theme: ${theme}`)
    if (debug) core.info(`pageTitle: ${pageTitle}`)
    if (debug) core.info(`favicon: ${favicon}`)

    const files = JSON.parse(core.getInput('files'))
    if (debug) core.info(`files: ${files}`)

    // Check if files is array
    const isFilesOptionValid = Array.isArray(files)
          // Check if every element of files is array
          && files.every(ele => Array.isArray(ele)
          // Check if every element of files have length of 2.
          && ele.length === 2
          // Check if every (2) element of files element array is string
          && ele.every(nestedEle => typeof nestedEle === 'string'))

    if (debug) core.info(`isFilesOptionValid: ${isFilesOptionValid}`)

    if (!isFilesOptionValid) return core.setFailed('files option value is not valid')

    for (let index = 0; index < files.length; index++) {
      if (debug) core.info(`Working on: ${JSON.stringify(files[index])}`)
      if (debug) core.info(`writing ${files[index][1]}`)

      const html = await mdToHtml(files[index][0], debug, theme, { title: pageTitle, favicon })
      if (debug) core.info(`HTML content to write: ${html}`)
      await fs.writeFile(files[index][1], html, err => { if (err) core.warning(err) })
      if (debug) core.info('Written to HTML file')
    }

    return null
  } catch (error) {
    core.setFailed(error.message)
    return null
  }
})()
