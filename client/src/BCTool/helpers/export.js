import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { readableNumber } from '../helpers/formatting';

const ExportPDF = (state) => {

	let {
		name,
		cost,
	} = state;

	const doc = new jsPDF();

	// project info
	doc.text([
		`Project Name: ${name}`,
		`Project Cost: $${readableNumber(cost)}`
	], 10, 10);

	// travel benefits
	doc.addPage();
	doc.text([
		'Project-Level Active Travel',
		'Estimated Average Daily Bike Miles Traveled (BMT)'
	], 10, 10);
	doc.autoTable({ html: '#travel-bike', startY: 30});

	doc.addPage();
	doc.text(['Estimated Average Daily Walk Miles Traveled (WMT)'], 10, 10);
	doc.autoTable({ html: '#travel-pedestrian', startY: 20});

	// quantitative benefits
	doc.addPage();
	doc.text([
		'Project-Level Quantitative Benefits',
		'Safety'
	], 10, 10);
	doc.autoTable({ html: '#safety', startY: 30});

	doc.addPage();
	doc.text(['VMT and Emissions'], 10, 10);
	doc.autoTable({ html: '#vmt', startY: 20});
	doc.autoTable({ html: '#emissions'});

	doc.addPage();
	doc.text(['Physical Activity'], 10, 10);
	doc.autoTable({ html: '#health', startY: 20});

	// project qualitative benefits
	doc.addPage();
	doc.text(['Qualitative Benefits'], 10, 10);
	doc.autoTable({ html: '#project-qualitative', startY: 20});

	// element qualitative benefits
	doc.addPage();
	doc.text(['Element Specific Benefits'], 10, 10);
	doc.autoTable({ html: '#element-specific', startY: 20});

	doc.save("caltrans-bc-tool-export.pdf");
};

export default ExportPDF;