(function() {
	'use strict';
    
    angular.module('chasqui').controller('ListaNodosCtrl', ListaNodosCtrl);
    
	function ListaNodosCtrl(navigation_state, $scope, dialogCommons) {
        
        navigation_state.goMyNodesTab();
        
        $scope.crearNodo = function() {
		 // Convertir esto en un print o alert para que funcione TODO: document.getElementById("demo").innerHTML = "CREAR NODO";
         //$log.debug("");
            dialogCommons.newNode();
        }
        
        $scope.unirseNodo = function() {
			// Convertir esto en un print o alert para que funcione TODO: document.getElementById("demo").innerHTML = "UNIRSE NODO";
		}
        
        
    }
    
})();