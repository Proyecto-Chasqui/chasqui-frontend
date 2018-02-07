(function() {
	'use strict';

	angular.module('chasqui').service('sellerService', sellerService);

	function sellerService(restProxy, $q, CTE_REST, promiseService) {
		var vm = this;

		vm.getSellers = function() {
            return promiseService.doGet(CTE_REST.sellers, {});
		}

		vm.getSeller = function(sellerId) {
			return promiseService.doGet(CTE_REST.seller(sellerId), {});
		}

	}
})();