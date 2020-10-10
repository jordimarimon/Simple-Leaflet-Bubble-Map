import { scaleLinear } from 'd3-scale';
import * as _chroma from 'chroma-js';

const chroma = _chroma.default;

const defaultStyles = {
  radius: 10,
  fillColor: "#74acb8",
  color: "#f5f5f5",
  weight: 1,
  opacity: 0.5,
  fillOpacity: 0.5,
};

L.BubbleLayer = L.Layer.extend({

  initialize: function (geojson, options) {

    this._geojson = geojson;

    options.max_radius = options.hasOwnProperty('max_radius') ? options.max_radius : 35;

    options.legend = options.hasOwnProperty('legend') ? options.legend : true;

    options.tooltip = options.hasOwnProperty('tooltip') ? options.tooltip : true;

    options.scale = options.hasOwnProperty('scale') ? options.scale : false;

    options.style = options.hasOwnProperty('style') ? {...defaultStyles, ...options.style} : defaultStyles;

    L.setOptions(this, options);

    const valid = this._hasRequiredProp(this.options.property);

    if (!valid) {
      throw new Error('Error: The property must be included in every GeoJSON feature');
    }

  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  // When Layer is added to the map, present each point as a bubble
  onAdd: function(map) {

    this._map = map;

    // createLayer does the work of visualizing geoJSON as bubbles
    const geoJsonLayer = this.createLayer();

    this._layer = geoJsonLayer;

    map.addLayer(geoJsonLayer);
  },

  onRemove: function (map) {
    this._map = map;

    // Handle the native remove from map function
    map.removeLayer(this._layer);
  },

  createLayer: function() {

    const max = this._getMax(this._geojson)

    // Caluclate the minimum and maximum radius from the max area
    // TODO: how to handle zero and negative values
    const min_area = Math.PI * 3 * 3;
    const max_area = Math.PI * this.options.max_radius * this.options.max_radius;

    // Scale by the maxium value in the dataset
    const scale = scaleLinear()
      .domain([0, max])
      .range([min_area, max_area]);

    const normal = scaleLinear()
     .domain([0,max])
     .range([0, 1]);

    // Store for reference
    this._scale = scale;
    this._normal = normal;
    this._max = max;

    // Use the selected property
    const property = this.options.property;
    const style = this.options.style;
    const fill_scale = false;

    if (this.options.scale) {
      fill_scale = chroma.scale(this.options.scale);
    }

    const onEachFeature = this._onEachFeature.bind(this);

    return new L.geoJson(this._geojson, {

      pointToLayer: function(feature, latlng) {

        // TODO Check if total is a valid amount
        const total = feature.properties[property];

        // Calculate the area of the bubble based on the property total and the resulting radius
        const area = scale(total);
        const radius = Math.sqrt(area / Math.PI)
        style.radius = radius;

        // If the option include a scale, use it
        if (fill_scale) { style.fillColor = fill_scale(normal(total)) }
        style.color = chroma(style.fillColor).darken().hex()

        // Create the circleMarker object
        return L.circleMarker(latlng, style);
      },

      onEachFeature: onEachFeature,
    });
  },

  _getMax : function() {
    let max = 0;
    const features = this._geojson.features;
    const property = this.options.property;

    for (let i = 0; i < features.length; i++) {
      if (features[i].properties[property] > max) {
        max = features[i].properties[property];
      }
    }

    return max;
  },

  _hasRequiredProp: function(property) {
    const valid = true;
    const features = this._geojson.features;

    for (let i = 0; i < features.length; i++) {

      if (features[i].properties.hasOwnProperty(property) !== true) {
        valid = false;
      }
    }

    return valid;
  },

  _onEachFeature: function(feature, layer) {

  },

});

export const bubbleLayer = (geojson, options) => new L.BubbleLayer(geojson, options);
