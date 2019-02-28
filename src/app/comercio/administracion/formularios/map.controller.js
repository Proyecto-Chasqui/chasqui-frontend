angular.module('chasqui').controller('MapGeocoderController', ['$scope', '$rootScope', '$log', '$q', 'leafletData', 'StateCommons', 'ToastCommons', '$mdDialog', '$mdSidenav',
  function($scope, $rootScope, $log, $q, leafletData, StateCommons, ToastCommons, $mdDialog, $mdSidenav) {
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
    var posicionMapaPredeterminado = [-34.7739, -58.5520];

    var blueIcon = L.icon({
      iconUrl: 'assets/images/map-marker-40-alter.png',

      iconSize: [51, 51],
      iconAnchor: [0, 40],
      popupAnchor: [24, -40]
    });

    var yellowIcon = L.icon({
      iconUrl: 'assets/images/map-marker-40-manual.png',

      iconSize: [51, 51],
      iconAnchor: [25, 60],
      popupAnchor: [0, -55]
    });

    var greenIcon = L.icon({
      iconUrl: 'assets/images/map-marker-40-predet.png',

      iconSize: [51, 51],
      iconAnchor: [0, 40],
      popupAnchor: [24, -40]
    });


    var HttpClient = function() {
      //genera un httpGET request;
      this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
          if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
            aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
      }
    }

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
     * Controles del Pop up
     */

    function moveMarker(e) {
      $rootScope.global_marker.setLatLng(e.latlng);
    }

    function desactivarArrastreEnMarcador() {
      if ($rootScope.global_marker != null) {
        $rootScope.global_marker.dragging.disable();
      }
    }



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
      desactivarArrastreEnMarcador();
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

    function showAlert(ev, mensaje) {
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#mappopupContainer')))
        .clickOutsideToClose(true)
        .title('Se ha producido un error')
        .htmlContent(mensaje)
        .ok('OK')
        .targetEvent(ev)
      );
    };

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
      return (!$scope.latitudValida|| !$scope.longitudValida||!$scope.calleValida || !$scope.localidadValida || !$scope.alturaValida || !$scope.aliasValido || $rootScope.isDisabled);
    };

    $scope.formIsValidForSave = function() {
      return formValidoParaGuardar();
    };

    $scope.isSearching = function() {
      return $rootScope.isSearching;
    };

    $scope.formIsValidForSearch = function() {
      return $rootScope.isSearching || !$scope.calleValida || !$scope.localidadValida || !$scope.alturaValida;
    }

    $scope.mostrarBotonesEnMapa = function() {
      return $rootScope.mostrarBotones;
    };

    $scope.mostrarBotonesMarcaManual = function() {
      return $rootScope.mostrarBotonesMarcaManual;
    };


    /*
     * Botones de Confirmacion y cancelacion 
     * en el Mapa
     */

    $scope.direccionCorrecta = function() {
      restaurarEstadoDeLosBotones();
      restaurarBotonesAlAceptar();
      $scope.$emit('posicionValida', [$rootScope.global_marker.getLatLng().lat, $rootScope.global_marker.getLatLng().lng]);
      $mdDialog.hide();
    }

    $scope.direccionIncorrecta = function() {
      restaurarEstadoDeLosBotones();
      restaurarBotonesAlCancelar();
      $rootScope.$emit('recargarMarcas', 0);
      $mdDialog.hide();
    }

    function loadGlobalCoordinatesInProfile(lat, lng) {

      $rootScope.vmGlobal.latitud = lat;
      $rootScope.vmGlobal.longitud = lng;
    }

    /*
     * Funciones del mapa
     */

    leafletData.getMap("mapaDirecciones").then(function(map) {
      /*
       * Variables en contexto del mapa
       */
      attribution = map.attributionControl;
      vmap = map;
      var marker = null;
      vmap.setView(posicionMapaPredeterminado);
      vmap.setZoom(9);
      map.invalidateSize(false);
      attribution.setPosition('bottomleft');
      $scope.ayuda = "<h1>Mensaje de ayuda desde el controlador</h1>";
      $scope.toggleLeft = buildToggler('left');
      $scope.toggleRight = buildToggler('right');
      /*
       * fin de variables en contexto de mapa
       */

      $scope.$on('posicionValida', function(event, args) {
        loadGlobalCoordinatesInProfile(args[0], args[1]);
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

      $scope.mostrarMapaGeneral = function(ev) {
        map.off('click', moveMarker);
        if (marker != null) {
          map.setView(marker.getLatLng(), 11);
        } else {
          map.setView(posicionMapaPredeterminado, 11);
        }
        $rootScope.$emit('recargarMarcas', 0);
        $rootScope.mostrarBotones = false;
        map.closePopup();
        $mdDialog.show({
          contentElement: '#myMap',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        }).then(function() {}, function() {});

      };
      //guarda una funcion para setear markers;
      var agregarMarker = function() {
        //funcion primaria para setear el Marker
        this.setMarker = function(lat, lng) {
          if (marker == null) {
            if (!$scope.address.predeterminada) {
              marker = L.marker([lat, lng]).setIcon(blueIcon);
            } else {
              marker = L.marker([lat, lng]).setIcon(greenIcon);
            }
            this.markerPopUp(marker, lat, lng);
            return marker;
          } else {
            marker.dragging.disable();
            if (!$scope.address.predeterminada) {
              marker.setLatLng([lat, lng]).setIcon(blueIcon);
            } else {
              marker.setLatLng([lat, lng]).setIcon(greenIcon);
            }
            this.markerPopUp(marker, lat, lng);
            return marker;
          }
        }

        this.markerManualMarkerPopUp = function(marker, lat, lng) {
          marker.bindPopup('<div align="center"> Coloqueme en la ubicación deseada </div>');
          marker.on('click', function(e) {
            //alert("hi. you clicked the marker at " + e.latlng);
          });
        }

        //Le agrega el PopUp al marker
        this.markerPopUp = function(marker, lat, lng) {
          marker.bindPopup('<div align="center"> Alias: ' + $scope.address.alias + '</div>' +
            '<div align="center"> Calle: ' + $scope.address.calle + '</div>' +
            '<div align="center"> Altura: ' + $scope.address.altura + '</div>' +
            '<div align="center"> Localidad: ' + $scope.address.localidad + '</div>' +
            '<div align="center"> Latitud: ' + lat + '</div>' +
            '<div align="center"> Longitud: ' + lng + '</div>');
          marker.on('click', function(e) {
            //alert("hi. you clicked the marker at " + e.latlng);
          });
        }
      }
      //Marca en primera instancia las direcciones guardadas.
      function cargarMarcador() {
        if ($scope.address != null && $scope.address.latitud != null) {
          new agregarMarker()
            .setMarker($scope.address.latitud, $scope.address.longitud)
            .addTo(vmap);
        }
      }

      cargarMarcador();

      $rootScope.$on('recargarMarcas', function() {
        if ($scope.address != null && $scope.address.latitud != null && marker != null) {
          map.removeLayer(marker);
          new agregarMarker()
            .setMarker($scope.address.latitud, $scope.address.longitud)
            .addTo(vmap);
        }
      });
      //Si se soluciona el problema de GoogleChrome con la restriccion del https
      //con el autolocate, se debe reposicionar la vista 
      // como esta comentado .setMarker tanto en el maker como en el map.setView
      function marcar(ev) {
        map.on('click', moveMarker);
        if (marker != null) {
          map.removeLayer(marker);
        };
        var markereditor = new agregarMarker();
        map.closePopup();
        markereditor
          .setMarker(vmap.getCenter().lat, vmap.getCenter().lng)
          .setIcon(yellowIcon)
          .closePopup()
          .addTo(vmap);
        markereditor.markerManualMarkerPopUp(marker, marker.getLatLng().lat, marker.getLatLng().lng);
        $rootScope.mostrarBotonesMarcaManual = true;
        $rootScope.mostrarBotones = false;
        marker.dragging.enable();
        map.setView([vmap.getCenter().lat, vmap.getCenter().lng], 11);
        $rootScope.global_marker = marker;
        $rootScope.vmGlobal = $scope.address;
        show(ev);
      }



      function buildToggler(componentId) {
        return function() {
          $mdSidenav(componentId).toggle();
        };
      }

      //No funciona en GoogleChrome, debido a cambios en la seguridad
      //getCurrentPosition y watchCurrentPositon, puede ser solo accedido
      //desde una llamada https.
      $scope.localizar = function(ev) {

        bloquearBotones();
        $rootScope.auto_localizar = "Buscando...";

        //               if (navigator.geolocation) {
        if (false) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            vmap.setView(pos);
            vmap.setZoom(20);
            marcar(ev);
          });
        } else {
          marcar(ev);
        }
      }

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


      function validateArrayWithElement(array, compare) {
        var ret = false;
        for (i in array) {
          if (!ret) {
            ret = array[i] == compare;
          }
        }
        return ret;
      }

      function getJsonDataComponents(jsonArray) {
        for (i in jsonArray) {
          var index = i;
          var value = jsonArray[index].types;
          if (validateArrayWithElement(value, 'street_number')) {
            altura = jsonArray[index].long_name;
          }

          if (validateArrayWithElement(value, 'postal_code')) {
            codigo_postal = jsonArray[index].long_name;
          }

          if (validateArrayWithElement(value, 'route')) {
            calle = jsonArray[index].long_name;
          }

          if (validateArrayWithElement(value, 'administrative_area_level_2')) {
            partido = jsonArray[index].long_name;
          }

          if (validateArrayWithElement(value, 'country')) {
            pais = jsonArray[index].long_name;
          }

        }
      }

      function reverseGeoCoding(ev) {
        var lat = marker.getLatLng().lat;
        var lng = marker.getLatLng().lng;
        aQuery = new HttpClient();
        var httpquery = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyD_8mUpLuoMmB6qSW_kI3vQXY7jpvbfnB4';
        $log.debug(httpquery);
        aQuery.get(httpquery, function(response) {
          if (JSON.parse(response).status == "OK") {
            var jsonarray = JSON.parse(response).results[0].address_components;
            var json = JSON.parse(response).results[0].geometry.location;
            getJsonDataComponents(jsonarray);
            latitud = json.lat;
            longitud = json.lng;
            loadproperties();
            show(ev);
          } else {

            desbloquearBotones();
            var mensaje = 'No se logro ubicar su posicion';
            showAlert(ev, mensaje);
            $log.debug('Error Map.controller.js en la funcion reverseGeoCoding()');
            $log.debug(mensaje);
          }
        });
      }

      setTimeout(function() { vmap.invalidateSize() }, 500);
      $scope.buscar = function(ev) {

        bloquearBotones();
        map.off('click', moveMarker);
        $rootScope.buscar_direccion = "Buscando...";
        cambiarDescripcionDeBotonesDeBusqueda();
        //Arma la query
        encodedQuery = $scope.address.calle + '+' + $scope.address.altura + '+' + $scope.address.localidad + '+' + "Argentina";
        aQuery = new HttpClient();
        //Ejecuta la query y delega la respuesta (response) a la funcion anonima
        aQuery.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodedQuery + '+&key=AIzaSyD_8mUpLuoMmB6qSW_kI3vQXY7jpvbfnB4', function(response) {
          if (JSON.parse(response).status == "OK") {
            var json = JSON.parse(response).results[0].geometry.location;
            var jsonarray = JSON.parse(response).results[0].address_components
            getJsonDataComponents(jsonarray);
            latitud = json.lat;
            longitud = json.lng;
            new agregarMarker().setMarker(json.lat, json.lng)
              .addTo(vmap)
              .openPopup();
            $rootScope.vmGlobal = $scope.address;
            $rootScope.global_marker = marker;
            vmap.setView([json.lat, json.lng], 15);
            show(ev);
          } else {
            desbloquearBotones();
            var mensaje = '<br>' +
              '<div>No se encontro la dirección con los siguientes datos</div>' +
              '<br>' +
              '<div> Calle: ' + $scope.address.calle + ' </div>' +
              '<div> Altura: ' + $scope.address.altura + ' </div>' +
              '<div> Localidad: ' + $scope.address.localidad + ' </div>' +
              '<div> Pais: Argentina </div>' +          // TODO generalizar
              '<br>' +
              '<div> Si el problema persiste, puede marcar manualmente su posición en el mapa </div>';
            showAlert(ev, mensaje);
            $log.debug('Error Map.controller.js en la funcion $scope.buscar()');
          }
        });

      }

    });

  }
]);
