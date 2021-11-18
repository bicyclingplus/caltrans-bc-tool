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
      this.selected = [];
      this.length = 0;
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

        this.selected = [];
        this.length = 0;
        this.features = null;
        this.featuresRaw = {};
        this.map.off();
        this.map.remove();
        this.map = null;

        this.updateMap();
      }
    }

    styleWay = (feature) => {

      if(this.selected.includes(feature.properties.TDG_ID)) {
        return {
          color: "#00FFFF",
        }
      }

      return {
        color: "gray",
      };
    }

    calcLength = (latlngs) => {

      let total = latlngs[0].distanceTo(latlngs[1]);

      for(let i = 1; i < latlngs.length - 1; i++) {
        total += latlngs[i].distanceTo(latlngs[i+1]);
      }

      // m to ft
      return total * 3.28084;
    }

    wayClicked = (e) => {

      let featureId = e.target.feature.properties.TDG_ID;
      let length = this.calcLength(e.target.getLatLngs());

      if(!e.target.feature.properties.ONE_WAY_CA) {
        length *= 2;
      }

      if(this.selected.includes(featureId)) {
        this.selected = this.selected.filter((item) => (item !== featureId));
        this.length -= length;
      }
      else {
        this.selected.push(featureId);
        this.length += length;
      }

      if(!this.selected.length) {
        this.length = 0;
      }

      this.renderFeatures();

      this.props.updateLength(this.length);
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
              this.ways = result.ways;
              this.intersections = result.intersections;
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

      let color = "grey";

      if(this.selectedIntersections.includes(feature.properties.id)) {
        color = "#00FFFF";
      }

      return Leaflet.circleMarker(latlng, {
        radius: 8,
        fillColor: color,
        color: "#000",
        weight: 1,
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

      let featureId = e.target.feature.properties.id;

      if(this.selectedIntersections.includes(featureId)) {
        this.selectedIntersections = this.selectedIntersections.filter((item) => (item !== featureId));
      }
      else {
        this.selectedIntersections.push(featureId);
      }

      this.renderFeatures();

      // Let tool know about change in number of intersections
      this.props.updateIntersections(this.selectedIntersections.length);
    }

    renderFeatures() {
      // console.log('Render!');
      if(this.features) {
        this.map.removeLayer(this.features);
      }

      if(this.props.interactive) {

        if(this.state.mode === "way") {
          this.features = Leaflet.geoJSON(this.ways, {
            style: this.styleWay,
            onEachFeature: this.onEachWay,
          });
        }
        else {
          this.features = Leaflet.geoJSON(this.intersections, {
            pointToLayer: this.pointToLayer,
            onEachFeature: this.onEachIntersection,
          });
        }
      }
      else {
        this.features = Leaflet.geoJSON(this.featuresRaw, {
          style: this.style,
          onEachFeature: this.onEachFeature,
        });
      }
      this.features.addTo(this.map);
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
            accessToken: 'pk.eyJ1IjoibWZhdmV0dGkiLCJhIjoiY2tvYnFyYndpMDB2dDJwcGRiM3h4dG9sciJ9.lpkeRUBN_K546qVPWRs2BA'
        }).addTo(this.map);
      }

      if(this.props.interactive) {

        this.map.setMinZoom(15)

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

    render() {

      let { interactive } = this.props;
      let { mode } = this.state;

      let btnClasses = "btn btn-primary";
      let wayClasses = mode === 'way' ? `${btnClasses} active` : btnClasses;
      let intersectionClasses = mode === 'intersection' ? `${btnClasses} active` : btnClasses;

      return (
        <>
          { interactive ?
          <div className="mb-4">
            <strong>Selecting on map:</strong>
            <div className="btn-group ms-4" role="group" aria-label="Basic example">
              <button type="button" className={wayClasses} onClick={this.selectWays}>Ways</button>
              <button type="button" className={intersectionClasses} onClick={this.selectIntersections}>Intersections</button>
            </div>
          </div>
          : null }
          <div id="map"></div>
        </>
      );
    }

}

export default ProjectMap;