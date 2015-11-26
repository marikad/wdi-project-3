var markers = [];
var map;
var bounds;
var infowindow = null;
var city = 'London';
var cityLoc = {lat: 51.507351, lng: -0.127758};
var markerImages = {
  "Javascript": "../public/assets/map-marker-neon-green.png",
  "Python": "../public/assets/map-marker-neon-green.png",
  "Hackathon": "../public/assets/map-marker-neon-green.png",
  undefined:"../public/assets/map-marker-neon-green.png"
}
// iconImage();

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
};

function seedPins(data) {
  var geocoder = new google.maps.Geocoder();
  $.each(data.events, function(index, event) {
    var eventTime = Date.parse(event.date)
    var now = Date.now()

    if (eventTime > now) {
      geocodeAddress(event, geocoder);
    };
  });
};

function ToggleMenu(menuToggleDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'rgba(255,255,255,.1)';
  controlUI.style.border = '2px solid rgba(0,0,0,.7)';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to toggle the menu';
  menuToggleDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgba(255,255,255, 0.7)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Toggle Menu';
  controlUI.appendChild(controlText);

  // Setup the click event listener
  controlUI.addEventListener('click', function() {
    console.log('clicked')
    event.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });
};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: cityLoc,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  var menuToggleDiv = document.createElement('div');
  var menuControl = new ToggleMenu(menuToggleDiv, map);

  menuToggleDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(menuToggleDiv);

  var pos = cityLoc;

  autoComplete();
  styleMap();
  getEvents();

  var geocoder = new google.maps.Geocoder();

  document.getElementById('event-submit').addEventListener('click', function() {
    event.preventDefault();

    var elements = document.getElementsByName('category');
    var category = 'none';
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].checked) category = elements[i].value;
    };

    var eventObj = {
      title: document.getElementById('event-title').value,
      description: document.getElementById('event-description').value,
      location: document.getElementById('event-location').value,
      date: document.getElementById('event-date').value,
      time: document.getElementById('event-time').value,
      category: category,
      image: document.getElementById('event-image').value
    };

    geocodeAddress(eventObj, geocoder);

    $.ajax({
  		method: 'post',
  		url: 'http://localhost:3000/api/events/new',
  		data: eventObj,
  		beforeSend: setRequestHeader,
  	}).done(function(data) {
  		return console.log('New event added to database!');
  	}).fail(function(data){
  		displayErrors(data.responseJSON.message);
  	});
  });
};

function geocodeAddress(eventObj, geocoder) {
  geocoder.geocode({'address': eventObj.location}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var latLngObj = results[0]["geometry"]["location"];
      placeMarker(latLngObj, eventObj);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    };
  });
};

function placeMarker(pos, eventObj){
  // var iconImage = eventObj.category;
  // icon: markerImages[eventObj.category]
  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    animation: google.maps.Animation.DROP,
    icon: '../public/assets/map-marker-neon-green.png',
    category: eventObj.category
  });

  markers.push(marker);

  google.maps.event.addListener(marker, "click", function(event) {
    console.log("CLICKED")
    markerClick(marker, eventObj);
  });

  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });

   google.maps.event.addListener(map, "click", function(event) {
     infoWindow.close();
   });
};

function markerClick(marker, eventObj){
  console.log(marker)
  console.log(eventObj)
  if (infowindow) infowindow.close();

  var contentString = '<div id="content">'+
  '<div id="siteNotice">'+
  '</div>'+
  '<h1 id="firstHeading" class="firstHeading">' + eventObj.title + '</h1>'+
  '<div id="bodyContent">'+
  '<img src="' + eventObj.image + '">'+
  '<p>' + eventObj.description + '</p>'+
  '<p><strong>Date:</strong> ' + eventObj.date + '</p>'+
  '<p><strong>Start Time:</strong> ' + eventObj.time + '</p>'+
  '<p><strong>Category:</strong> ' + eventObj.category + '</p>'+
  "<button>Edit</button>" +
  '</div>'+
  '</div>';

  infowindow = new google.maps.InfoWindow({
   content: contentString
 });

  map.setCenter(marker.getPosition());
  infowindow.open(map, marker);
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
     map.setZoom(11);
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
