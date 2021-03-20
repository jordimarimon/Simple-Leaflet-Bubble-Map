import * as _chroma from 'chroma-js';

const chroma = _chroma.default;

L.Control.LegendControl = L.Control.extend({

    initialize: function(options) {
        L.setOptions(this, options);
    },

    onAdd: function(map) {
        this._div = L.DomUtil.create('div', 'info legend');

        return this._div;
    },
  
    onRemove: function(map) {
        if (this._div) {
            this._div.remove();
        }
    },
  
    update: function(property, max, max_radius, scale, normal, fill_scale, fill, opacity) {
        this._div.innerHTML = '<strong>' + property + '</strong><br/>';

        for (let i = 3; i > 0; i--) {
            const area = scale(max / i / 2);
            const radius = Math.sqrt(area / Math.PI);
            const item = L.DomUtil.create('div', 'bubble');
    
            // If theres a color scale, use it
            if (fill_scale) { 
                fill = fill_scale(normal(max / i));
            }
    
            item.innerHTML = '<svg height="' + (max_radius * 2)  +'" width="' + (max_radius * 2 - (max_radius / 2)) + '">' +
              '<circle cx="' + (radius + 1) + '" cy="' + max_radius + '" r="' + radius + '" stroke="' + chroma(fill).darken().hex() + '" stroke-width="1" opacity="' + opacity +'" fill="' + fill +'" />' +
               '<text font-size="11" text-anchor="middle" x="' + (radius) + '" y="' + (max_radius * 2) + '" fill="#AAA">' + Math.round(max / i)  + '</text>' +
            '</svg>';
    
            item.style = 'width: ' + radius + ';';

            this._div.appendChild(item);
          }
    }
  });
  
  export const legendControl = (props) => new L.Control.LegendControl(props);