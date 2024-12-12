/**
* @preserve
* Filename: main.js
*
* Created: 30/11/2024 (19:43:22)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 12/12/2024 (10:47:22)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2024 - Tutti i diritti riservati
*
* Comments:
*/

const getPageList = require("./src/pageList.js");
const doValidation = require("./src/validate.js");
const pkg = require("./package.json");
const toLog = require("./src/log.js");

const defaultConfig = {
	"extensionList": "htm,html",
	"validator": "WHATWG",
	"isLocal": false,
	"isFragment": false,
	"ignore": [],
	"whatwgConfig": {
		"elements": [],
		"rules": {}
	}
};

module.exports = (eleventyconfig, config = {}) => {

	try {

		// merge defaultConfig with custom config
		const pluginConfig = {
			...defaultConfig,
			...config
		};

		const { extensionList } = pluginConfig;

		eleventyconfig.versionCheck(pkg["11ty"].compatibility);

		eleventyconfig.on("eleventy.after", (output) => {

			const pageList = getPageList(extensionList, output);

			if (Object.keys(pageList).length > 0) {

				doValidation(pageList, pluginConfig);

			} else {

				toLog("no valid page extensions found in dist/public folder. nothing to validate.");
			}
		});

	} catch (err) {

		toLog(err, "error");
	}
};
