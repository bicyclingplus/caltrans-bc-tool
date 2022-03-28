import React from 'react';

const ExportBenefitsEnabledButton = (props) => {

	const { exportBenefits } = props;

	return (
		<button
          type="button"
          className="btn btn-primary btn-lg ms-4"
          onClick={exportBenefits}>Export Benefits</button>
	)
};

const ExportBenefitsDisabledButton = () => (
	<button
      type="button"
      className="btn btn-secondary btn-lg  ms-4"
      disabled>Export Benefits</button>
);

const ExportBenefitsButton = (props) => {

	const { exportBenefits, inputsChanged } = props;

	return (
		<>
		{ inputsChanged ?
		<ExportBenefitsDisabledButton />
		:
		<ExportBenefitsEnabledButton exportBenefits={exportBenefits} />
		}
		</>
	);

};

const ExportButton = (props) => {

	const {
		showBenefits,
		exportBenefits,
		inputsChanged,
	} = props;

	return (
		<>
		{ showBenefits ?
		<ExportBenefitsButton exportBenefits={exportBenefits} inputsChanged={inputsChanged} />
		:
		null }
		</>
	);

};

export default ExportButton;