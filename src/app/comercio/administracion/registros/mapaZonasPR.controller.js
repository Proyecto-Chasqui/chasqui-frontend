angular.module('chasqui').controller('MapWebZonaPRController', ['contextPurchaseService','MapDraw','MapUI', 'MapREST', 'MapGeoJsonDecode', '$scope', '$rootScope', '$log', '$q', 'leafletData', 'ToastCommons', '$mdDialog', '$mdSidenav',
  function(contextPurchaseService, MapDraw, MapUI ,MapREST, MapGeoJsonDecode, $scope, $rootScope, $log, $q, leafletData, ToastCommons, $mdDialog, $mdSidenav) {
    /*-------------------------------
     *------Variables Gobales--------
     *------------------------------*/

    var vm = this;
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
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
		}).addTo(map);
      attribution = map.attributionControl;
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
    	coordinates = [];
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
    	var data = JSON.parse(jsonText);
    	var i = 0;
    	for(i; i<data.length; i++){
    		var coordinates =parseCoordinateToLatLngs(data[i].geometry.coordinates);
    		var name = data[i].properties.nombreZona;
			MapDraw.drawPolygon(coordinates,name);
			MapUI.setClickeablePopUp(data[i].properties,MapDraw.getPolygon(name),createText,$scope.toggleOpen); 		
    	}
    }

    function drawSP(jsonText){
    	var data = JSON.parse(jsonText).puntosDeRetiro;
    	var i = 0;
    	for(i; i<data.length; i++){
    		var name = data[i].nombre;
    		var latitud = data[i].direccion.latitud; 
    		var longitud = data[i].direccion.longitud;
    		var habilitado = data[i].habilitado;
    		if(latitud !== null && longitud !== null && habilitado){
    			MapDraw.setMarkerSPIn(name,latitud,longitud);
    			MapDraw.setMarkerIcon(name,normalIcon);
				MapUI.setClickeablePopUp(data[i],MapDraw.getMarker(name),createTextSP,$scope.toggleOpen); 
			}		
    	}
    }

    function mostrarZonas(){
      	MapREST.obtainAllZones(drawZonas,contextPurchaseService.getCatalogContext());
    }

    function mostrarPuntosDeRetiro(){
    	MapREST.obtainAllSellerPoints(drawSP,contextPurchaseService.getCatalogContext());
    }

      //workaround L.Icon.Default.imagePath
      function setdefaultimage(){
       L.Icon.Default.imagePath = '../bower_components/leaflet/dist/images/';
      }

      setdefaultimage();
      mostrarZonas();
      mostrarPuntosDeRetiro();
  }
]);
