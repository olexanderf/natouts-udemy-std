/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);
mapboxgl.accessToken =
  'pk.eyJ1Ijoib2xla3NhbmRlcjA3IiwiYSI6ImNscmk5aGEzZjAzOHkybHA5cnRwMmlneGEifQ.DBKgEJi-AM-uVxbtW22bdw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/oleksander07/clrib6zaq00mj01pddyfa9a0x',
  scrollZoom: false
  //   center: [-118.113491, 34.111745],
  //   zoom: 10
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);
  // Add popup

  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
});
