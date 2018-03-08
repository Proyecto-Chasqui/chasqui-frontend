(function() {
  'use strict';

  angular.module('chasqui').service('MapDraw', MapDraw);
  function MapDraw($log,leafletData) {

  	$log.debug('INIT MAP DRAW');
	var mapa;
	var direccionlayer = new L.LayerGroup();
	var markers = new Map();

	var controledMarker;

	this.setMap = function(refmap){
		mapa = refmap;
		mapa.addLayer(direccionlayer);
	}

	this.cleanMarkers = function(){
	
	}
	//delegar a mapUI
  	this.setMarkerIcon = function (nameMarker,icon){
    	var vmarker = this.getMarker(nameMarker)
    	vmarker.setIcon(icon);
  	}

	this.getMarker = function(name){
		$log.debug( markers.get(name),'GET MARKER');
		return markers.get(name);
	}

	this.getMarkerLatLng = function(name){
		return markers.get(name).getLatLng();
	}

	this.setMarkerIn = function(name,lat,lng){
		controledMarker = this.getMarker(name);
		if (controledMarker == null) {
            controledMarker = L.marker([lat, lng]);
            markers.set(name,controledMarker);
            direccionlayer.addLayer(controledMarker);
          } else {
          	//revisar caso de usuario cambiando entre tabs de direccion
          	var mark = markers.get(name);
          	if(mark !== null){
            	direccionlayer.addLayer(mark);	
          	}else{
            	direccionlayer.addLayer(controledMarker);	
          	}
          }
	}

	this.removeAllMarkers = function(){
		direccionlayer.clearLayers();
	}

	//implementar en caso de necesitar ocultar todos los markers salvo el nombrado
	this.flushAllMarkersBut=function(nameMarker){
		var vmarker = markers.get(nameMarker);
		direccionlayer.clearLayers();
		direccionlayer.addLayer(vmarker);
	}

	this.findMarker = function(){

	}

	this.setAllMarkers= function(){

	}

	this.moveMarker = function(name, data) {
      //$rootScope.global_marker.setLatLng(e.latlng);
    }


 }
})(); 
