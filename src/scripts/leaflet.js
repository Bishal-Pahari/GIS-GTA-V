const socket = io.connect("http://192.168.1.83:8000");

socket.on("connect", () => {
  console.log("Connected to the Socket.IO server");
});

socket.on("connect_error", (error) => {
  console.error("Error connecting to the Socket.IO server:", error.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from the Socket.IO server");
});

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
    let x_difference = pos2.lng - pos1.lng;
    let y_difference = pos2.lat - pos1.lat;
    return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
  },
  transformation: new L.Transformation(scale_x, center_x, -scale_y, center_y),
  infinite: true,
});

let SateliteStyle = L.tileLayer("mapStyles/styleSatelite/{z}/{x}/{y}.jpg", {
  minZoom: 0,
  maxZoom: 8,
  noWrap: true,
  continuousWorld: false,
  attribution: "Self-driving-car-Project",
  id: "SateliteStyle map",
});

let AtlasStyle = L.tileLayer("mapStyles/styleAtlas/{z}/{x}/{y}.jpg", {
  minZoom: 0,
  maxZoom: 5,
  noWrap: true,
  continuousWorld: false,
  attribution: "Self-driving-car-Project",
  id: "styleAtlas map",
});

let ExampleGroup = L.layerGroup();

let Icons = {
  Example: ExampleGroup,
};

let mymap = L.map("map", {
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

let icon2 = L.icon({
  iconUrl: "./blips/1.png",
  iconSize: [45, 40],
  iconAnchor: [20, 38],
});

let marker1 = L.marker(null, { icon: icon1 });
let marker2 = L.marker(null, { icon: icon2 });

mymap.on("click", function (e) {
  let newLatLng = new L.LatLng(e.latlng.lat, e.latlng.lng);
  marker1.setLatLng(newLatLng).addTo(mymap);
  let data = { lat: e.latlng.lat, lng: e.latlng.lng };

  console.log("Emitting marker1 data:", data);

  socket.emit("from_client_a_to_c", data);
});

let isTracking = false;
let locationButton = document.getElementById("locationButton");

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

  let dt = JSON.stringify(data);
  let newLatLng = new L.LatLng(data.Y, data.X);

  marker2.setLatLng(newLatLng).addTo(mymap);

  let marker1LatLng = marker1.getLatLng();
  let marker2LatLng = marker2.getLatLng();

  let distance = Math.sqrt(
    Math.pow(marker2LatLng.lat - marker1LatLng.lat, 2) +
      Math.pow(marker2LatLng.lng - marker1LatLng.lng, 2)
  );

  let dialogbox = document.getElementById("dialog-box");
  let timerBar = document.getElementById("timer-bar");

  console.log("Distance:", distance);
  if (distance <= 30) {
    mymap.removeLayer(marker1);

    dialogbox.classList.remove("hidden-box");
    dialogbox.classList.add("display-box");
    timerBar.style.width = "0";
    timerBar.classList.add("animate");
  } else if (distance > 30) {
    mymap.addLayer(marker1);
    dialogbox.classList.remove("display-box");
    dialogbox.classList.add("hidden-box");
  }
  console.log("Received marker2 data:", dt);
});
