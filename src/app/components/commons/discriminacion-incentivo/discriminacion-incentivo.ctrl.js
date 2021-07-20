(function() {
	'use strict';

	angular.module('chasqui').controller('discriminacionIncentivoController', discriminacionIncentivoController);

	/** @ngInject */
	function discriminacionIncentivoController($scope, $stateParams) {
    
    var vm = $scope;
    vm.montoTotalNodo = 0;
    vm.montoSinIncentivo = 0;
    vm.incentivoNodo = 0;

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
      var node = vm.node;
      if($stateParams.order && "totalConIncentivo" in $stateParams.order) {
        vm.montoTotalNodo = $stateParams.order.totalConIncentivo;
        vm.montoSinIncentivo = $stateParams.order.totalSinIncentivo;
        vm.incentivoNodo = $stateParams.order.incentivoTotal;
      } else if (node && node.miembros) {
        vm.montoTotalNodo = _montoTotalNodo($scope.node);
        vm.montoSinIncentivo = _montoSinIncentivo($scope.node);
        vm.incentivoNodo = _incentivoNodo($scope.node);
      } else {
        vm.montoTotalNodo = 0;
        vm.montoSinIncentivo = 0;
        vm.incentivoNodo = 0;
      }
    }
    
    init();
        
	}

})();