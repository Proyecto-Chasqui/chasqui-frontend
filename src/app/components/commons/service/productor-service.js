(function() {
	'use strict';

	angular.module('chasqui').service('productorService', productorService);

	function productorService(restProxy, $q, $log, REST_ROUTES, promiseService, $stateParams, contextCatalogsService) {

		var vm = this;

		vm.getProductores = function() {
			$log.debug(" service getProductores ");

			var defered = $q.defer();
			var promise = defered.promise;
            
            contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                restProxy.get(REST_ROUTES.productores(catalog.id), {},
                    function doOk(response) { defered.resolve(response); },
                    function doNoOk(response) { defered.reject(response); }
                );
            })
            
			return promise;
		}

		vm.getMedallas = function() {
			$log.debug(" service getMedallas productores ");
			return promiseService.doGet(REST_ROUTES.medallasProductor, {});
		}

		vm.normalizarProductores = function(data) {
			return {
				idProductor: data.id,
				nombreProductor: data.nombre,
				pathImagen: data.imagen,
				descripcionCorta: data.descripcion_corta,
				descripcionLarga: data.descripcion_larga,
				direccion: {
					pais: data.pais,
					provincia: data.provincia,
					localidad: data.localidad,
					calle: data.calle,
					altura: data.altura
				}
			}
		}

	} // function
})(); // anonimo
