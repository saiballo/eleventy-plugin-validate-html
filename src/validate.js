/**
* @preserve
* Filename: validate.js
*
* Created: 30/11/2024 (18:44:22)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 13/12/2024 (17:09:11)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2024 - Tutti i diritti riservati
*
* Comments:
*/

"use strict";

const htmlValidator = require("@saiballo/html-validator-enhanced");
const fs = require("node:fs");
const toLog = require("./log.js");

// validator different from WHATWG and format "json" does not accept "ignore" option
const checkIgnoreOption = (pluginconfig) => {

	const clonedConfig = {
		...pluginconfig
	};

	if (clonedConfig["validator"].toLowerCase() !== "whatwg") {

		delete clonedConfig["ignore"];
	}

	return clonedConfig;
};

// collect errors list
const processError = (errorlist, isWhatwg = true) => {

	const result = [];

	errorlist.forEach((error, index) => {

		const line = isWhatwg === true ? error["line"] : error["lastLine"];
		const column = isWhatwg === true ? error["column"] : error["lastColumn"];

		result.push(`${index + 1}. ${error.message} [Line ${line}, Column ${column}]`);
	});

	return result;
};

// validation main function
const doValidation = async (pageList, pluginconfig) => {

	const pluginConfig = checkIgnoreOption(pluginconfig);
	const validatorType = pluginConfig["validator"].toLowerCase();
	let checkedTotal = 0;
	let counterError = 0;

	/* eslint-disable no-await-in-loop */
	// avoid to send to validator an excessive amount of requests in parallel using await in loop
	for (const page of pageList) {

		try {

			let errorList = [];
			let isValid = true;
			// increment counter
			checkedTotal += 1;

			const validateConfig = {
				...pluginConfig,
				// not want user can overwrites format option. must be json
				"format": "json",
				"isFragment": page["isFragment"] ?? pluginconfig["isFragment"],
				"data": fs.readFileSync(page["output"], "utf8")
			};

			// validating the page
			const result = await htmlValidator(validateConfig);

			// validator WHATWG
			if (validatorType === "whatwg" && result["isValid"] === false) {

				errorList = processError(result["errors"]);

				isValid = false;
			}

			// validator w3c
			if (validatorType !== "whatwg" && result["messages"].length > 0) {

				errorList = processError(result["messages"]);

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

				const message = errorList.join("\n");
				counterError += 1;

				toLog(`validation error ❌\n📕 Input: ${page["input"]}\n📘 Output: ${page["output"]}\n${message}\n`, "error");
			}

		} catch (err) {

			counterError += 1;

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
