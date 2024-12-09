/**
* @preserve
* Filename: validate.js
*
* Created: 30/11/2024 (18:44:22)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 06/12/2024 (18:07:58)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2024 - Tutti i diritti riservati
*
* Comments:
*/

"use strict";

const htmlValidator = require("html-validator");
const fs = require("fs");
const fm = require("front-matter");
const toLog = require("./log.js");

// get frontmatter data from every template
const getMatterData = (item) => {

	return new Promise((resolve, reject) => {

		fs.readFile(item, "utf8", (err, data) => {

			if (err !== null) {

				toLog(err, "error");
				reject(err);
			}

			const matterData = fm(data);

			resolve(matterData["attributes"]);
		});
	});
};

const doValidation = async (pageList, pluginconfig) => {

	let checkedTotal = 0;
	let counterError = 0;

	/* eslint-disable no-await-in-loop */
	// avoid to send to validator an excessive amount of requests in parallel using await in loop
	for (const page of pageList) {

		try {

			const frontMatter = await getMatterData(page["input"]);
			const toValidate = frontMatter["validateHtml"] ?? true;

			if (toValidate === true) {

				const errorText = [];
				let isValid = true;
				// increment counter
				checkedTotal += 1;

				if (typeof frontMatter["isFragment"] !== "undefined") {

					pluginconfig["isFragment"] = frontMatter["isFragment"];
				}

				const validateConfig = {
					...pluginconfig,
					// not want user can overwrites format option. must be json
					"format": "json",
					"data": fs.readFileSync(page["output"], "utf8")
				};

				// validating the page
				const result = await htmlValidator(validateConfig);

				// validator WHATWG
				if (pluginconfig["validator"] === "WHATWG" && result["isValid"] === false) {

					result["errors"].forEach((item, index) => {

						errorText.push(`${index+1}. ${item.message} [Line ${item.line}, Column ${item.column}]`);
					});

					isValid = false;
				}

				// validator web url
				if (pluginconfig["validator"] !== "WHATWG" && result["messages"].length > 0) {

					result["messages"].forEach((item, index) => {

						errorText.push(`${index+1}. ${item.message} [Line ${item.lastLine}, Column ${item.lastColumn}]`);
					});

					isValid = false;

					// code for text format. not used
					// const validText = [
					// 	"The document validates according to the specified schema(s).",
					// 	"The document is valid HTML5 + ARIA + SVG 1.1 + MathML 2.0"
					// ];

					// isValid = validText.some((el) => result.includes(el));
					// message = result;
				}

				if (isValid === false) {

					const message = errorText.join("\n");
					counterError += 1;

					toLog(`validation error ❌\n📕 Input: ${page["input"]}\n📘 Output: ${page["output"]}\n${message}\n`, "error");
				}
			}

		} catch (err) {

			toLog(err, "error");
		}
	}
	/* eslint-enable no-await-in-loop */

	toLog(`${checkedTotal} pages checked`);

	if (counterError > 0) {

		toLog(`found ${counterError} page(s) with errors`, "error");

	} else {

		toLog("all your html files are valid!", "info");
	}
};

module["exports"] = doValidation;
