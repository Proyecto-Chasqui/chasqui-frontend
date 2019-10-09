(function() {
	'use strict';
    
    angular.module('chasqui').controller('NodesCtrl', NodesCtrl);
    
	function NodesCtrl(navigation_state) {
        
        navigation_state.goMyNodesTab();
        
    }
    
})();