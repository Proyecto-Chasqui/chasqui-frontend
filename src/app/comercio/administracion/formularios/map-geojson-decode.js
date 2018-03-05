(function() {
  'use strict';

  angular.module('chasqui').service('MapGeoJsonDecode', MapGeoJsonDecode);

  function MapGeoJsonDecode($log) {

	var map;
	//funcion para reverse geocoding (deprecable)
	this.validateArrayWithElement=function(array, compare) {
        var ret = false;
        for (i in array) {
          if (!ret) {
            ret = array[i] == compare;
          }
        }
        return ret;
      }
      
      //funcion para reverse geocoding (deprecable)
      this.getJsonDataComponents=function(jsonArray) {
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
      //funcion para sacar las coordenads de un geoJson proveido por Gmap.
      //definir otra funcion si se usa otro servicio.
      this.gmapJsonDecode= function(geojson){
      	var json = JSON.parse(geojson).results[0].geometry.location;
        var latitud = json.lat;
        var longitud = json.lng;
        return [latitud, longitud];
      }

 }
})();