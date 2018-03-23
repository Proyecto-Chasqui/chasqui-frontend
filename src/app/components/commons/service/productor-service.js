(function() {
	'use strict';

	angular.module('chasqui').service('productorService', productorService);

	function productorService(restProxy, $q, $log, REST_ROUTES, StateCommons, promiseService, $stateParams, catalogs_dao) {

		var vm = this;

		vm.getProductores = function() {
			$log.debug(" service getProductores ");

			var defered = $q.defer();
			var promise = defered.promise;


			restProxy.get(REST_ROUTES.productores(catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id), {},
				function doOk(response) { defered.resolve(response); },
				function doNoOk(response) { defered.reject(response); }
			);

			return promise;
		}

		vm.getMedallas = function() {
			$log.debug(" service getMedallas productores ");
			return promiseService.doGet(REST_ROUTES.medallasProductor, {});
		}

	} // function
})(); // anonimo
