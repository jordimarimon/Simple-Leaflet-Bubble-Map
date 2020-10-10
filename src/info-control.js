L.Control.InfoControl = L.Control.extend({
  onAdd: function(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
  },

  onRemove: function(map) {
    if (this._div) {
      this._div.remove();
    }
  },

  update: function(props) {
    if (props) {
      let html = '<h4>Info:</h4>';

      for (const key in props) {
        html += `<br /><b>${key}:</b> ${props[key]}`;
      }

      this._div.innerHTML = html;
    } else {
      this._div.innerHTML = 'Hover over a bubble';
    }
  }
});

export const infoControl = () => new L.Control.InfoControl();