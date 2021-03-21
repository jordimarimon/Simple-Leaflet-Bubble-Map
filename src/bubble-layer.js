import { scaleLinear } from 'd3-scale';
import * as _chroma from 'chroma-js';

const chroma = _chroma.default;

L.BubbleLayer = L.Layer.extend({

  options: {
    max_radius: 35,
    max_amount: 20,
    legend: true,
    tooltip: true,
    scale: false,
    style: {
      radius: 10,
      fillColor: "#74ACB8",
      color: "#F5F5F5",
      legendColor: '#202020',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.5,
    },
  },

  initialize: function (geojson, options) {
    this._geojson = geojson;

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
    this._layer = this._createLayer();

    map.addLayer(this._layer);
  },

  onRemove: function (map) {
    this._map = map;

    // Handle the native remove from map function
    map.removeLayer(this._layer);
  },

  updateLegend: function(legend) {
    const scale = this._scale;
    const max = this._max;
    const max_radius = this.options.max_radius;
    const property = this.options.property;
    const fill = this.options.style.legendColor;
    const opacity = this.options.style.opacity;
    const fill_scale = false;

    const normal = scaleLinear()
     .domain([0,max])
     .range([0, 1]);

    if (this.options.scale) {
      fill_scale = chroma.scale(this.options.scale);
    }

    legend.update(property, max, max_radius, scale, normal, fill_scale, fill, opacity);
  },

  _createLayer: function() {
    const max = this.options.max_amount || this._getMax(this._geojson);

    // Caluclate the minimum and maximum radius from the max area
    // TODO: how to handle zero and negative values
    const min_area = Math.PI * 3 * 3;
    const max_area = Math.PI * this.options.max_radius * this.options.max_radius;

    // Scale by the maxium value in the dataset
    const scale = scaleLinear()
      .domain([0, max])
      .range([min_area, max_area]);

    // Normalized scale between [0, 1]
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
    const pointToLayer = (feature, latlng) => this._pointToLayer.call(this, feature, latlng, style, property, fill_scale);

    return new L.geoJson(this._geojson, {
      pointToLayer: pointToLayer,
      onEachFeature: onEachFeature,
    });
  },

  _getMax : function() {
    const features = this._geojson.features;
    const property = this.options.property;

    let max = 0;

    for (let i = 0; i < features.length; i++) {
      if (features[i].properties[property] > max) {
        max = features[i].properties[property];
      }
    }

    return max;
  },

  _pointToLayer: function(feature, latlng, style, property, fill_scale) {
    let total = +feature.properties[property];

    if (isNaN(total)) {
      total = 0;
    }

    // Calculate the area of the bubble based on the property total and the resulting radius
    const area = this._scale(total);
    const radius = Math.sqrt(area / Math.PI);
    style.radius = radius;

    // If the option include a scale, use it
    if (fill_scale) { 
      style.fillColor = fill_scale(normal(total));
    }

    style.color = chroma(style.fillColor).darken().hex();

    // Create the circleMarker object
    return L.circleMarker(latlng, style);
  },

  _hasRequiredProp: function(property) {
    const features = this._geojson.features;
    const valid = true;

    for (let i = 0; i < features.length; i++) {
      if (features[i].properties.hasOwnProperty(property) !== true) {
        valid = false;
      }
    }

    return valid;
  },

  _onEachFeature: function(feature, layer) {
    const highlightFeature = this._highlightFeature.bind(this);
    const resetHighlight = this._resetHighlight.bind(this);

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  },

  _highlightFeature: function(event) {
    const layer = event.target;

    layer.setStyle({
      weight: 3,
      color: '#f5f5f5',
      fillOpacity: 1,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    this.fire('bubble-hover', { payload: layer.feature.properties }, true);
  },

  _resetHighlight: function(event) {
    this._layer.resetStyle(event.target);

    this.fire('bubble-hover', { payload: null }, true);
  },
});

export const bubbleLayer = (geojson, options) => new L.BubbleLayer(geojson, options);
