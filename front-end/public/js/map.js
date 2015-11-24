


var markers = [];
var map;
var bounds;
var infoBox;
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
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });


   var pos = cityLoc
   placeMarker(pos);
   autoComplete();

   var geocoder = new google.maps.Geocoder();

     document.getElementById('submit').addEventListener('click', function() {
      event.preventDefault();
       geocodeAddress(geocoder, map);
     });

     // google.maps.event.addListener (marker, 'dragend', function (event) 
     // {
     //     var point = marker.getPosition();
     //     map.panTo(point);

     //     // save location to local storage
     //     localStorage['lastLat'] = point.lat();
     //     localStorage['lastLng'] = point.lng();
     // });


}

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    for (i = 0; i < address.length; i++) {
      address.save
    }
    if (status === google.maps.GeocoderStatus.OK) {
      var latLngObj = results[0]["geometry"]["location"];
         console.log(latLngObj);
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: latLngObj
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

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



