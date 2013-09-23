# Richpost

Richpost is a Chrome Extension which enables Markdown support in Google Plus.

For more information on how and why it was built, see [the blog post](http://www.bitfalls.com/2013/09/markdown-support-in-google-plus-chrome.html).

## License

See [license](LICENSE.md).

## Contributions

Accepting pull requests. Go crazy.

### Todo:

 - support for embedding gists. The idea is to detect a gist URL in a #richpost marked post, and offer a "load" option next to it, which then loads the gist in place. This is so that the whole page doesn't screech to a halt by trying to load a bunch of gist laden posts. An option in the options page might be used to turn auto-loading of gists on and off.
 - support for Facebook? (it might even actually already work, seeing as the code is quite platform agnostic)
 - a switch to "unMD" the post, as in "show/hide parsed"
 - a way to ignore hashtags. I currently hide their contents to prevent weird headings.
 - performance comparisons between XPath (currently used for the most part) and native document methods for finding/filtering elements.
 - fix highlighting, it selects oddly arbitrary languages right now.
 - option to choose highlight theme (all are packed in the extension by default, just needs a switch of some kind)
 - stop intervals when tab is inactive
 - MD in embedded posts
 - MD in comments?