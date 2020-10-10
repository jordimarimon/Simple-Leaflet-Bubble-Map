import 'leaflet';
import 'leaflet.fullscreen';
import '@geoman-io/leaflet-geoman-free';

import { bubbleLayer } from './bubble-layer';
import { infoControl } from './info-control';

import * as geoJson_1400_1410 from '../data/db_1400_1410';
import * as geoJson_1425_1435 from '../data/db_1425_1435';
import * as geoJson_1450_1460 from '../data/db_1450_1460';

///////////////////////////////////////////////////////////
// Map Instance
///////////////////////////////////////////////////////////
const map = L.map('map', {
	center: [43.771389, 11.254167],
	zoom: 3,
	fullscreenControl: true,
});

///////////////////////////////////////////////////////////
// Base Layers
///////////////////////////////////////////////////////////
const Jawg_Terrain = L.tileLayer('https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 18,
	subdomains: 'abcd',
	accessToken: __env.JAWG_TOKEN,
}).addTo(map);

const Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
	maxZoom: 18
});

const baseMaps = {
	'JAWG Terrain': Jawg_Terrain,
	'ESRI Terrain': Esri_WorldTerrain,
};

///////////////////////////////////////////////////////////
// Geoman Control
///////////////////////////////////////////////////////////
map.pm.addControls({position: 'topleft'});

///////////////////////////////////////////////////////////
// Bubble layers
///////////////////////////////////////////////////////////
const bubbles_1400_1410 = bubbleLayer(
	geoJson_1400_1410.default,
	{ property: "amount", style: { fillColor: '#e88484' } },
).addTo(map);

const bubbles_1425_1435 = bubbleLayer(
	geoJson_1425_1435.default,
	{ property: "amount", style: { fillColor: '#b145f5' } },
);

const bubbles_1450_1460 = bubbleLayer(
	geoJson_1450_1460.default,
	{ property: "amount", style: { fillColor: '#74acb8' } },
);

const overlayMaps = {
	'1400-1410': bubbles_1400_1410,
	'1425-1435': bubbles_1425_1435,
	'1450-1460': bubbles_1450_1460,
};

///////////////////////////////////////////////////////////
// Add layers
///////////////////////////////////////////////////////////
L.control.layers(baseMaps, overlayMaps).addTo(map);

///////////////////////////////////////////////////////////
// Info Control
///////////////////////////////////////////////////////////
const info = infoControl().addTo(map);

bubbles_1400_1410.on('bubble-hover', (event) => {
	info.update(event.payload);
});

bubbles_1425_1435.on('bubble-hover', (event) => {
	info.update(event.payload);
});

bubbles_1450_1460.on('bubble-hover', (event) => {
	info.update(event.payload);
});
