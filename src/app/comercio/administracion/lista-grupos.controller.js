(function() {
	'use strict';

	angular.module('chasqui').controller('ListaGruposController',
		ListaGruposController);

	
	function ListaGruposController($log, $scope, $state, contextCatalogObserver,
		dialogCommons, ToastCommons, gccService, URLS, agrupationTypeVAL,
        us, usuario_dao, navigation_state, contextPurchaseService, contextAgrupationsService) {

		$log.debug("controler ListaGruposController");
		navigation_state.goMyGroupsTab();
        
		$scope.urlBase = URLS.be_base;
        $scope.groups = [];
        $scope.selectedGroup = null;
        $scope.selectedIndexGrupo = 0;
        $scope.newGroup = newGroup;
        
        /////////////////// INIT ////////////////////
        
        function init(){
            callLoadGrupos();
        }
        
        init();
        
        ///////////////////////////////////////
        
        function newGroup(){
            
            function doOk(newGroup){
                contextAgrupationsService.reset(contextPurchaseService.getCatalogContext());
                init();
            }
            
			dialogCommons.newGroup(doOk);
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
		}
        
        
        //////////////////////////////////////////
		$scope.$on('group-information-actualized', function(event) {
            init();
        });
        
	}

})();
