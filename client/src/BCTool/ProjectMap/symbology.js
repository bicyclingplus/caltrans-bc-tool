// waypoint for user defined is for the circle
// the map displays when adding a link for the
// first click, subsequent clicks display
// as a line

const symbology = {
	"user_defined": {
		"intersection": {
			"radius": 10,
	        "color_fill": "#C6007E",
	        "color_border": "#000",
	        "weight": 0,
	        "opacity": 1,
	        "fillOpacity": 0.6,
		},
		"waypoint": {
			"radius": 10,
	        "color_fill": "#C6007E",
	        "color_border": "#000",
	        "weight": 0,
	        "opacity": 1,
	        "fillOpacity": 0.6,
		},
		"link": {
			"color": "#C6007E",
			"opacity": 0.6,
			"weight": 8,
		}
	},
	"pre_existing": {
		"intersection": {
			"radius": 10,
	        "color_fill": "gray",
	        "color_fill_selected": "#FFBF00",
	        "color_border": "#000",
	        "weight": 0,
	        "opacity": 1,
	        "fillOpacity": 0.4,
	        "fillOpacity_selected": 0.6,
		},
		"link": {
			"color": "gray",
			"color_selected": "#FFBF00",
			"weight": 8,
			"opacity": 0.4,
			"opacity_selected": 0.6,
		}
	}
};

export default symbology;