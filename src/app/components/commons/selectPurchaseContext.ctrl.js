(function() {
	'use strict';
    
    	angular
		.module('chasqui')
		.controller('SelectPurchaseContextCtrl', SelectPurchaseContextCtrl);
    
	function SelectPurchaseContextCtrl($scope, contextPurchaseService, agrupationTypeVAL, contextCatalogObserver, 
                                     $mdDialog, addProductService, $rootScope, variety, $timeout, contextOrdersService,
                                     contextAgrupationsService) {
    
    $scope.grupos = [];
    $scope.agrupationSelected = {};
    $scope.showSelector = showSelector;
    $scope.setGroupAsAgrupationSelected = setGroupAsAgrupationSelected;
    $scope.setPersonalAsAgrupationSelected = setPersonalAsAgrupationSelected;
    $scope.isSelectedOrderConfirmed = false;

    function init(){
      contextCatalogObserver.observe(function(){
        $scope.agrupationSelected = {
          idGrupo: contextPurchaseService.getAgrupationContextId(),
          type: agrupationTypeVAL.TYPE_PERSONAL
        }
        contextPurchaseService.getAgrupations().then(function(agrupationsInt) {
          $scope.grupos = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(), 
                                                              agrupationTypeVAL.TYPE_GROUP);
        });
        
        checkSelectedOrderConfirmed();
      })
    }

    init();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function cambiarContexto() {
      console.log("Cambio de contexto:", $scope.agrupationSelected);
      contextPurchaseService.setContextByAgrupation($scope.agrupationSelected);
      $rootScope.$emit('contexto.compra.cambia.grupo', $scope.agrupationSelected);
    }

    function showSelector(){
        return $scope.grupos.length > 0;
    }

    function setGroupAsAgrupationSelected(idGrupo){
        $scope.agrupationSelected.idGrupo = idGrupo;
        $scope.agrupationSelected.type = agrupationTypeVAL.TYPE_GROUP;
        checkSelectedOrderConfirmed();
    }

    function setPersonalAsAgrupationSelected(idGrupo){
        $scope.agrupationSelected.idGrupo = idGrupo;
        $scope.agrupationSelected.type = agrupationTypeVAL.TYPE_PERSONAL;
        checkSelectedOrderConfirmed();
    }
    
    function checkSelectedOrderConfirmed(){
      contextAgrupationsService.getAgrupation(contextPurchaseService.getCatalogContext(), 
                                              $scope.agrupationSelected.idGrupo, 
                                              $scope.agrupationSelected.type).then(function(agrupation){
        var orderSelected = contextOrdersService.getOrder(contextPurchaseService.getCatalogContext(), 
                                                          agrupation.idPedidoIndividual, 
                                                          $scope.agrupationSelected.type);
        $scope.isSelectedOrderConfirmed = orderSelected.estado == "CONFIRMADO";        
      })
    }
    
    $scope.okAction = function(){
      cambiarContexto();
      $mdDialog.hide();
      $timeout(function() {
        addProductService(variety);
		  }, 700);
        
    }


    $scope.cancelAction = function(){
        $mdDialog.hide();
    }
        
	} 
    
})();         