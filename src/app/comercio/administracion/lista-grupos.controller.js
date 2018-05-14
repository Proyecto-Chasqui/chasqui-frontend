(function() {
	'use strict';

	angular.module('chasqui').controller('ListaGruposController',
		ListaGruposController);

	
	function ListaGruposController($log, $scope, $state, contextCatalogObserver,
		dialogCommons, ToastCommons, gccService, URLS, agrupationTypeVAL,
        us, usuario_dao, navigation_state, contextPurchaseService) {

		$log.debug("controler ListaGruposController");
		navigation_state.goMyGroupsTab();
        
		var vm = this;
        
		$scope.urlBase = URLS.be_base;
        $scope.groups = [];
        $scope.selectedGroup = null;
        $scope.selectedIndexGrupo = 0;
        $scope.newGroup = newGroup;
        $scope.setContextByAgrupation = contextPurchaseService.setContextByAgrupation;
        
        /////////////////// INIT ////////////////////
        
        function init(){
            callLoadGrupos();
        }
        
        init();
        
        ///////////////////////////////////////
        
        function newGroup(){
			$state.go('catalog.form-grupo');	
        }

        
        function callLoadGrupos() {
			$log.debug("--- find grupos--------");
            contextCatalogObserver.observe(function(){
                contextPurchaseService.getAgrupations().then(function(agrupationsInt){
                    contextPurchaseService.getSelectedAgrupation().then(function(selectedAgrupation){
                        $scope.groups = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(), agrupationTypeVAL.TYPE_GROUP);
                        setTabSeleccionado(selectedAgrupation);
                    })
                });
            })
		}
        
        
		function setTabSeleccionado(selectedAgrupation) {
			$scope.selectedIndexGrupo = $scope.groups.indexOf(selectedAgrupation);
            $scope.selectedIndexGrupo = $scope.selectedIndexGrupo == -1? 0 : $scope.selectedIndexGrupo;
			$scope.selectedGroup = $scope.groups[$scope.selectedIndexGrupo];
            contextPurchaseService.setContextByAgrupation($scope.selectedGroup);
		}
        
        
        //////////////////////////////////////////
        
        // Creo que lo que sigue no depende de este controlador
		/*
		$scope.$on('quito-miembro-grupo',
			function(event) {
				callLoadGrupos();
			});
		*/
        

		// ///////////
		// ///// REST

		function callCrearPedidoGrupal(grupo) {
            contextCatalogObserver.observe(function(){
                function doOk(response) {
                    $log.debug('Crear pedido en el grupo');
                    ToastCommons.mensaje(us.translate('NUEVO_PEDIDO'));
                }

                var params = {};
                params.idGrupo = grupo.idGrupo;
                params.idVendedor = contextPurchaseService.getCatalogContext();

                gccService.crearPedidoGrupal(params).then(doOk);
            })
		}


		
        
	}

})();
