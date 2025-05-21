# [js-helper-ui](https://npmjs.com/@w3lifer/js-helper-ui)

- [Installation](#installation)
- [Usage](#usage)
  - [Methods](#methods)
- [Development](#development)

## Installation

``` sh
npm i @w3lifer/js-helper-ui
```

## Usage

### Methods

``` js
jsHelperUi.copyTextToClipboard(text)
jsHelperUi.disableContextMenu()
jsHelperUi.enableContextMenu()
jsHelperUi.disableDefaultShortcutsOfCodeReview()
jsHelperUi.enableDefaultShortcutsOfCodeReview()
jsHelperUi.downloadDataAsFile(data, filename = 'download.txt', contentType = 'text/plain')
jsHelperUi.htmlHeadersMap(options)
jsHelperUi.iLoveValidator(textContent = '</>')
jsHelperUi.setDataLineNumbersAttribute(element)
jsHelperUi.onKeyCodeSequence(keyCodeSequence, callback, once = false)
jsHelperUi.shortUrl(urlForShortening, shortenerUrl = 'clck.ru', corsProxy = false)
```

## Development

``` sh
docker compose run -p 5173:5173 --rm node vite --host
```

``` sh
npm version 1.0.0 && npm pu && git push --force --tags origin master
```
