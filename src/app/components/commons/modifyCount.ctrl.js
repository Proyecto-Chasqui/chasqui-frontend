(function() {
	'use strict';
    
    	angular
		.module('chasqui')
		.controller('ModifyCountCtrl', ModifyCountCtrl);
    
	function ModifyCountCtrl($scope, $mdDialog, URLS, variety, order, texts, initCount, actions) {
        $scope.urlBase = URLS.be_base;
      
        $scope.title = texts.title;
        $scope.okButton = texts.okButton;
        $scope.cancelButton = texts.cancelButton;
        $scope._count = initCount;
        
        $scope.order = order;
        $scope.variety = variety;
      
        console.log(variety);
      
        $scope.showDecimals = showDecimals;
        $scope.getTotal = getTotal;
        
        /// Private
      
        function showDecimals(parteDecimal) {
            var res = Number(parteDecimal).toFixed(0).toString();
            if (res.length == 1) res += "0";
            return res;
        }
      
        function getTotal(variety){
            var parteDecimal = variety.precioParteDecimal != null? parseInt(variety.precioParteDecimal)/100 : 0;
            console.log(parteDecimal);
            return $scope._count * (parseInt(variety.precio) + parteDecimal);
        }
        
        $scope.countPlus = function(howMuch){
            if($scope._count + howMuch >= 0)
                $scope._count += howMuch;
        }
        
        $scope.count = function(newCount){
            $scope._count = (arguments.length)?             // (a) verifica que sea llamado con parametros
                                (newCount.length > 0)?      // (b) verifica que el largo del string sea > 0
                                    parseInt(newCount):     // setea el valor en Int del string input
                                    0:                      // si (a) & !(b) setea el 0 (esto es asi para que siempre haya un numero)
                                $scope._count;              // si !(a) & !(b) no modifica nada
            return $scope._count;
        }
        
        $scope.okAction = function(count){
            actions.doOk(count);
            $mdDialog.hide();
        }
        
        
        $scope.cancelAction = function(){
            $mdDialog.hide();
            actions.doNoOk();
        }
        
	} 
    
})();         