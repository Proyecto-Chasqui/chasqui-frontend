(function() {
	'use strict';
    
    	angular
		.module('chasqui')
		.controller('ModifyCountCtrl', ModifyCountCtrl);
    
	function ModifyCountCtrl($scope, $mdDialog, texts, initCount, actions) {
        $scope.title = texts.title;
        $scope.okButton = texts.okButton;
        $scope.cancelButton = texts.cancelButton;
        $scope._count = initCount;
        
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