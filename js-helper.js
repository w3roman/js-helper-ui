
var jsHelper = {};

/**
 * @param {Object} params
 * @param {Array}  params.links
 */
jsHelper.addScriptsToThePage = function (params) {
    for (var i = 0; i < params.links.length; i++) {
        var script = document.createElement('script');
        script.src = params.links[i];
        script.async = false; // For the order of addition
        document.body.appendChild(script);
    }
};

/**
 * Only works if the user takes an action.
 * @param {String} text
 * @see https://stackoverflow.com/a/30810322/4223982
 */
jsHelper.copyTextToClipboard = function (text) {
    var input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
};

/**
 * Disables code review.
 * Tested in: Google Chrome.
 */
jsHelper.disableCodeReview = function () {

    // Disabling the context menu

    window.addEventListener('contextmenu', function(mouseEvent) {
        mouseEvent.preventDefault();
    });

    // Disabling the Dev Tools

    window.addEventListener('keydown', function(keyboardEvent) {
        if (
            // 85 - U (Ctrl + U)
            (keyboardEvent.ctrlKey && keyboardEvent.keyCode === 85) ||
            (
                keyboardEvent.ctrlKey &&
                keyboardEvent.shiftKey &&
                // 73 - I (Ctrl + Shift + I), 74 - J (Ctrl + Shift + J)
                [73, 74].indexOf(keyboardEvent.keyCode) !== -1
            ) ||
            // 123 - F12
            keyboardEvent.keyCode === 123
        ) {
            keyboardEvent.preventDefault();
        }
    });

};

/**
 * Google URL Shortener
 * @param {Object}   options
 * @param {String}   options.apiKey
 * @param {String}   options.longUrl
 * @param {Function} options.onError function (xhr) {}
 * @param {Function} options.onLoad  function (xhr) {}
 * @see https://goo.gl
 * @see https://developers.google.com/url-shortener
 */
jsHelper.googleUrlShortener = function (options) {
    if (!options.apiKey) {
        console.error('Google URL Shortener: You must specify API key');
        return;
    }
    if (!options.longUrl) {
        console.error('Google URL Shortener: You must specify URL');
        return;
    }
    if (!options.onLoad) {
        console.error('Google URL Shortener: You must specify "onLoad" callback');
        return;
    }
    if (!options.onError) {
        console.error('Google URL Shortener: You must specify "onError" callback');
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open(
        'post',
        'https://www.googleapis.com/urlshortener/v1/url?key=' + options.apiKey
    );
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener(
        'load',
        options.onLoad.bind(null, xhr)
    );
    xhr.addEventListener('error', options.onError.bind(null, xhr));
    xhr.send(JSON.stringify({'longUrl': options.longUrl}));
};

/**
 * @param {Object} options
 * @param {Object} options.from HTMLElement
 * @param {Object} options.to   HTMLElement
 */
jsHelper.htmlHeadersMap = function (options) {

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
jsHelper.iLoveValidator = function (textContent) {
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
jsHelper.onKeyCodeSequence = function (options) {

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
