(function() {
  'use strict';

  angular.module('chasqui').service('MapREST', MapREST);
  function MapREST($log,URLS) {

  	$log.debug('INIT MapREST');
	//var map;

	    //REST
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

    this.obtainAllZones=function(aCallback, idVendedor){
      var aQuery = new HttpClient();
      var httpquery = URLS.be_base + 'rest/client/vendedor/zonasGeo/' + idVendedor;
      aQuery.get(httpquery, aCallback);
    }

    this.obtainAllSellerPoints=function(aCallback, idVendedor){
      var aQuery = new HttpClient();
      var httpquery = URLS.be_base + 'rest/client/vendedor/puntosDeRetiro/id/' + idVendedor;
      aQuery.get(httpquery, aCallback);
    }
	      //rest (deprecable)
      this.reverseGeoCoding=function(ev) {
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
            var mensaje = 'No se logro ubicar su posición';
            showAlert(ev, mensaje);
            $log.debug('Error Map.controller.js en la funcion reverseGeoCoding()');
            $log.debug(mensaje);
          }
        });
      }
      //parametrizar para permitir cambio de servicio de gmaps a otro servicio
      this.searchAddress=function(calle, altura, localidad, pais,responseDecoderCallBack){

        var encodedQuery = calle + '+' + altura + '+' + localidad + '+' + pais;
        var aQuery = new HttpClient();
        aQuery.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodedQuery + '+&key=AIzaSyD_8mUpLuoMmB6qSW_kI3vQXY7jpvbfnB4', function(response) {
          var ret;
          if (JSON.parse(response).status == "OK") {
          	$log.debug('PARSE CORRECTO');
          	ret = response;
          } else {
          	$log.debug('PARSE INCORRECTO');
          	ret  = null;
          }
          responseDecoderCallBack(ret);
        });

      }

 }
})();