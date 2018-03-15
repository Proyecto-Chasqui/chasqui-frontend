(function() {
	'use strict';
    
    angular.module('chasqui').controller('ListaNodosCtrl', ListaNodosCtrl);
    
	function ListaNodosCtrl(navigation_state) {
        
        navigation_state.goMyNodesTab();
        
    }
    
})();