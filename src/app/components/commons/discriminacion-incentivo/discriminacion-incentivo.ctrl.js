(function() {
	'use strict';

	angular.module('chasqui').controller('discriminacionIncentivoController', discriminacionIncentivoController);

	/** @ngInject */
	function discriminacionIncentivoController($scope, $stateParams, sellerService, $log) {
    
    $scope.montoTotalNodo = 0;
    $scope.montoSinIncentivo = 0;
    $scope.incentivoNodo = 0;

    /////////////////////////////////////
               
    
    function _montoTotalNodo(node){
      return node.miembros != undefined? node.miembros.reduce(function(r,m){
        if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
            return r + m.pedido.montoActual + m.pedido.incentivoActual;
        }else{
            return r;
        }
      }, 0) : 0;
    }


    function _montoSinIncentivo(node){
      return node.miembros != undefined? node.miembros.reduce(function(r,m){
        if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
            return r + m.pedido.montoActual;
        }else{
            return r;
        }
      }, 0) : 0;
    }


    function _incentivoNodo(node){
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
      if($stateParams.order && "montoTotalSinIncentivo" in $stateParams.order) {
        $scope.montoTotalNodo = $stateParams.order.montoActual;
        $scope.montoSinIncentivo = $stateParams.order.montoTotalSinIncentivo;
        $scope.incentivoNodo = $stateParams.order.incentivoTotal;
      } else {
        $scope.montoTotalNodo = _montoTotalNodo($scope.node);
        $scope.montoSinIncentivo = _montoSinIncentivo($scope.node);
        $scope.incentivoNodo = _incentivoNodo($scope.node);

      }
    }
    
    init();
        
	}

})();