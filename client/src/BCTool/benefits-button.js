import React from 'react';

const EstimateBenefitsButton = (props) => {

	const { updateBenefits } = props;

	return (
		<button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={updateBenefits}>Estimate Benefits</button>
	);

};

const UpdateBenefitsEnabledButton = (props) => {

	const { updateBenefits } = props;

	return (
		<button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={updateBenefits}>Update Benefits</button>
	)
};

const UpdateBenefitsDisabledButton = () => (
	<button
      type="button"
      className="btn btn-secondary btn-lg"
      disabled>Update Benefits</button>
);

const UpdateBenefitsButton = (props) => {

	const { updateBenefits, inputsChanged } = props;

	return (
		<>
		{ inputsChanged ?
		<UpdateBenefitsEnabledButton updateBenefits={updateBenefits} />
		:
		<UpdateBenefitsDisabledButton />
		}
		</>
	);

};

const BenefitsButton = (props) => {

	const {
		showBenefits,
		updateBenefits,
		inputsChanged,
	} = props;

	return (
		<>
		{ showBenefits ?
		<UpdateBenefitsButton updateBenefits={updateBenefits} inputsChanged={inputsChanged} />
		:
		<EstimateBenefitsButton updateBenefits={updateBenefits} />
		}
		</>
	);

};

export default BenefitsButton;