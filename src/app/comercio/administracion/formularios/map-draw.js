(function() {
  'use strict';

  angular.module('chasqui').service('MapDraw', MapDraw);
  function MapDraw($log,leafletData) {

  	$log.debug('INIT MAP DRAW');
	var mapa;
	var direccionlayer = new L.LayerGroup();
	var zoneLayer = new L.LayerGroup();
	var sellerPointLayer = new L.LayerGroup();
	var markers = new Map();
	var polygons = new Map();
	var overlayMaps = {
    	"<img src='./assets/images/zone32.png' height=12> Zonas de entrega": zoneLayer,
    	"<img src='./assets/images/commerce51.png' height=12> Puntos de retiro": sellerPointLayer
	};
	var controledMarker;

	this.setMap = function(refmap){
		mapa = refmap;
		mapa.addLayer(direccionlayer);
	}

	this.setMapForZones = function(refmap){
		mapa = refmap;
		zoneLayer = new L.LayerGroup();
		overlayMaps = {
	    	"<img src='./assets/images/zone32.png' height=12> Zonas de entrega": zoneLayer,
	    	"<img src='./assets/images/commerce51.png' height=12> Puntos de retiro": sellerPointLayer
		};
		mapa.addLayer(zoneLayer);
	}

	this.sellerPointLayer = function(refmap){
		mapa = refmap;
		sellerPointLayer = new L.LayerGroup();
		overlayMaps = {
	    	"<img src='./assets/images/zone32.png' height=12> Zonas de entrega": zoneLayer,
	    	"<img src='./assets/images/commerce51.png' height=12> Puntos de retiro": sellerPointLayer
		};
		mapa.addLayer(sellerPointLayer);
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

	this.setMarkerSPIn = function(name,lat,lng){

        var marker = L.marker([lat, lng]);
        markers.set(name,marker);
        sellerPointLayer.addLayer(marker);
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

    this.setLayersControl = function (){
    	L.control.layers(null,overlayMaps,{position: 'topleft',collapsed: false}).addTo(mapa);
    }

    this.resetAllMarkIconsTo = function (icon){
    	var i = 0;
    	var values = Array.from(markers.entries());
    	for(i;i<values.length;i++){
    		values[i][1].setIcon(icon);
    	}
    }

    //polygon section
    this.drawPolygon = function(coordinates, name){
    	var polygon = L.polygon(coordinates)
    	zoneLayer.addLayer(polygon);
    	polygons.set(name,polygon);
    }

    this.resetStyleAllPolygons=function(){
		polygons.forEach(resetColor);
	}

	function resetColor(value, key, map) {
  		value.setStyle({
			color: 'blue'
		});
	};

	this.getPolygon = function(name){
		return polygons.get(name);
	}

 }
})(); 
