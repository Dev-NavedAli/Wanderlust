var map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets/style.json?key=2tOsR36f6L1ZrLKWUy8q', // stylesheet location
    center: coordinates, // starting position [lng, lat]
    zoom: 8// starting zoom
  });
  
  const marker = new maplibregl.Marker({color: "red"})
          .setLngLat(coordinates)
          .setPopup(new maplibregl.Popup({offset: 25})
          .setHTML(`<h4>${locate}</h4><p>Exact location provided after booking</p>`))
          .addTo(map);