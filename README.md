# Markdown to HTML

Converts markdown files to HTML

## Usage

```yml
- name: Convert index.md to index.html
  uses: jd-solanki/gh-action-md-to-html@v1.3.0
  with:
    files: '[["index.md", "index.html"]]'
    theme: 'dark' # Optional, default: auto
    title: 'My Website' # Optional, If title isn't provided title tag won't get added
    favicon: 'https://github.githubassets.com/favicons/favicon-dark.png' # Optional, If favicon isn't provided favicon's link tag won't get added
```

## ToDo

- [ ] Fetch title from repo name if isn't provided (PR welcome)

## Credits

- Thanks [sindresorhus](https://github.com/sindresorhus/github-markdown-css) for markdown styles
