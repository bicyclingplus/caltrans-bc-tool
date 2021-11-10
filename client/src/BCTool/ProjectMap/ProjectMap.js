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

    style = (feature) => {

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

    featureClicked = (e) => {

      // console.log('Before');
      // console.log(this.selected);
      // console.log(this.length);

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

      // console.log('After');
      // console.log(this.selected);
      // console.log(this.length);

      this.renderFeatures();

      this.props.updateLength(this.length);
    }

    onEachFeature = (feature, mapLayer) => {
      mapLayer.on({
        click: this.featureClicked
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
            this.featuresRaw = result;
            this.renderFeatures()
          },
          (error) => {
            console.log(error);
          },
        );
    }

    renderFeatures() {
      // console.log('Render!');
      if(this.features) {
        this.map.removeLayer(this.features);
      }
      this.features = Leaflet.geoJSON(this.featuresRaw, {
        style: this.style,
        onEachFeature: this.onEachFeature,
      });
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

    render() {

        return (
            <div id="map"></div>
        );
    }

}

export default ProjectMap;