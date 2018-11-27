(function() {
	'use strict';

	angular.module('chasqui').service('deliveryPointsService', deliveryPointsService);

	function deliveryPointsService($log, REST_ROUTES, promiseService) {
		var vm = this;

		vm.deliveryPoints = deliveryPoints;
        
        ///////////////////////////////////////////////////////////////////////////////////////////
            
            
    function deliveryPoints(idCatalog) {
			$log.debug(" service deliveryPoints ");
			return promiseService.doGet(REST_ROUTES.puntosDeRetiro(idCatalog), {} );
		}
        
	}
})();
