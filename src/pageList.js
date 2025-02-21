/**
* @preserve
* Filename: pageList.js
*
* Created: 02/12/2024 (19:59:52)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 24/12/2024 (11:21:24)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2024 - Tutti i diritti riservati
*
* Comments:
*/

"use strict";

const fs = require("node:fs").promises;
const fm = require("front-matter");
const toLog = require("./log.js");

// get frontmatter data from every template
const getFrontMatter = async (filePath) => {

	try {

		const fileContent = await fs.readFile(filePath, "utf8");
		const parsedData = fm(fileContent);

		return parsedData["attributes"];

	} catch (err) {

		toLog(err, "error");
	}
};

// get only valid extension pages. used Promise.all() for greater efficiency
const getPageList = async (extensionlist, output) => {

	const extensionList = extensionlist.split(",").join("|");
	const validExtension = new RegExp(`\\.(${extensionList})$`);

	const promises = output["results"].map(async (res) => {

		if (validExtension.test(res["outputPath"]) === true) {

			try {

				const frontMatter = await getFrontMatter(res["inputPath"]);
				const toValidate = frontMatter["validateHtml"] ?? true;

				if (toValidate === true) {

					return {
						"input": res["inputPath"],
						"output": res["outputPath"],
						"isFragment": frontMatter["isFragment"] ?? null
					};
				}

			} catch (err) {

				toLog(err, "error");
			}
		}

		return null;
	});

	return (await Promise.all(promises)).filter(Boolean);
};

// get only valid extension pages. this version has await inside loop. less efficient
// /* eslint-disable no-await-in-loop */
// const getPageList = async (extensionlist, output) => {

// 	const extensionList = extensionlist.split(",").join("|");
// 	const pageList = [];

// 	for (const res of output["results"]) {

// 		if (res["outputPath"].match(`\\.(${extensionList})$`) !== null) {

// 			const frontMatter = await getFrontMatter(res["inputPath"]);
// 			const toValidate = frontMatter["validateHtml"] ?? true;

// 			if (toValidate === true) {

// 				pageList.push({
// 					"input": res["inputPath"],
// 					"output": res["outputPath"],
// 					"isFragment": frontMatter["isFragment"] ?? null
// 				});
// 			}
// 		}
// 	}

// 	return pageList;
// };
// /* eslint-enable no-await-in-loop */

module["exports"] = getPageList;
