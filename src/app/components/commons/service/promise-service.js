(function() {
	'use strict';

	angular.module('chasqui').service('promiseService', promiseService);

	function promiseService($q, restProxy, us, $log, $state, toastr, $rootScope) {
		var vm = this;

		vm.doGet = function(url, params, noOkFuctionParam) {
			var defered = $q.defer();
			var promise = defered.promise;

			restProxy.get(url, params,
				function doOk(response) { defered.resolve(response); },
				getNoOkFuction(noOkFuctionParam)
			);

			return promise;
		}

		vm.doGetPrivate = function(url, params, noOkFuctionParam) {
			var defered = $q.defer();
			var promise = defered.promise;

			restProxy.getPrivate(url, params,
				function doOk(response) { defered.resolve(response); },
				getNoOkFuction(noOkFuctionParam)
			);

			return promise;
		}

		vm.doPost = function(url, params, noOkFuctionParam) {
			var defered = $q.defer();
			var promise = defered.promise;

			restProxy.post(url, params,
				function doOk(response) { defered.resolve(response); },
				getNoOkFuction(noOkFuctionParam)
			);

			return promise;
		}

		vm.doPostPublic = function(url, params, noOkFuctionParam) {
			var defered = $q.defer();
			var promise = defered.promise;

			restProxy.postPublic(url, params,
				function doOk(response) { defered.resolve(response); },
				getNoOkFuction(noOkFuctionParam)
			);

			return promise;
		}

		vm.doPut = function(url, params, noOkFuctionParam) {
			var defered = $q.defer();
			var promise = defered.promise;

			restProxy.put(url, params,
				function doOk(response) { defered.resolve(response); },
				getNoOkFuction(noOkFuctionParam)
			);

			return promise;
		}

		vm.doDelete = function(url, params, noOkFuctionParam) {
			var defered = $q.defer();
			var promise = defered.promise;

			restProxy.delete(url, params,
				function doOk(response) { defered.resolve(response); },
				getNoOkFuction(noOkFuctionParam)
			);

			return promise;
		}


		var getNoOkFuction = function(noOkFuctionParam) {
			if (us.isUndefinedOrNull(noOkFuctionParam)) {
				return doNoOkDefault;
			} else {
				return noOkFuctionParam;
			}

		}

		/** En caso de no ser un respues exitosa va a la pantalla de error generica */
		var doNoOkDefault = function(response) {
			$log.error("error al llamar a un servicio", response);

			if (response.status == 401) {
				toastr.info(us.translate('VUELVA_A_LOGUEAR'), us.translate('AVISO_TOAST_TITLE'));
				$rootScope.$broadcast('logout', "");
				$state.go('catalog.login');
			} else {
				//    $log.error("error al llamar a un servicio data", response.data);
				//    $log.error("error al llamar a un servicio data.error", response.data.error);
				//    $log.error("error al llamar a un servicio data.error", response.data.error == undefined);
				if (response.data.error == undefined) {
					$state.go('error', {
						key: 'GENERIC_ERROR'
					});
				} else {
					ToastCommons.error(response.data.error, "Error");
				}

			}

		}

	} // function
})(); // anonimo
