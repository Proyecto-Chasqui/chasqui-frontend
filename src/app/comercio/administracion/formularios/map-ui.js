(function() {
  'use strict';

  angular.module('chasqui').service('MapUI', MapUI);
  function MapUI($log, leafletData) {

	var map;

	this.setMap= function(refmap){
		map = refmap;
	}

	this.setPopUp = function(msj, rmarker){
		rmarker.bindPopup(msj);
		var functopen = function (e){
			rmarker.openPopup();
		}

		var functclose = function(e){
			rmarker.closePopup();
		}
		rmarker.on('mouseover', functopen);
		rmarker.on('mouseout', functclose);
	}

	this.closePopUp=function(marker){
		marker.closePopup();
	}

	function enableClick(marker){
		var funct = function(e) {
        	marker.setLatLng(e.latlng);
        	map.setView(e.latlng);        
    	}

  		map.on('click', funct);

	}

	function disableClick(){
		map.off('click');
	}

	this.activarArrastreEnMarcador = function(marker) {
      enableClick(marker);
      marker.dragging.enable();
    }

    this.desactivarArrastreEnMarcador = function(marker){
    	disableClick();
    	marker.dragging.disable();
    }

    this.setFocusOn = function(marker){
    	map.invalidateSize();
    	map.setView(marker.getLatLng());
        map.setZoom(15);     
    }

    this.setZoom = function(zoom){
    	map.setZoom(zoom);
    }

 }
})();