


var markers = [];
var map;
var city = 'London';
var cityLoc = {lat: 51.507351, lng: -0.127758};

$("#city-form").on("click", function() {
  event.preventDefault();
  var city = $("#city-search").val();

});



function initMap() {
  console.log(cityLoc)
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: cityLoc,
    disableDefaultUI: true
  });


   var pos = cityLoc
   placeMarker(pos);
   autoComplete();
}

function autoComplete(){
  var autoComplete = new google.maps.places.Autocomplete(   
  document.getElementById("city-search"), {
    types: ['(cities)']
  });

  google.maps.event.addListener(autoComplete, 'place_changed', function() {
    var place = autoComplete.getPlace();
    if (place.geometry) {
       map.panTo(place.geometry.location);
       map.setZoom(15);
    } 
  });


}





function placeMarker(pos){
  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: 'Hello World!'
  });
}


// function drop() {
//   clearMarkers();
//   for (var i = 0; i < autoComplete.length; i++) {
//     addMarkerWithTimeout(autoComplete[i], i * 200);
//   }
// }

// function addMarkerWithTimeout(position, timeout) {
//   window.setTimeout(function() {
//     markers.push(new google.maps.Marker({
//       position: cityLoc,
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



