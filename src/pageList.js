/**
* @preserve
* Filename: pageList.js
*
* Created: 02/12/2024 (19:59:52)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 05/12/2024 (17:02:21)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2024 - Tutti i diritti riservati
*
* Comments:
*/

"use strict";

// get only valid extension pages
const getPageList = (extensionlist, output) => {

	const extensionList = extensionlist.split(",").join("|");
	const pageList = [];

	output.results.flatMap((res) => {

		if (res.outputPath.match(`^.*\\.(${extensionList})$`) !== null) {

			pageList.push({
				"input": res["inputPath"],
				"output": res["outputPath"]
			});
		}
	});

	return pageList;
};

module["exports"] = getPageList;
