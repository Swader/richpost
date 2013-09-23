/**
 * Object to contain hashes of processed posts, and their boolean flags on whether or not they've been processed
 * @type {{}}
 */
var processedPosts = {};

/**
 * A variable that holds the parent element in which posts are rendered. Shrinks XPATH context, increasing performance.
 * @type {null}
 */
var postsContainer = null;

/**
 * Shorthand for the XPATH fetch constant we use regularly
 * @type {Number}
 */
const xpo = XPathResult.ORDERED_NODE_SNAPSHOT_TYPE;

/**
 * Init marked with default options
 */
marked.setOptions({
    gfm: true,
    langPrefix: 'language-'
});

/**
 * Re-runs the MD over all posts on edit or cancel, to make sure the posts are all rendered up to date
 * It also resets event listeners to avoid duplicates
 * @param e
 */
function resetProcessed(e) {
    processedPosts = {};
}

/**
 * Fetches the Share/Save and Cancel buttons from the Sharebox and binds resetProcessed() to their click
 */
function restoreListeners() {
    var scope = document.evaluate('//div[@guidedhelpid="shareboxcontrols"]', document, null, xpo);
    for (var i = 0; i < scope.snapshotLength; i++) {
        if (scope.snapshotItem(i) !== undefined && processedPosts != {}) {
            var context = scope.snapshotItem(i);
            var buttons = document.evaluate('//div[@role="button" and (text() = "Save" or text() = "Share")]', context, null, xpo);
            for (var j = 0; j < buttons.snapshotLength; j++) {
                if (buttons.snapshotItem(j)) {
                    buttons.snapshotItem(j).addEventListener('click', resetProcessed);
                }
            }
        }
    }
}
setInterval(function () {
    restoreListeners();
}, 1000);

/**
 * Check for MD-able posts every 2 seconds
 */
chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            convertTexts(findHashTags());
            setInterval(function () {
                convertTexts(findHashTags());
            }, 2000);
        }
    }, 10);
});

/**
 * Find all #richpost hashtags to find MD-able posts
 * @returns {Object}
 */
function findHashTags() {
    if (postsContainer === undefined || postsContainer === null) {
        postsContainer = document.getElementsByClassName('ow')[0];
    }
    var evalString = '//a[@class="ot-hashtag" and text()="#richpost"]';
    return document.evaluate(evalString, postsContainer, null, xpo);
}

/**
 * Convert all MD-able posts to MD content.
 * @param xpathresult
 */
function convertTexts(xpathresult) {
    for (var i = 0; i < xpathresult.snapshotLength; i++) {
        var parentElement = xpathresult.snapshotItem(i).parentNode;
        if (parentElement !== null && parentElement !== undefined) {
            var hashCode = parentElement.innerHTML.hashCode();
            if (processedPosts[hashCode] === undefined) {
                processedPosts[hashCode] = false;
            }
            if (processedPosts[hashCode] === false) {
                // Find all hashtags in this element and empty them. @todo fix this to ignore hashtags, not empty
                var hashes = document.evaluate('//a[@class="ot-hashtag"]', parentElement, null, xpo);
                for (var j = 0; j < hashes.snapshotLength; j++) {
                    hashes.snapshotItem(j).innerText = "";
                }

                parentElement.innerHTML = marked(parentElement.innerText);

                var codeBlocks = document.evaluate('//pre[code]', parentElement, null, xpo);
                for (var h = 0; h < codeBlocks.snapshotLength; h++) {
                    hljs.highlightBlock(codeBlocks.snapshotItem(h));
                }

                processedPosts[hashCode] = true;

            }
        }
    }
}

/**
 * A helper method to get the hashCode of a post
 * @returns {number}
 */
String.prototype.hashCode = function () {
    var hash = 0;
    if (this.length == 0) return hash;
    var l = this.length;
    for (i = 0; i < l; i++) {
        var c = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + c;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
