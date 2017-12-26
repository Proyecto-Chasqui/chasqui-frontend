(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('ProductorController', ProductorController);

	/** @ngInject */
	function ProductorController($log, $stateParams, $scope, CTE_REST, navigation_state, productorService, ToastCommons, us) {
		
        $log.debug('EmprenController ..... ', $stateParams.id);
		//navigation_state.goMakersTab();
        

		$scope.urlBase = CTE_REST.url_base;
		var idProductor = $stateParams.id;
        
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
