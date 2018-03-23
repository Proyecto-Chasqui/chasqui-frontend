(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('ProductorController', ProductorController);

	/** @ngInject */
	function ProductorController($log, $stateParams, $scope, URLS, REST_ROUTES, navigation_state, 
                                  productorService, ToastCommons, us, catalogs_dao) {
		
        $log.debug('EmprenController ..... ');
		//navigation_state.goMakersTab();
        

		$scope.urlBase = URLS.be_base;
        var idProductor = catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id;
        
        $scope.productores = [];
        $scope.productor = {};

		// /////////////// Eventos


		// ///////////////



		function callEmprendedores() {
			$log.debug("---callEmprendedor ---");

			productorService.getProductores()
				.then(function(response) { 
                    $scope.productores = response.data; 
                    console.log($scope.productores, idProductor);
                    $scope.productor = $scope.productores.filter(function(p){ return p.idProductor === parseInt(idProductor);})[0];
            })
		}


		callEmprendedores();

	}
})();
