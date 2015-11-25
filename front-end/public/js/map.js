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

function getEvents() {
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/api/events'
  }).done(function(data) {
    return seedPins(data);
  }).fail(function(data){
    console.log('Could not get events.');
  });
}

function seedPins(data) {
  var geocoder = new google.maps.Geocoder();
  $.each(data.events, function(index, event) {
    var address = event.location;
    geocodeAddress(address, geocoder);
  });

};

function initMap() {
  console.log(cityLoc)
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: cityLoc,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

   var pos = cityLoc;

   placeMarker();
   autoComplete();
   styleMap();
   getEvents();

   var geocoder = new google.maps.Geocoder();

   document.getElementById('submit').addEventListener('click', function() {
    event.preventDefault();
    var address = document.getElementById('address').value;
     geocodeAddress(address, geocoder, map);
   });
};

function geocodeAddress(address, geocoder) {
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var latLngObj = results[0]["geometry"]["location"];
         console.log(latLngObj);

      placeMarker(latLngObj);

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    };
  });
};


function placeMarker(pos){
  var marker = new google.maps.Marker({
    position: pos,
    map: map,
  });
};

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
    };
  });
};

function styleMap(){
  var customMapType = new google.maps.StyledMapType([
     {
             "featureType": "all",
             "elementType": "labels.text.fill",
             "stylers": [
                 {
                     "saturation": 36
                 },
                 {
                     "color": "#000000"
                 },
                 {
                     "lightness": 40
                 }
             ]
         },
   {
          "featureType": "all",
          "elementType": "labels.text.stroke",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "color": "#000000"
              },
              {
                  "lightness": 16
              }
          ]
      },
    {
           "featureType": "all",
           "elementType": "labels.icon",
           "stylers": [
               {
                   "visibility": "off"
               }
           ]
       },

      {
             "featureType": "administrative",
             "elementType": "geometry.fill",
             "stylers": [
                 {
                     "color": "#000000"
                 },
                 {
                     "lightness": 20
                 }
             ]
         },

         {
               "featureType": "administrative",
               "elementType": "geometry.stroke",
               "stylers": [
                   {
                       "color": "#000000"
                   },
                   {
                       "lightness": 17
                   },
                   {
                       "weight": 1.2
                   }
               ]
           },

            {
                 "featureType": "landscape",
                 "elementType": "geometry",
                 "stylers": [
                     {
                         "color": "#000000"
                     },
                     {
                         "lightness": 20
                     }
                 ]
             },
              {
                      "featureType": "poi",
                      "elementType": "geometry",
                      "stylers": [
                          {
                              "color": "#000000"
                          },
                          {
                              "lightness": 21
                          }
                      ]
                  },

              {
                      "featureType": "road.highway",
                      "elementType": "geometry.fill",
                      "stylers": [
                          {
                              "color": "#000000"
                          },
                          {
                              "lightness": 17
                          }
                      ]
                  },
                  {
                          "featureType": "road.highway",
                          "elementType": "geometry.stroke",
                          "stylers": [
                              {
                                  "color": "#000000"
                              },
                              {
                                  "lightness": 29
                              },
                              {
                                  "weight": 0.2
                              }
                          ]
                      },
                      {
                             "featureType": "road.arterial",
                             "elementType": "geometry",
                             "stylers": [
                                 {
                                     "color": "#000000"
                                 },
                                 {
                                     "lightness": 18
                                 }
                             ]
                         },
                         {
                               "featureType": "road.local",
                               "elementType": "geometry",
                               "stylers": [
                                   {
                                       "color": "#000000"
                                   },
                                   {
                                       "lightness": 16
                                   }
                               ]
                           },
                           {
                                 "featureType": "transit",
                                 "elementType": "geometry",
                                 "stylers": [
                                     {
                                         "color": "#000000"
                                     },
                                     {
                                         "lightness": 19
                                     }
                                 ]
                             },
                             {
                                     "featureType": "water",
                                     "elementType": "geometry",
                                     "stylers": [
                                         {
                                             "color": "#000000"
                                         },
                                         {
                                             "lightness": 17
                                         }
                                     ]
                                 }

    ], {
      name: 'Custom Style'
  });
  var customMapTypeId = 'custom_style';

  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);
};

