(function() {
	'use strict';

	angular.module('chasqui').service('sellerService', sellerService);

	function sellerService(restProxy, $q, REST_ROUTES, promiseService) {
		var vm = this;

		vm.getSellers = function() {
            return promiseService.doGet(REST_ROUTES.sellers, {});
		}

		vm.getSeller = function(sellerId) {
			return promiseService.doGet(REST_ROUTES.seller(sellerId), {});
		}

	}
})();