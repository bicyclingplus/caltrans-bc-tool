import React from 'react';
import Leaflet from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './ProjectMap.css';

class ProjectMap extends React.Component {

    constructor(props) {
      super(props);

      this.map = null;
      this.featuresRaw = {};
      this.features = null;

      this.selectedWayIds = [];
      this.selectedWays = [];

      this.length = 0;

      this.selectedIntersectionIds = [];
      this.selectedIntersections = [];

      this.state = {
        "mode": "way",
      }

      this.updateMap = this.updateMap.bind(this);
    }

    componentDidMount() {
      this.updateMap();
    }

    componentDidUpdate(prevProps) {
      if(this.props.geojson !== prevProps.geojson) {

        this.map.off();
        this.map.remove();
        this.map = null;

        this.featuresRaw = {};
        this.features = null;

        this.selectedWayIds = [];
        this.selectedWays = [];

        this.length = 0;

        this.selectedIntersectionIds = [];
        this.selectedIntersections = [];

        this.props.updateMapSelections([], [], 0);

        this.updateMap();
      }
    }

    styleWay = (feature) => {

      let color = "gray"

      if(this.selectedWayIds.includes(feature.properties.edgeUID)) {
        color = "#00FFFF";
        // color = "#022851";
      }

      return {
        color: color,
        weight: 8,

      };
    }

    calcLengthArray = (latlngs) => {
      let total = latlngs[0].distanceTo(latlngs[1]);

      for(let i = 1; i < latlngs.length - 1; i++) {
        total += latlngs[i].distanceTo(latlngs[i+1]);
      }

      // m to ft
      return total * 3.28084;
    }

    // This can handle multilinestring and linestring
    calcLength = (latlngs) => {

      if(Array.isArray(latlngs[0])) {

        let total = 0;

        for(let i = 0; i < latlngs.length; i++) {
          total += this.calcLengthArray(latlngs[i]);
        }

        return total;
      }

      return this.calcLengthArray(latlngs);
    }

    splitSourceTarget(str) {
      return str.split(',').map((el) => parseInt(el));
    }

    wayClicked = (e) => {

      // console.log('Fire!');

      let length = this.calcLength(e.target.getLatLngs());
      let feature = e.target.feature;
      let featureId = feature.properties.edgeUID;

      // console.log(feature);

      if(!feature.properties.ONE_WAY_CA) {
        length *= 2;
      }
      // else {
      //   console.log('ONE WAY STREET SELECTED');
      // }

      // If this way is already selected, remove it otherwise select it
      if(this.selectedWayIds.includes(featureId)) {

        // Remove the clicked way from selection and length count
        this.selectedWayIds = this.selectedWayIds.filter((item) => (item !== featureId));
        this.selectedWays = this.selectedWays.filter((item) => (item.properties.edgeUID !== featureId));
        this.length -= length;

        // Grab the intersection ids attached to the way we're removing
        let [ intA, intB ] = this.splitSourceTarget(feature.properties['source_target']);

        let intAFound = false;
        let intBFound = false;

        // Check all the other selected ways to see if they include this intersection
        for(let way of this.selectedWays) {

          // Skip this one
          if(way.properties.edgeUID === featureId) {
            continue;
          }

          let [ source, target ] = this.splitSourceTarget(way.properties['source_target']);

          if(intA === source || intA === target) {
            intAFound = true;
          }

          if(intB === source || intB === target) {
            intBFound = true;
          }
        }

        // If no other selected ways use these intersections, remove them from selection
        if(!intAFound) {
          this.selectedIntersectionIds = this.selectedIntersectionIds.filter((item) => (item !== intA));
          this.selectedIntersections = this.selectedIntersections.filter((item) => (item.properties.nodeID !== intA));
        }

        if(!intBFound) {
          this.selectedIntersectionIds = this.selectedIntersectionIds.filter((item) => (item !== intB));
          this.selectedIntersections = this.selectedIntersections.filter((item) => (item.properties.nodeID !== intB));
        }
      }
      else {
        feature.properties.length = length;
        this.selectedWayIds.push(featureId);
        this.selectedWays.push(feature);
        this.length += length;

        let [ intA, intB ] = this.splitSourceTarget(feature.properties['source_target']);

        if(!this.selectedIntersectionIds.includes(intA)) {
          this.selectedIntersectionIds.push(intA);

          // find the feature for this intersection
          for(let intersection of this.intersections) {
            if(intersection.properties.nodeID === intA) {
              this.selectedIntersections.push(intersection);
              break;
            }
          }
        }

        if(!this.selectedIntersectionIds.includes(intB)) {
          this.selectedIntersectionIds.push(intB);

          // find the feature for this intersection
          for(let intersection of this.intersections) {
            if(intersection.properties.nodeID === intB) {
              this.selectedIntersections.push(intersection);
              break;
            }
          }
        }

      }

      if(!this.selectedWayIds.length) {
        this.length = 0;
      }

      this.renderFeatures();

      this.props.updateMapSelections(this.selectedWays, this.selectedIntersections, this.length);
    }

    onEachWay = (feature, mapLayer) => {
      mapLayer.on({
        click: this.wayClicked,
      });
    }

    onMapMove() {
      // query current bounds to the server
      let bounds = this.map.getBounds();
      let url = `${process.env.PUBLIC_URL}/api/bounds`;

      url += `?x1=${bounds.getWest()}&x2=${bounds.getEast()}&y1=${bounds.getSouth()}&y2=${bounds.getNorth()}`;

      fetch(url)
        .then((res) => res.json())
        .then(
          (result) => {
            if(this.props.interactive) {
              this.ways = result.ways.features;
              this.intersections = result.intersections.features;
            }
            else {
              this.featuresRaw = result.ways;
            }
            this.renderFeatures()
          },
          (error) => {
            console.log(error);
          },
        );
    }

    pointToLayer = (feature, latlng) => {

      // Selected feature styling
      let color = "grey";

      if(this.selectedIntersectionIds.includes(feature.properties.nodeID)) {
        // color = "#00FFFF";
        color = "#FFBF00";
      }

      return Leaflet.circleMarker(latlng, {
        radius: 10,
        fillColor: color,
        color: "#000",
        weight: 0,
        opacity: 1,
        fillOpacity: 0.8
      })
    }

    onEachIntersection = (feature, mapLayer) => {
      mapLayer.on({
        click: this.intersectionClicked
      });
    }

    intersectionClicked = (e) => {


      let feature = e.target.feature;
      let featureId = feature.properties.nodeID;

      // Check if this intersection is already selected or not
      if(this.selectedIntersectionIds.includes(featureId)) {

        // Remove from selection
        this.selectedIntersectionIds = this.selectedIntersectionIds.filter((item) => (item !== featureId));
        this.selectedIntersections = this.selectedIntersections.filter((item) => (item.properties.nodeID !== featureId));
      }
      else {

        // Add to selection
        this.selectedIntersectionIds.push(featureId);
        this.selectedIntersections.push(feature);
      }

      // Update features on map
      this.renderFeatures();

      // Let tool know about change in number of intersections
      this.props.updateMapSelections(this.selectedWays, this.selectedIntersections, this.length);
    }

    renderFeatures() {
      // console.log('Render!');

      if(this.props.interactive) {

        // console.log(this.selectedWayIds);
        // console.log(this.selectedWays);
        // console.log(this.selectedIntersectionIds);
        // console.log(this.selectedIntersections);

        // TODO refactor to combine onEachFeature handlers
        // abstract out just the feature set

        if(this.wayFeatures) {
          this.map.removeLayer(this.wayFeatures);
        }

        if(this.intersectionFeatures) {
          this.map.removeLayer(this.intersectionFeatures);
        }

        this.wayFeatures = Leaflet.geoJSON(this.ways, {
          onEachFeature: this.state.mode === "way" ? this.onEachWay : null,
          style: this.styleWay,
        });

        this.intersectionFeatures = Leaflet.geoJSON(this.intersections, {
          onEachFeature:  this.state.mode !== "way" ? this.onEachIntersection : null,
          pointToLayer: this.pointToLayer,
        });

        // stack order
        if(this.state.mode === "way") {
          this.intersectionFeatures.addTo(this.map);
          this.wayFeatures.addTo(this.map);
        }
        else {
          this.wayFeatures.addTo(this.map);
          this.intersectionFeatures.addTo(this.map);
        }
      }
      else {

        if(this.features) {
          this.map.removeLayer(this.features);
        }

        this.features = Leaflet.geoJSON(this.featuresRaw, {
          style: this.style,
          onEachFeature: this.onEachFeature,
        });

        this.features.addTo(this.map);
      }
    }

    updateMap() {

      // console.log(`interactive: ${this.props.interactive}`)

      // console.log('Map update!');

      if(!this.map) {
        this.map = Leaflet.map('map');

        Leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
        }).addTo(this.map);
      }

      if(this.props.interactive) {

        this.map.setMinZoom(15);

        this.map.setView(this.props.center, 16);

        this.map.on('moveend', () => {
          this.onMapMove();
        });

        this.onMapMove();
      }
      else {
        if(this.features) {
          this.map.removeLayer(this.features);
        }

        if(this.props.geojson) {
          this.features = Leaflet.geoJSON(this.props.geojson);

          this.features.addTo(this.map);
          this.map.fitBounds(this.features.getBounds());
        }

      }
    }

    selectWays = () => {
      this.setState({
        "mode": "way",
      }, this.renderFeatures);
    }

    selectIntersections = () => {
      this.setState({
        "mode": "intersection",
      }, this.renderFeatures);
    }

    reset = () => {
      this.selectedWayIds = [];
      this.selectedWays = [];

      this.selectedIntersectionIds = [];
      this.selectedIntersections = [];

      this.props.updateMapSelections([], [], 0);

      this.renderFeatures();
    }

    render() {

      let { interactive } = this.props;
      let { mode } = this.state;

      let wayClasses = mode === 'way' ? `btn btn-primary active` : `btn btn-outline-primary`;
      let intersectionClasses = mode === 'intersection' ? `btn btn-primary active` : `btn btn-outline-primary`;

      // TODO refactor selector to separate component?

      return (
        <>
          { interactive ?
          <div className="mb-4">
            <strong>Selecting on map:</strong>
            <div className="btn-group ms-4" role="group" aria-label="Basic example">
              <button type="button" className={wayClasses} onClick={this.selectWays}>Segments</button>
              <button type="button" className={intersectionClasses} onClick={this.selectIntersections}>Intersections</button>
            </div>

            <button type="button" className="btn btn-secondary ms-4" onClick={this.reset}>Reset</button>
          </div>
          : null }
          <div id="map"></div>
        </>
      );
    }

}

export default ProjectMap;