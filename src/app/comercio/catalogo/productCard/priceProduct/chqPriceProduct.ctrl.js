(function(){
	'use strict'
  
	angular.module('chasqui').controller('ChqPriceProductCtrl', ChqPriceProductCtrl);

	function ChqPriceProductCtrl($scope){
    
    $scope.getParteEntera = getParteEntera;
    $scope.getParteDecimal = getParteDecimal;
    $scope.adaptToView = adaptToView;
    
    
    function getParteEntera(precio){
      return Math.floor(precio);
    }
    
    function getParteDecimal(precio){
      return Math.round((precio - getParteEntera(precio))*100);
    }
    
    function adaptToView(decimal){
      return ("00" + decimal.toString()).slice(-2);
    }    
    
	}
})();