
const jsHelperUi = {}

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

jsHelperUi._contextMenuListener = mouseEvent => mouseEvent.preventDefault()

jsHelperUi.disableContextMenu = _ => window.addEventListener('contextmenu', jsHelperUi._contextMenuListener)
jsHelperUi.enableContextMenu = _ => window.removeEventListener('contextmenu', jsHelperUi._contextMenuListener)

/**
 * Tested in Google Chrome
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

jsHelperUi.disableDefaultShortcutsOfCodeReview = _ =>
    window.addEventListener('keydown', jsHelperUi._defaultShortcutsOfCodeReview)
jsHelperUi.enableDefaultShortcutsOfCodeReview = _ =>
    window.removeEventListener('keydown', jsHelperUi._defaultShortcutsOfCodeReview)

jsHelperUi.shortUrl = async (shortenerUrl, urlForShortening) => {
    const shorteners = {
        'clck.ru': 'https://clck.ru/--?url=',
        'is.gd': 'https://corsproxy.io/?url=' + encodeURIComponent('https://is.gd/create.php?format=simple&url='),
        'v.gd': 'https://corsproxy.io/?url=' + encodeURIComponent('https://v.gd/create.php?format=simple&url='),
    }
    if (shorteners[shortenerUrl]) {
        shortenerUrl = shorteners[shortenerUrl]
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

/**
 * @param {Object} options
 * @param {Object} options.from HTMLElement
 * @param {Object} options.to   HTMLElement
 */
jsHelperUi.htmlHeadersMap = function (options) {

    // Get

    var headers = [];
    for (var i = 1; i <= 6; i++) {
        var headersOnPage = options.from.querySelectorAll('h' + i);
        for (var j = 0; j < headersOnPage.length; j++) {
            headers.push(headersOnPage[j]);
        }
    }

    // Sort

    var sortedHeaders = {};
    headers.forEach(function (header) {
        sortedHeaders[
            Math.round(header.getBoundingClientRect().top + pageYOffset)
        ] = header;
    });
    headers = sortedHeaders;

    // Wrap

    var nav = document.createElement('nav');
    nav.classList.add('js-helper-html-headers-map');

    // Generate markup

    for (var header in headers) {
        var item = document.createElement('div');
        item.classList.add(
            'js-helper-html-headers-map-' +
                headers[header].tagName.toLowerCase()
        );
        item.textContent = headers[header].textContent;
        nav.appendChild(item);
    }

    // Add to

    options.to.appendChild(nav);

};

/**
 * @param {String} [textContent=</>]
 */
jsHelperUi.iLoveValidator = function (textContent) {
    var link = document.createElement('a');
    link.textContent = textContent || '</>';
    link.target = '_blank';
    link.setAttribute('id', 'js-helper-i-love-validator');
    link.addEventListener('click', function () {
        this.href =
            'https://validator.w3.org/nu/' +
                '?showimagereport&showoutline&showsource&doc=' +
                    location.href.split('#')[0];
    });
    document.body.appendChild(link);
};

/**
 * Executes callback on the passed key code sequence.
 * @param {Object}   options
 * @param {String}   [options.keyCodeSequence=null] - Key code sequence.
 *                                                    For example: 79,75 (ok).
 *                                                    Delimiter: ","
 *                                                    (without space).
 * @param {Function} [options.callback=null]
 * @param {Boolean}  [options.removeEventListenerAfterFirstExecution=false]
 */
jsHelperUi.onKeyCodeSequence = function (options) {

    options = options || {};
    options.keyCodeSequence = options.keyCodeSequence || null;
    options.callback = options.callback || null;
    options.removeEventListenerAfterFirstExecution =
        options.removeEventListenerAfterFirstExecution || false;

    if (!options.keyCodeSequence || !options.callback) {
        return;
    }

    var inputKeySequence = [];
    window.addEventListener('keyup', doSomething);
    function doSomething(keyboardEvent) {
        if (keyboardEvent.keyCode === 27) { // Esc
            inputKeySequence = [];
        } else if (keyboardEvent.keyCode === 8) { // Backspace
            inputKeySequence.pop();
        } else {
            inputKeySequence.push(keyboardEvent.keyCode);
            if (inputKeySequence.toString() === options.keyCodeSequence) {
                if (options.removeEventListenerAfterFirstExecution) {
                    window.removeEventListener('keyup', doSomething);
                }
                inputKeySequence = [];
                options.callback();
            }
        }
    }

};

export default jsHelperUi
