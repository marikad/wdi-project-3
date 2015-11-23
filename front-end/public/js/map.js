// If you're adding a number of markers, you may want to drop them on the map
// consecutively rather than all at once. This example shows how to use
// window.setTimeout() to space your markers' animation.

var markers = [];
var map;
var city = 'London';
var cityLoc = {lat: 51.507351, lng: -0.127758};

$("#city-form").on("click", function() {
  event.preventDefault();
  var city = $("#city-search").val();

  for(var i = 0; i < uk.length; i++){
    if(uk[i].name === city) {
      console.log("Match found", city)
      var lat = uk[i].lat;
      var lng = uk[i].lng;
      cityLoc = {lat: lat, lng: lng};
      console.log(cityLoc)
    };
  };
  initMap()
});



function initMap() {
  console.log(cityLoc)
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: cityLoc
  });
   var pos = {lat: 51.507351, lng: -0.127758}
   placeMarker(pos);
   styleMap()
}

function placeMarker(pos){
  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: 'Hello World!'
  });
}

function styleMap(){
  var styles = [
      {
        stylers: [
          { hue: "#00ffe6" },
          { saturation: -20 }
        ]
      },{
        featureType: "road",
        elementType: "geometry",
        stylers: [
          { lightness: 100 },
          { visibility: "simplified" }
        ]
      },{
        featureType: "road",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ];

     // as well as the name to be displayed on the map type control.
      var styledMap = new google.maps.StyledMapType(styles,
        {name: "Styled Map"});

      // Create a map object, and include the MapTypeId to add
      // to the map type control.
      var mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng( cityLoc.lat, cityLoc.lng),
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
      };
      var map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

      //Associate the styled map with the MapTypeId and set it to display.
      map.mapTypes.set('map_style', styledMap);
      map.setMapTypeId('map_style');
    }



// function drop() {
//   clearMarkers();
//   for (var i = 0; i < cities.length; i++) {
//     addMarkerWithTimeout(cities[i], i * 200);
//   }
// }

// function addMarkerWithTimeout(position, timeout) {
//   window.setTimeout(function() {
//     markers.push(new google.maps.Marker({
//       position: {lat: 51.507351, lng: -0.127758},
//       map: map,
//       animation: google.maps.Animation.DROP
//     }));
//   }, timeout);
// }

// function clearMarkers() {
//   for (var i = 0; i < markers.length; i++) {
//     markers[i].setMap(null);
//   }
//   markers = [];
// }

