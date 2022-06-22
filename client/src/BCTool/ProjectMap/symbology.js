// waypoint for user defined is for the circle
// the map displays when adding a link for the
// first click, subsequent clicks display
// as a line

const symbology = {
	user_defined: {
		intersection: {
	        radius: 10.0,
	        fillColor: "#C6007E",
	        color: "#000",
	        weight: 0.0,
	        opacity: 1.0,
	        fillOpacity: 0.6,
	      },
		waypoint: {
	        radius: 10.0,
	        fillColor: "#C6007E",
	        color: "#000",
	        weight: 0.0,
	        opacity: 1.0,
	        fillOpacity: 0.6,
	      },
		link: {
			color: "#C6007E",
			opacity: 0.6,
			weight: 8.0,
		}
	},
	pre_existing: {
		default: {
			intersection: {
		        radius: 10.0,
		        fillColor: "gray",
		        color: "#000",
		        weight: 0.0,
		        opacity: 1.0,
		        fillOpacity: 0.4,
		      },
			link: {
				color: "gray",
				opacity: 0.4,
				weight: 8.0,
			},
		},
		selected: {
			intersection: {
		        radius: 10.0,
		        fillColor: "#FFBF00",
		        color: "#000",
		        weight: 0.0,
		        opacity: 1.0,
		        fillOpacity: 0.6,
		      },
			link: {
				color: "#FFBF00",
				opacity: 0.6,
				weight: 8.0,
			},
		},
	},
};

export default symbology;
