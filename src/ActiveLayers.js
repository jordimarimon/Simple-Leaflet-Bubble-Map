L.Control.ActiveLayers = L.Control.Layers.extend({

  /**
   * Get currently active base layer on the map
   * @return {Object} l where l.name - layer name on the control,
   *  l.layer is L.TileLayer, l.overlay is overlay layer.
   */
  getActiveBaseLayer: function () {
    return this._activeBaseLayer;
  },

  /**
   * Get currently active overlay layers on the map
   * @return {{layerId: l}} where layerId is <code>L.stamp(l.layer)</code>
   *  and l @see #getActiveBaseLayer jsdoc.
   */
  getActiveOverlayLayers: function () {
    return this._activeOverlayLayers;
  },

  onChange: function (cb) {
    this._cb = cb;
  },

  onAdd: function (map) {
    const container = L.Control.Layers.prototype.onAdd.call(this, map);

    if (Array.isArray(this._layers)) {
      this._activeBaseLayer = this._findActiveBaseLayer();
      this._activeOverlayLayers = this._findActiveOverlayLayers();
    } else {
      this._activeBaseLayer = this._findActiveBaseLayerLegacy();
      this._activeOverlayLayers = this._findActiveOverlayLayersLegacy();
    }

    return container
  },

  _findActiveBaseLayer: function () {
    const layers = this._layers;

    for (var i = 0; i < layers.length; i++) {
      const layer = layers[i];

      if (!layer.overlay && this._map.hasLayer(layer.layer)) {
        return layer;
      }
    }

    throw new Error('Control doesn\'t have any active base layer!');
  },

  _findActiveOverlayLayers: function () {
    const result = {};
    const layers = this._layers;

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];

      if (layer.overlay && this._map.hasLayer(layer.layer)) {
        result[layer.layer._leaflet_id] = layer;
      }
    }

    return result;
  },

  /**
   * Legacy 0.7.x support methods
   */
  _findActiveBaseLayerLegacy: function () {
    const layers = this._layers;

    for (let layerId in layers) {
      if (this._layers.hasOwnProperty(layerId)) {
        const layer = layers[layerId];

        if (!layer.overlay && this._map.hasLayer(layer.layer)) {
          return layer;
        }
      }
    }

    throw new Error('Control doesn\'t have any active base layer!');
  },

  _findActiveOverlayLayersLegacy: function () {
    const result = {};
    const layers = this._layers;

    for (let layerId in layers) {
      if (this._layers.hasOwnProperty(layerId)) {
        const layer = layers[layerId];

        if (layer.overlay && this._map.hasLayer(layer.layer)) {
          result[layerId] = layer;
        }
      }
    }

    return result;
  },

  _onLayerChange: function () {
    L.Control.Layers.prototype._onLayerChange.apply(this, arguments);

    this._recountLayers();

    if (this._cb !== undefined) {
      this._cb();
    }
  },

  _onInputClick: function () {
    this._handlingClick = true;

    this._recountLayers();

    L.Control.Layers.prototype._onInputClick.call(this);

    this._handlingClick = false;
  },

  _recountLayers: function () {
    let i, input, obj,
      inputs = this._layerControlInputs,
      inputsLen = inputs.length;

    for (let i = 0; i < inputsLen; i++) {
      input = inputs[i];

      if (Array.isArray(this._layers)) {
        obj = this._layers[i];
      } else {
        obj = this._layers[input.layerId];
      }

      if (input.checked && !this._map.hasLayer(obj.layer)) {
        if (obj.overlay) {
          this._activeOverlayLayers[input.layerId] = obj;
        } else {
          this._activeBaseLayer = obj;
        }
      } else if (!input.checked && this._map.hasLayer(obj.layer)) {
        if (obj.overlay) {
          delete this._activeOverlayLayers[input.layerId];
        }
      }
    }
  }
});

export const activeLayers = (baseLayers, overlays, options) => {
  return new L.Control.ActiveLayers(baseLayers, overlays, options);
};