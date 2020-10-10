import 'leaflet';
import 'leaflet.fullscreen';
import '@geoman-io/leaflet-geoman-free';
import './bubble-layer';

///////////////////////////////////////////////////////////
// Base Layers
///////////////////////////////////////////////////////////
const Jawg_Terrain = L.tileLayer('https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 18,
	subdomains: 'abcd',
	accessToken: __env.JAWG_TOKEN,
});

const Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
	maxZoom: 18
});

const baseMaps = {
	"JAWG Terrain": Jawg_Terrain,
	"ESRI Terrain": Esri_WorldTerrain,
};

///////////////////////////////////////////////////////////
// Map Instance
///////////////////////////////////////////////////////////
const map = L.map('map', {
	center: [43.771389, 11.254167],
	zoom: 3,
	fullscreenControl: true,
	layers: [Jawg_Terrain],
});

L.control.layers(baseMaps, {}).addTo(map);

///////////////////////////////////////////////////////////
// Geoman Control
///////////////////////////////////////////////////////////
map.pm.addControls({position: 'topleft'});

///////////////////////////////////////////////////////////
// Bubble layer
///////////////////////////////////////////////////////////



