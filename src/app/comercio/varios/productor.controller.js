(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('ProductorController', ProductorController);

	/** @ngInject */
	function ProductorController($log, $stateParams, $scope, URLS, REST_ROUTES, navigation_state, 
                                  productorService, ToastCommons, us, contextPurchaseService, contextCatalogObserver) {
		
        $log.debug('EmprenController ..... ');
		//navigation_state.goMakersTab();
        

		$scope.urlBase = URLS.be_base;
        $scope.productores = [];
        $scope.productor = {};

		// /////////////// Eventos


		// ///////////////



		function callEmprendedores() {
			$log.debug("---callEmprendedor ---");
            contextCatalogObserver.observe(function(){
                productorService.getProductores()
                    .then(function(response) { 
                        var idProductor = contextPurchaseService.getCatalogContext();
                        $scope.productores = response.data; 
                        console.log($scope.productores, idProductor);
                        $scope.productor = $scope.productores.filter(function(p){ return p.idProductor === parseInt(idProductor);})[0];
                })
            })
		}


		callEmprendedores();

	}
})();
