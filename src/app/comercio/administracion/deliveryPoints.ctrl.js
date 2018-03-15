(function() {
	'use strict';
    
    angular.module('chasqui').controller('DeliveryPointsCtrl', DeliveryPointsCtrl);
    
	function DeliveryPointsCtrl(navigation_state) {
        
        navigation_state.goDeliveryPointsTab();
        
    }
    
})();