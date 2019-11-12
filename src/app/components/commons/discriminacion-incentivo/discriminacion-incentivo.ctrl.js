(function() {
	'use strict';

	angular.module('chasqui').controller('discriminacionIncentivoController', discriminacionIncentivoController);

	/** @ngInject */
	function discriminacionIncentivoController($scope, $stateParams, sellerService, $log) {
    
    $scope.montoTotalNodo = montoTotalNodo;
    $scope.montoSinIncentivo = montoSinIncentivo;
    $scope.incentivoNodo = incentivoNodo;

    /////////////////////////////////////
               
    
    function montoTotalNodo(node){
      return node.miembros != undefined? node.miembros.reduce(function(r,m){
        if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
            return r + m.pedido.montoActual + m.pedido.incentivoActual;
        }else{
            return r;
        }
      }, 0) : 0;
    }


    function montoSinIncentivo(node){
      return node.miembros != undefined? node.miembros.reduce(function(r,m){
        if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
            return r + m.pedido.montoActual;
        }else{
            return r;
        }
      }, 0) : 0;
    }


    function incentivoNodo(node){
      return node.miembros != undefined? node.miembros.reduce(function(r,m){
        if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
            return r + m.pedido.incentivoActual;
        }else{
            return r;
        }
      }, 0) : 0;
    }


    /////////////////////////////////////
    
    function init(){
    
    }
    
    init();
        
	}

})();