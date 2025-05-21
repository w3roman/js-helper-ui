
const jsHelperUi = {
    const: {},
}

/**
 * Programmatic operation requires prior user interaction (e.g. any page click)
 * @param {String} text
 * @see https://stackoverflow.com/a/71876238/4223982
 */
jsHelperUi.copyTextToClipboard = async text => {
    try {
        if (window.isSecureContext && navigator.clipboard) {
            await navigator.clipboard.writeText(text)
        } else {
            const textarea = document.createElement('textarea')
            textarea.style.opacity = '0' // When using `display: none` the `copy` does not work
            textarea.value = text
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
        }
    } catch (e) {
        console.log(e)
    }
}

jsHelperUi.disableContextMenu = _ => window.addEventListener('contextmenu', jsHelperUi._contextMenuListener)
jsHelperUi.enableContextMenu = _ => window.removeEventListener('contextmenu', jsHelperUi._contextMenuListener)
jsHelperUi._contextMenuListener = mouseEvent => mouseEvent.preventDefault()

jsHelperUi.disableDefaultShortcutsOfCodeReview = _ =>
    window.addEventListener('keydown', jsHelperUi._defaultShortcutsOfCodeReview)
jsHelperUi.enableDefaultShortcutsOfCodeReview = _ =>
    window.removeEventListener('keydown', jsHelperUi._defaultShortcutsOfCodeReview)
/**
 * Tested only in Google Chrome
 * @see https://toptal.com/developers/keycode
 */
jsHelperUi._defaultShortcutsOfCodeReview = keyboardEvent =>
    (
        keyboardEvent.code === 'F12'
        ||
        (keyboardEvent.ctrlKey && keyboardEvent.code === 'KeyU')
        ||
        (
            keyboardEvent.ctrlKey && keyboardEvent.shiftKey
            && ['KeyI', 'KeyJ'].includes(keyboardEvent.code)
        )
    )
    && keyboardEvent.preventDefault()

/**
 * @param {Array} data An array of data; for example `['foo', 'bar']`
 * @param {String} contentType='text/plain' Content type for optimal results
 * @param {String} filename='download.txt' File name
 * @see https://flexiple.com/javascript/download-flle-using-javascript
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Blob
 */
jsHelperUi.downloadDataAsFile = (data, filename = 'download.txt', contentType = 'text/plain') => {
    const blob = new Blob(data, {type: contentType})
    const fileURL = URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')
    downloadLink.href = fileURL
    downloadLink.download = filename
    document.body.appendChild(downloadLink)
    downloadLink.click()
    downloadLink.remove()
    URL.revokeObjectURL(fileURL)
}

/**
 * @param {Object} options
 * @param {HTMLElement} options.from
 * @param {HTMLElement} options.to
 */
jsHelperUi.htmlHeadersMap = options => {
    let headers = []
    // Get headers
    for (let i = 1; i <= 6; i++) {
        const headersOnPage = options.from.querySelectorAll('h' + i)
        for (let j = 0; j < headersOnPage.length; j++) {
            headers.push(headersOnPage[j])
        }
    }
    // Sort headers
    const sortedHeaders = {}
    headers.forEach(header =>
        sortedHeaders[
            Math.round(header.getBoundingClientRect().top + scrollY)
            ] = header
    )
    headers = sortedHeaders
    // Create <nav> element and generate markup
    const nav = document.createElement('nav')
    nav.classList.add('js-helper-html-headers-map')
    for (let header in headers) {
        let item = document.createElement('div')
        item.classList.add(
            'js-helper-html-headers-map-' + headers[header].tagName.toLowerCase()
        )
        item.textContent = headers[header].textContent
        nav.appendChild(item)
    }
    options.to.appendChild(nav)
}

/**
 * Displays a link to the W3C Markup Validator service
 * @param {String} textContent=&lt;/&gt; Link text
 */
jsHelperUi.iLoveValidator = (textContent = '</>') => {
    const link = document.createElement('a')
    link.href = 'https://validator.w3.org/nu/?showimagereport&showoutline&showsource&doc='
    link.textContent = textContent
    link.target = '_blank'
    link.setAttribute('id', 'js-helper-i-love-validator')
    link.addEventListener('click', _ => link.href += location.href.split('#')[0])
    document.body.appendChild(link)
}

/**
 * Example of usage
 * ```
 * <div contenteditable="plaintext-only" class="line-numbers" oninput="jsHelperUi.setDataLineNumbersAttribute(this)"></div>
 * <div contenteditable="plaintext-only" class="line-numbers" oninput="jsHelperUi.setDataLineNumbersAttribute(this)"></div>
 * <style>
 *   .line-numbers {
 *     overflow: auto;
 *     position: relative;
 *     padding-left: 35px;
 *   }
 *
 *   .line-numbers::before {
 *     content: attr(data-line-numbers);
 *     position: absolute;
 *     left: 3px;
 *   }
 * </style>
 * <script>
 *   window.addEventListener('DOMContentLoaded', _ => {
 *     document.querySelectorAll(".line-numbers").forEach(element => jsHelperUi.setDataLineNumbersAttribute(element))
 *   })
 * </script>
 * ```
 * @param {HTMLElement} element HTMLElement with `contenteditable="plaintext-only"` attribute
 */
jsHelperUi.setDataLineNumbersAttribute = element => {
    const splitInnerText = element.innerText.split('\n')
    let numberOfLines = splitInnerText.length
    if (splitInnerText[splitInnerText.length - 1] !== '') {
        numberOfLines++
    }
    let lineNumbers = ''
    for (let i = 1; i < numberOfLines; i++) {
        lineNumbers += i + '\n'
    }
    if (lineNumbers === '') {
        lineNumbers = 1
    }
    element.setAttribute('data-line-numbers', lineNumbers)
}

/**
 * Executes a `callback` for the given key code sequence
 * @param {String} keyCodeSequence Example: `KeyO,KeyK` (ok). Delimiter: `,` (without spaces).
 * @param {Function} callback The function that is executed when a key code sequence occurs
 * @param {Boolean} once=false Disable `callback` execution after first call
 * @see https://toptal.com/developers/keycode
 */
jsHelperUi.onKeyCodeSequence = (keyCodeSequence, callback, once = false) => {
    keyCodeSequence = keyCodeSequence.replace(/ /g, '')
    let inputKeySequence = []
    /**
     * @param {KeyboardEvent} keyboardEvent
     */
    function listener(keyboardEvent) {
        if (keyboardEvent.code === 'Escape') {
            inputKeySequence = []
        } else if (keyboardEvent.code === 'Backspace') {
            inputKeySequence.pop()
        } else {
            inputKeySequence.push(keyboardEvent.code)
            if (inputKeySequence.toString() === keyCodeSequence) {
                if (once) {
                    window.removeEventListener('keyup', listener)
                }
                inputKeySequence = []
                callback()
            }
        }
    }
    window.addEventListener('keyup', listener)
}

jsHelperUi.const.corsProxyUrl = 'https://corsproxy.io/?url='
jsHelperUi.const.shorteners = {
    'clck.ru': 'https://clck.ru/--?url=',
    'is.gd': jsHelperUi.const.corsProxyUrl + encodeURIComponent('https://is.gd/create.php?format=simple&url='),
    'v.gd': jsHelperUi.const.corsProxyUrl + encodeURIComponent('https://v.gd/create.php?format=simple&url='),
}
/**
 * Shortens URLs using preset or custom services.
 * When a custom service is specified:
 * - The target URL will be appended to it
 * - A GET request will be sent
 * - The service must return the shortened URL as plain text
 * - CORS bypass can be enabled if needed
 * @param {String} urlForShortening
 * @param {String} shortenerUrl='clck.ru' Available services: `clck.ru`, `is.gd`, `v.gd`
 * @param {Boolean} corsProxy=false Enable CORS proxy
 * @returns {Promise<string>}
 */
jsHelperUi.shortUrl = async (urlForShortening, shortenerUrl = 'clck.ru', corsProxy = false) => {
    if (jsHelperUi.const.shorteners[shortenerUrl]) {
        shortenerUrl = jsHelperUi.const.shorteners[shortenerUrl]
    } else if (corsProxy) {
        shortenerUrl = jsHelperUi.const.corsProxyUrl + encodeURIComponent(shortenerUrl)
    }
    try {
        const response = await fetch(shortenerUrl + encodeURIComponent(urlForShortening))
        if (response.ok) {
            return await response.text()
        }
    } catch (e) {
        console.log(e)
    }
}

export default jsHelperUi
