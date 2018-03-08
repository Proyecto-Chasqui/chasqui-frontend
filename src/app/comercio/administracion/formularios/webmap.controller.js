angular.module('chasqui').controller('MapWebController', ['MapDraw','MapUI', 'MapREST', 'MapGeoJsonDecode', '$scope', '$rootScope', '$log', '$q', 'leafletData', 'StateCommons', 'ToastCommons', '$mdDialog', '$mdSidenav',
  function(MapDraw, MapUI ,MapREST, MapGeoJsonDecode, $scope, $rootScope, $log, $q, leafletData, StateCommons, ToastCommons, $mdDialog, $mdSidenav) {
    /*-------------------------------
     *------Variables Gobales--------
     *------------------------------*/

    var vm = this;
    var vmap;
    var deshabilitarBoton = true;
    $rootScope.isDisabled = true;
    $rootScope.mostrarBotones = true;
    $rootScope.mostrarBotonesMarcaManual = false;
    $rootScope.isSearching = false;
    $rootScope.buscar_direccion = "Buscar";
    $rootScope.auto_localizar = "Marcar";
    $rootScope.global_marker;
    $rootScope.vmGlobal;
    $rootScope.nameMarker;
    var posicionMapaPredeterminado = [-34.7739, -58.5520];

    var blueIcon = L.icon({
      iconUrl: 'assets/images/map-marker-40-alter.png',

      iconSize: [51, 51],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50]
    });

    var yellowIcon = L.icon({
      iconUrl: 'assets/images/map-marker-40-manual.png',

      iconSize: [51, 51],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50]
    });

    var greenIcon = L.icon({
      iconUrl: 'assets/images/map-marker-40-predet.png',

      iconSize: [51, 51],
      iconAnchor: [25, 50],
      popupAnchor: [24, -50]
    });

    var calle;
    var altura;
    var partido;
    var latitud;
    var longitud;
    var codigo_postal;

    /*--------------------------------------
     *------- Fin Variables Generales ------
     *-------------------------------------*/

    /*
     * Funciones de Control de estado
     * de los botones.
     */
    function bloquearBotones() {
      $rootScope.mostrarBotones = true;
      $rootScope.isSearching = true;
      $rootScope.isDisabled = true;
    }

    function desbloquearBotones() {
      $rootScope.isSearching = false;
      $rootScope.isDisabled = true;
    }

    function restaurarMostrarBotones() {
      $rootScope.mostrarBotones = true;
      $rootScope.mostrarBotonesMarcaManual = false;
    }

    function restaurarBotonesAlCancelar() {
      $rootScope.isSearching = false;
      $rootScope.isDisabled = true;
    }

    function restaurarBotonesAlAceptar() {
      $rootScope.isSearching = false;
      $rootScope.isDisabled = false;
    }

    function cambiarDescripcionDeBotonesDeBusqueda() {
      $rootScope.buscar_direccion = "Buscar";
      $rootScope.auto_localizar = "Marcar";
    }

    function restaurarEstadoDeLosBotones() {
      cambiarDescripcionDeBotonesDeBusqueda();
      restaurarMostrarBotones();
    }
    /*
     * Funcion de llamado al
     * PopUp con el mapa
     */
    function show(ev) {
      $mdDialog.show({
        contentElement: '#myMap',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        escapeToClose: false
      }).then(function() {}, function() {});
    };
    
    function showConsultaMapa(ev){
      $mdDialog.show({
        contentElement: '#alertOnMap',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        escapeToClose: false
      }).then(function() {}, function() {});
    }

    function showErrorForm(contentElement){
      $mdDialog.show({
        contentElement: contentElement ,
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false
      }).then(function() {}, function() {});
    }

    function showAlert(mensaje) {
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#mappopupContainer')))
        .clickOutsideToClose(true)
        .title('Se ha producido un error')
        .htmlContent(mensaje)
        .ok('OK')
        //.targetEvent(ev)
      );
    };

    function showConfirmacionEnMapa(ev){
      $mdDialog.show({
        contentElement: '#myMap',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        escapeToClose: false
      }).then(function() {}, function() {});
    }

    function DialogController($scope, $rootScope, $mdDialog) {

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }
    /*
     * Funciones de acceso 
     * estado de los botones
     * desde la vista 
     */

    function formValidoParaGuardar() {
      return ( $scope.latitudValida && $scope.longitudValida && $scope.calleValida && $scope.localidadValida && $scope.alturaValida && $scope.aliasValido && !$rootScope.isDisabled);
    };

    $scope.formIsValidForSave = function() {
      return formValidoParaGuardar();
    };

    $scope.isSearching = function() {
      return $rootScope.isSearching;
    };

    $scope.formIsValidForSearch = function() {
      return ($rootScope.isSearching || !$scope.calleValida || !$scope.localidadValida || !$scope.alturaValida);
    }

    $scope.mostrarBotonesEnMapa = function() {
      return $rootScope.mostrarBotones;
    };

    $scope.mostrarBotonesMarcaManual = function() {
      return $rootScope.mostrarBotonesMarcaManual;
    };

      function loadproperties() {
        $scope.address.calle = calle;
        $scope.address.altura = altura;
        $scope.address.localidad = partido;
        $scope.address.latitud = latitud;
        $scope.address.longitud = longitud;
        $scope.$apply();
      }

      function loadCoordinatesInProfile() {
        $scope.address.latitud = latitud;
        $scope.address.longitud = longitud;
        $scope.$apply();

      }

    /*
     * Botones de Confirmacion y cancelacion  
     * en el Mapa
     */

    $scope.direccionCorrecta = function() {
      restaurarEstadoDeLosBotones();
      restaurarBotonesAlAceptar();
      var coords = MapDraw.getMarkerLatLng($rootScope.nameMarker);
      $scope.$emit('posicionValida', coords ); 
      $mdDialog.hide();
    }

    $scope.direccionIncorrecta = function() {
      restaurarEstadoDeLosBotones();
      restaurarBotonesAlCancelar();
      showConsultaMapa();
    }

    function loadGlobalCoordinatesInProfile(lat, lng) {
      $rootScope.vmGlobal.latitud = lat;
      $rootScope.vmGlobal.longitud = lng;
    }

    function buildToggler(componentId) {
       return function() {
         $mdSidenav(componentId).toggle();
       };
    }

    $scope.$on('posicionValida', function(event, args) {
       $log.debug(args);
       loadGlobalCoordinatesInProfile(args.lat, args.lng);
    });

    $rootScope.$on('cambioANuevaDireccion', function(event, args) {
       $log.debug("CAMBIO A NUEVA DIRECCION");
       deshabilitarBoton = true;
       $rootScope.isDisabled = true;
       $rootScope.mostrarBotones = true;
       $rootScope.mostrarBotonesMarcaManual = false;
       $rootScope.isSearching = false;
       $rootScope.buscar_direccion = "Buscar";
       $rootScope.auto_localizar = "Marcar";
       map.setZoom(9);
    });

    /*
     * Seccion de interaccion con el Mapa
     */
    //injecta la referencia del mapa
    leafletData.getMap("mapaDirecciones").then(function(map) {

      /*
       * Variables en contexto del mapa
       * y configuraciones.
       */
      vmap = map;
      attribution = map.attributionControl;
      vmap.setView(posicionMapaPredeterminado);
      vmap.setZoom(9);
      map.invalidateSize(false);
      attribution.setPosition('bottomleft');
      $scope.ayuda = "<h1>Mensaje de ayuda desde el controlador</h1>";
      $scope.toggleLeft = buildToggler('left');
      $scope.toggleRight = buildToggler('right');
      /*
      * fin de variables en contexto de mapa
      * y configuraciones.
      */
      //envia la referencia del mapa a los servicios
      MapDraw.setMap(map);
      MapUI.setMap(map);
    });

    function marcarPuntoManualLimpio(lat,lng){
      MapDraw.setMarkerIn($scope.address.alias,lat,lng);
      MapDraw.setMarkerIcon($scope.address.alias, blueIcon);
      var marker = MapDraw.getMarker($scope.address.alias);
      //Ver si se puede obtener de una pagina html o de un bloque definido en html
      //para dar poder de edicion y estetica desde afuera de controller.
      var msj = '<div align="center"> Alias: ' + $scope.address.alias + '</div>';
      MapUI.setPopUp(msj, marker);
      MapUI.setZoom(9);
    }

    function marcarPunto(lat,lng){
      MapDraw.removeAllMarkers();
      MapDraw.setMarkerIn($scope.address.alias,lat,lng);
      MapDraw.setMarkerIcon($scope.address.alias, blueIcon);
      var marker = MapDraw.getMarker($scope.address.alias);
      //Ver si se puede obtener de una pagina html o de un bloque definido en html
      //para dar poder de edicion y estetica desde afuera de controller.
      var msj = '<div align="center"> Alias: ' + $scope.address.alias + '</div>' +
            '<div align="center"> Calle: ' + $scope.address.calle + '</div>' +
            '<div align="center"> Altura: ' + $scope.address.altura + '</div>' +
            '<div align="center"> Localidad: ' + $scope.address.localidad + '</div>';
      MapUI.setPopUp(msj, marker);
      MapUI.setFocusOn(marker);
    }

    // //--------------------------------------------------------------------//

    var showMap = function(response){
       if(response === null){
          restaurarEstadoDeLosBotones();
          restaurarBotonesAlCancelar();
          $rootScope.nameMarker = $scope.address.alias;
          $rootScope.vmGlobal=$scope.address;
          marcarPunto(posicionMapaPredeterminado[0],posicionMapaPredeterminado[1]);
          show();
       }else{
          var coords = MapGeoJsonDecode.gmapJsonDecode(response);
          marcarPunto(coords[0], coords[1]);
          $rootScope.nameMarker = $scope.address.alias;
          $rootScope.vmGlobal=$scope.address;
          show();
       }
    }

      $scope.habilitarMarcaManual = function (ev){
        var marker = MapDraw.getMarker($rootScope.nameMarker);
        MapUI.activarArrastreEnMarcador(marker);
        MapUI.setFocusOn(marker);
        $rootScope.mostrarBotonesMarcaManual = true;
        $rootScope.mostrarBotones = false;
        show();
      }

      $scope.volverAFormulario = function(ev){
        var marker = MapDraw.getMarker($rootScope.nameMarker);
        MapUI.desactivarArrastreEnMarcador(marker);
        $rootScope.mostrarBotonesMarcaManual = false;
        $rootScope.mostrarBotones = true;
        $mdDialog.hide();
      }

      $scope.buscar = function(ev) {       
        bloquearBotones();
        deshabilitarArrastreEnMarkadorActual();
        $rootScope.buscar_direccion = "Buscando...";
        cambiarDescripcionDeBotonesDeBusqueda();
        MapREST.searchAddress($scope.address.calle,
                              $scope.address.altura,
                              $scope.address.localidad,
                              "Argentina", 
                              showMap);
      }

      function deshabilitarArrastreEnMarkadorActual(){
        var marker = MapDraw.getMarker($rootScope.nameMarker);
        $log.debug("MARKER", marker);
        if( marker !== undefined){
          MapUI.desactivarArrastreEnMarcador(marker);
        }
      }
      

  }
]);
