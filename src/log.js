/**
* @preserve
* Filename: log.js
*
* Created: 30/11/2024 (18:44:22)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 06/12/2024 (18:08:18)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2024 - Tutti i diritti riservati
*
* Comments:
*/

"use strict";

const toLog = (message = "OPS! An error has occured", type = "default") => {

	let logIcon;

	switch (type) {
		case "info":
			logIcon = "✅";
			break;
		case "error":
			logIcon = "❌";
			break;
		default:
			logIcon = "📣";
			break;
	}

	const logLabel = `${logIcon} plugin-validate-html:`;

	console.error(`${logLabel} ${message}`);
};

module["exports"] = toLog;
