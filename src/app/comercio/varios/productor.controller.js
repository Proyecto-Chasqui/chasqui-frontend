(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('ProductorController', ProductorController);

	/** @ngInject */
	function ProductorController($log, $stateParams, $scope, CTE_REST, navigation_state, 
                                  productorService, ToastCommons, us, catalogs_dao) {
		
        $log.debug('EmprenController ..... ', catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id);
		//navigation_state.goMakersTab();
        

		$scope.urlBase = CTE_REST.url_base;
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
