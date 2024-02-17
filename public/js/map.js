mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: 'map',   //constainer ID
center: [79.4304, 28.3670], //starting position [lng,lat]
zoom: 12  //starting zoom
});