// Leaflet JS

const center_x = 117.3;
const center_y = 172.8;
const scale_x = 0.02072;
const scale_y = 0.0205;

const CUSTOM_CRS = L.extend({}, L.CRS.Simple, {
  projection: L.Projection.LonLat,
  scale: function (zoom) {
    return Math.pow(2, zoom);
  },
  zoom: function (sc) {
    return Math.log(sc) / 0.6931471805599453;
  },
  distance: function (pos1, pos2) {
    var x_difference = pos2.lng - pos1.lng;
    var y_difference = pos2.lat - pos1.lat;
    return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
  },
  transformation: new L.Transformation(scale_x, center_x, -scale_y, center_y),
  infinite: true,
});

var SateliteStyle = L.tileLayer("mapStyles/styleSatelite/{z}/{x}/{y}.jpg", {
  minZoom: 0,
  maxZoom: 8,
  noWrap: true,
  continuousWorld: false,
  attribution: "Self-driving-car-Project",
  id: "SateliteStyle map",
});

var AtlasStyle = L.tileLayer("mapStyles/styleAtlas/{z}/{x}/{y}.jpg", {
  minZoom: 0,
  maxZoom: 5,
  noWrap: true,
  continuousWorld: false,
  attribution: "Self-driving-car-Project",
  id: "styleAtlas map",
});

var ExampleGroup = L.layerGroup();

var Icons = {
  Example: ExampleGroup,
};

var mymap = L.map("map", {
  crs: CUSTOM_CRS,
  minZoom: 3.5,
  maxZoom: 4.5,
  Zoom: 8,
  maxNativeZoom: 4.5,
  preferCanvas: true,
  layers: [AtlasStyle, Icons["Example"]], // Change the order to make AtlasStyle the default
  center: [0, 0],
  zoom: 4.5,
  scrollWheelZoom: true,
  zoomControl: false, // Remove zoom control
  attributionControl: false,
  updateWhenIdle: true,
});

var layersControl = L.control
  .layers({
    Atlas: AtlasStyle,
    Satelite: SateliteStyle,
  })
  .addTo(mymap);

var icon1 = L.icon({
  iconUrl: "./blips/3.png",
  iconSize: [38, 40],
  iconAnchor: [20, 35],
});

var icon2 = L.icon({
  iconUrl: "./blips/1.png",
  iconSize: [45, 40],
  iconAnchor: [20, 38],
});

var marker1 = L.marker(null, { icon: icon1 });
var marker2 = L.marker(null, { icon: icon2 });

mymap.on("click", function (e) {
  var newLatLng = new L.LatLng(e.latlng.lat, e.latlng.lng);
  marker1.setLatLng(newLatLng).addTo(mymap);
  var data = { lat: e.latlng.lat, lng: e.latlng.lng };

  console.log("Emitting marker1 data:", data);

  socket.emit("from_client_a_to_c", data);
});

var isTracking = false;
var locationButton = document.getElementById("locationButton");

locationButton.addEventListener("click", function () {
  isTracking = !isTracking;
  if (isTracking) {
    locationButton.classList.add("location-button-clicked");
    locationButton.classList.remove("location-button-unclicked");
  } else {
    locationButton.classList.remove("location-button-clicked");
    locationButton.classList.add("location-button-unclicked");
  }
});

marker2.on("move", function () {
  if (isTracking) {
    mymap.setView(marker2.getLatLng());
  }
});

socket.on("to_client_a", function (data) {
  console.log(`Received from B: ${JSON.stringify(data)}`);

  var dt = JSON.stringify(data);
  var newLatLng = new L.LatLng(data.Y, data.X);

  marker2.setLatLng(newLatLng).addTo(mymap);

  var marker1LatLng = marker1.getLatLng();
  var marker2LatLng = marker2.getLatLng();

  var distance = Math.sqrt(
    Math.pow(marker2LatLng.lat - marker1LatLng.lat, 2) +
      Math.pow(marker2LatLng.lng - marker1LatLng.lng, 2)
  );

  let dialogbox = document.getElementById("dialog-box");
  let timerBar = document.getElementById("timer-bar");

  console.log("Distance:", distance);
  if (distance <= 30) {
    mymap.removeLayer(marker1);
    dialogbox.classList.remove("display-box");
    dialogbox.classList.add("display-box");

    setTimeout(function () {
      dialogbox.classList.remove("display-box");
      dialogbox.classList.add("hidden-box");
      timerBar.style.width = "0";
    }, 4000);
    timerBar.classList.add("animate");
  }
  console.log("Received marker2 data:", dt);
});
