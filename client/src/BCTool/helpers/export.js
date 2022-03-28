import { jsPDF } from "jspdf";
import { readableNumber } from '../helpers/formatting';

const createHeaders = (keys) => {
	let headers = [];

	for(let key of keys) {
		headers.push({
	      id: key,
	      name: key,
	      prompt: key,
	      width: 65,
	      align: "center",
	      padding: 0
	    });
	}

	return headers
}

// const createData 

const ExportPDF = (state) => {

	let {
		benefits,
		name,
		cost,
		timeframe,
		subtype,
	} = state;


	const doc = new jsPDF();

	doc.text([
		`Project Name: ${name}`,
		`Project Cost: $${readableNumber(cost)}`
	], 10, 10);

	// let projectQualitativeHeaders = ["Theme", "Description"];

	// doc.addPage();
	// doc.text('Qualitative Benefits', 10, 10);
	// doc.table(10, 20, benefits.projectQualitative, createHeaders(projectQualitativeHeaders), { "autoSize": true });


	doc.save("caltrans-bc-tool-export.pdf");
};

export default ExportPDF;