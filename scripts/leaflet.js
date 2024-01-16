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
});

var layersControl = L.control
  .layers({
    Atlas: AtlasStyle,
    Satelite: SateliteStyle,
  })
  .addTo(mymap);

function customIconOrigin() {
  return L.icon({
    iconUrl: "./blips/1.png",
    iconSize: [40, 35],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30],
  });
}

function customIconDestination() {
  return L.icon({
    iconUrl: "./blips/3.png",
    iconSize: [50, 50],
    iconAnchor: [30, 45],
    popupAnchor: [0, -30],
  });
}

// MAP 1 Marker
var marker1;
mymap.on("click", function (e) {
  var coord = e.latlng;
  var lat = coord.lat;
  var lng = coord.lng;

  ExampleGroup.clearLayers();

  marker1 = L.marker([lat, lng], { icon: customIconOrigin() })
    .addTo(ExampleGroup)
    .bindPopup("<b>X: " + lng.toFixed(3) + " | Y: " + lat.toFixed(3) + "</b>");
});

// MAP 2 Marker
var marker2;

mymap.on("dblclick", function (e) {
  var coord = e.latlng;
  var lat = coord.lat;
  var lng = coord.lng;

  ExampleGroup.clearLayers();

  marker2 = L.marker([lat, lng], { icon: customIconDestination() })
    .addTo(ExampleGroup)
    .bindPopup("<b>X: " + lng.toFixed(3) + " | Y: " + lat.toFixed(3) + "</b>");
});
