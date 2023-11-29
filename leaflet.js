const center_x = 117.3;
const center_y = 172.8;
const scale_x = 0.02072;
const scale_y = 0.0205;

CUSTOM_CRS = L.extend({}, L.CRS.Simple, {
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
var GridStyle = L.tileLayer("mapStyles/styleGrid/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 5,
  noWrap: true,
  continuousWorld: false,
  attribution: "Self-driving-car-Project",
  id: "styleGrid map",
});

var ExampleGroup = L.layerGroup();

var Icons = {
  Example: ExampleGroup,
};

var mymap = L.map("map", {
  crs: CUSTOM_CRS,
  minZoom: 4.5,
  maxZoom: 4.5,
  Zoom: 4.5,
  maxNativeZoom: 4.5,
  preferCanvas: true,
  layers: [SateliteStyle, Icons["Example"]],
  center: [0, 0],
  zoom: 4.5,
  scrollWheelZoom: false,
});

var layersControl = L.control
  .layers({
    Satelite: SateliteStyle,
    Atlas: AtlasStyle,
    Grid: GridStyle,
  })
  .addTo(mymap);

function customIcon() {
  return L.icon({
    iconUrl: "./blips/1.png",
    iconSize: [55, 55],
    iconAnchor: [30, 45],
    popupAnchor: [0, -30],
  });
}

var marker;
mymap.on("click", function (e) {
  var coord = e.latlng;
  var lat = coord.lat;
  var lng = coord.lng;

  // Clear existing markers in ExampleGroup
  ExampleGroup.clearLayers();

  // Add a new marker
  var marker = L.marker([lat, lng], { icon: customIcon() })
    .addTo(ExampleGroup)
    .bindPopup("<b>X: " + lng.toFixed(3) + " | Y: " + lat.toFixed(3) + "</b>");
});

// Event handler for form submission
$("#formular").submit(function (event) {
  event.preventDefault();
  if ($.trim($("#xinput").val()) === "" || $.trim($("#yinput").val()) === "") {
    alert("Please fill X and Y coords");
    return false;
  }

  var xpoz = $("#xinput").val();
  var ypoz = $("#yinput").val();

  // Clear existing markers in ExampleGroup
  ExampleGroup.clearLayers();

  // Add a new marker
  var azurirajmarker = L.marker([ypoz, xpoz], { icon: customIcon() })
    .addTo(ExampleGroup)
    .bindPopup("<b>X: " + xpoz + " | Y: " + ypoz + "</b>");

  mymap.setView([ypoz, xpoz], mymap.getZoom());
  $("#markerSkripta")
    .empty()
    .append("<script>" + azurirajmarker + "</script>");
});
