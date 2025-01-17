<p align="center">
	<img src="https://www.11ty.dev/img/logo-github.svg" width="100" height="100" alt="11ty logo">
</p>

# eleventy-plugin-validate-html

> A plugin, with options, that runs on the `eleventy.after` event and validates all the files that were built.
> Inspired by [matt-auckland's plugin](https://github.com/matt-auckland/eleventy-plugin-html-validate)


![](https://img.shields.io/badge/Made%20with%20love%20and%20with-javascript%2C%20node-blue)
[![MIT license](https://img.shields.io/badge/License-MIT-green.svg)](https://lbesson.mit-license.org/)

## Installation

Available on [npm](https://www.npmjs.com/package/@saiballo/eleventy-plugin-validate-html):

```sh
npm install @saiballo/eleventy-plugin-validate-html --save
```
Add the plugin to your `eleventy.config.js`:

```js
const pageValidation = require("@saiballo/eleventy-plugin-validate-html");

module.exports =  function(eleventyConfig) {
	eleventyConfig.addPlugin(pageValidation)
};
```

## Usage

By default, the plugin checks all pages with the `.html` or `.htm` extensions. You can add or change extensions by providing a custom configuration. You can use "extensionList" parameter with a list of extensions (without the dot) separated by commas:

```js
eleventyConfig.addPlugin(pageValidation, {
	"extensionList":  "ext1,ext2"
})
```

This plugin relies on [html-validator](https://www.npmjs.com/package/html-validator). This allows you to use some configuration parameters from that package.
The complete default configuration that you can override is:

```js
eleventyConfig.addPlugin(pageValidation, {
	"extensionList":  "htm,html",
	"validator":  "WHATWG",
	"isLocal":  false,
	"isFragment":  false,
	"ignore": [],
	"whatwgConfig": {
		"elements": [],
		"rules": {}
	}
})
```
#### Parameters
```js
// as previously seen, it is a comma-separated list of extensions to check for validation
"extensionList":  "htm,html"

// Possible values: "WHATWG" | "https://validator.w3.org/nu/"
//"WHATWG" is recommended. it will validate against the WHATWG standards.
"validator":  "WHATWG"

// set this to true if you want to validate local urls
"isLocal":  false

// set this to true only if all your pages are not a complete document
// if only certain pages are fragments, you can use "isFragment: true" in these pages as front matter data
"isFragment":  false

// only for "WHATWG" validator. string or array of strings or rules (when using WHATWG) you want the checker to remove in the response. even partial text.
// e.g. "ignore": ["Mismatched close-tag, expected '</div>' but found '</body>'", "another partial error response text"]
"ignore": [],

// only for "WHATWG" validator. additional configuration for elements and rules
"whatwgConfig": {
	"elements": [],
	"rules": {}
}
```
## custom WHATWG configuration
```js
// with this example, you add a custom tag called "customtag" to the valid tags in the validation. see https://html-validate.org/guide/metadata/simple-component.html
// additionally, you set the "heading-level" rule to "on" instead of "off". see https://html-validate.org/rules/index.html
"whatwgConfig": {
	"elements": [
		{
			"customtag": {
				"flow": true,
				"phrasing": true
			}
		}
	],
	"rules": {
		"heading-level": "error"
	}
}
```
## Front Matter Data

Two parameters can be used as front matter data:

- `validateHtml: true|false` to enable or disable validation for individual pages.
- `isFragment: true|false` to declare a document as a fragment.

If the parameters are not set, the defaults are:

-   `validateHtml: true`
-   `isFragment: false`


Example:

```js
---
validateHtml: true
isFragment: false
---
```

## Team ARMADA 429
<img src="https://raw.githubusercontent.com/saiballo/saiballo/refs/heads/master/armada429.png" width="100" height="100">

* Lorenzo "Saibal" Forti

## License

![](https://img.shields.io/badge/License-Copyleft%20Saibal%20--%20All%20Rights%20Reserved-red)
