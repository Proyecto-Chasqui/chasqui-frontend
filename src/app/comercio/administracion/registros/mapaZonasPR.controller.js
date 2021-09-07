angular.module('chasqui').controller('MapWebZonaPRController', MapWebZonaPRController);

function MapWebZonaPRController(contextPurchaseService, MapDraw, MapUI ,MapREST, MapGeoJsonDecode, $scope, 
  $rootScope, $log, $q, leafletData, ToastCommons, $mdDialog, $mdSidenav, contextCatalogObserver, deliveryPointsService) {
  /*-------------------------------
    *------Variables Gobales--------
    *------------------------------*/

    var vmap;
    $scope.mostrarDia = true;
    $scope.nombre = "N/D";
    $scope.descripcion = "N/D";
    $scope.day = "N/D";
    $scope.direccion = "N/D";
    $scope.mostrarDireccionPR = false;
    var posicionMapaPredeterminado = [-34.602581, -58.441341];

    var normalIcon = L.icon({
      iconUrl: './assets/images/commerce51.png',

      iconSize: [51, 51],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50]
    });

  var markedIcon = L.icon({
    iconUrl: './assets/images/commerce51marked.png',

    iconSize: [51, 51],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  });

  var greenIcon = L.icon({
    iconUrl: './assets/images/map-marker-40-predet.png',

    iconSize: [51, 51],
    iconAnchor: [25, 50],
    popupAnchor: [24, -50]
  });

  /*--------------------------------------
    *------- Fin Variables Generales ------
    *-------------------------------------*/



  function buildTogglerOpen(componentId) {
      return function() {
        $mdSidenav(componentId).open();
      };
  }

    function buildTogglerClose(componentId) {
      return function() {
        $mdSidenav(componentId).close();
        MapDraw.resetStyleAllPolygons();
        MapDraw.resetAllMarkIconsTo(normalIcon);
      };
  }

  /*
    * Seccion de interaccion con el Mapa
    */
  //injecta la referencia del mapa
  leafletData.getMap("mapaZonasPR").then(function(map) {

    /*
      * Variables en contexto del mapa
      * y configuraciones.
      */
    vmap = map;
    var urlMapbox = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    //https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw
    
    L.tileLayer(urlMapbox, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11'
    }).addTo(map);
    var attribution = map.attributionControl;
    vmap.setView(posicionMapaPredeterminado);
    vmap.setZoom(9);
    //map.invalidateSize(false);
    attribution.setPosition('bottomleft');
    $scope.ayuda = "<h1>Mensaje de ayuda desde el controlador</h1>";
    $scope.toggleOpen= buildTogglerOpen('right');
    $scope.toggleClose = buildTogglerClose('right');
    /*
    * fin de variables en contexto de mapa
    * y configuraciones.
    */
    //envia la referencia del mapa a los servicios
    MapDraw.setMapForZones(vmap);
    MapDraw.sellerPointLayer(vmap);
    MapUI.setMap(vmap);
    MapDraw.setLayersControl();
  });

  function parseCoordinateToLatLngs(vcoordinates){
    var coordinates = [];
    if(vcoordinates !== null){
      var i = 0;
      for(i; i<vcoordinates.length; i++){
        var coordinate = vcoordinates[i];
        var lat = coordinate.x;
        var lng = coordinate.y;
        coordinates.push([lat,lng]);    		
      }
    }
    return coordinates;
  }

  function createText(data, polygon){
    $scope.toggleRight;
    var closeDate = new Date(data.fechaCierre);
    var day = "" + (closeDate.getDate()+1) +"/"+ (closeDate.getMonth()+1) +"/"+ closeDate.getFullYear(); 
    $scope.nombre = data.nombreZona;
    $scope.descripcion = data.mensaje;
    $scope.day = day;
    $scope.mostrarDia = true;
    $scope.mostrarDireccionPR = false;
    MapDraw.resetStyleAllPolygons();
    MapDraw.resetAllMarkIconsTo(normalIcon);
    polygon.setStyle({
      color: 'green'
    });

  }

  function createTextSP(data, rmarker){
    var direccion = data.direccion;
    $scope.toggleRight;
    $scope.nombre = data.nombre;
    $scope.descripcion = data.mensaje;
    $scope.day = "N/D";
    $scope.direccion = "" + direccion.calle + " " + direccion.localidad +" " +direccion.altura+ ", " + direccion.provincia +", " + direccion.pais;
    $scope.mostrarDia = false;
    $scope.mostrarDireccionPR = true;
    MapDraw.resetAllMarkIconsTo(normalIcon);
    MapDraw.setMarkerIcon(data.nombre,markedIcon);
    MapDraw.resetStyleAllPolygons();
  }

  function drawZonas(jsonText){
    var dataAll = JSON.parse(jsonText);
    var i = 0;
    var data = dataAll.data
    var lastCoordinates=[];
    for(i; i<data.length; i++){
      var coordinates =parseCoordinateToLatLngs(data[i].geometry.coordinates);
      var name = data[i].properties.nombreZona;
    MapDraw.drawPolygon(coordinates,name);
    MapUI.setClickeablePopUp(data[i].properties,MapDraw.getPolygon(name),createText,$scope.toggleOpen); 
    if(coordinates.length > 0){
      lastCoordinates = coordinates[0];
    }
    }
    if(lastCoordinates.length >0){
      vmap.setView(lastCoordinates);
      vmap.setZoom(10);
    }
  }

  function drawSP(response){
    var data = response.data.data;
    var i = 0;
    var lastCoordinatesSP = [];
    for(i; i<data.length; i++){
      var name = data[i].nombre;
      var latitud = data[i].direccion.latitud; 
      var longitud = data[i].direccion.longitud;
      var habilitado = data[i].habilitado;
      if(latitud !== null && longitud !== null && habilitado){
        MapDraw.setMarkerSPIn(name,latitud,longitud);
        MapDraw.setMarkerIcon(name,normalIcon);
      MapUI.setClickeablePopUp(data[i],MapDraw.getMarker(name),createTextSP,$scope.toggleOpen);
      lastCoordinatesSP= [latitud,longitud]; 
    }					
    }
    if(lastCoordinatesSP.length >0){
      vmap.setView(lastCoordinatesSP);
      vmap.setZoom(10);
    }
  }

  function mostrarZonas(catalog){
    MapREST.obtainAllZones(drawZonas,catalog.id);
  }

  function mostrarPuntosDeRetiro(catalog){
    deliveryPointsService.deliveryPoints(catalog.id).then(drawSP);
  }

  //workaround L.Icon.Default.imagePath
  function setdefaultimage(){
    L.Icon.Default.imagePath = '../bower_components/leaflet/dist/images/';
  }

  function init(){
    contextCatalogObserver.observe(function(){
      contextPurchaseService.getSelectedCatalog().then(function(catalog){
        setdefaultimage();
        mostrarZonas(catalog);
        mostrarPuntosDeRetiro(catalog);
      });
    })
  }

  init();
}
