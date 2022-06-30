
// 4% discount rate
const DISCOUNT_RATE = 0.04;

const calcDiscount = (annual_benefit, time_frame) => {

	// console.log(`Calculating total benefit for ${time_frame} years with an annual benefit of ${annual_benefit}`);

	let total_benefit = 0;

	for(let i = 1; i <= time_frame; i++) {

		let current_benefit = annual_benefit / Math.pow((1+DISCOUNT_RATE), (i-1));

		// console.log(`benefit for year ${i} is ${current_benefit}`);

		total_benefit += current_benefit;
	}

	// console.log(`Total benefit is: ${total_benefit}`);

	return total_benefit;
};

export default calcDiscount;
