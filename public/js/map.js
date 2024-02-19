mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: 'map',   //constainer ID
style:"mapbox://styles/mapbox/streets-v12",
center: coordinates, //starting position [lng,lat]
zoom: 9  //starting zoom
});

const marker1 = new mapboxgl.Marker({color:'red'})
.setLngLat(coordinates)  //listing.geometry.coordinates ko direct access nhi krskte bcz ye public file hai thatswhy we r using ejs
.addTo(map);