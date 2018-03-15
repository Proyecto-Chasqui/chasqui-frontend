(function() {
	'use strict';

	angular.module('chasqui').service('deliveryPointsService', deliveryPointsService);

	function deliveryPointsService($log, CTE_REST, promiseService) {
		var vm = this;

		vm.deliveryPoints = deliveryPoints;
        
        ///////////////////////////////////////////////////////////////////////////////////////////
            
            
        function deliveryPoints(idCatalog) {
			$log.debug(" service deliveryPoints ");
			return promiseService.doGet(CTE_REST.puntosDeRetiro(idCatalog), {} );
		}
        
	}
})();
