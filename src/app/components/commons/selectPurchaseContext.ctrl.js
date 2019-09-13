(function() {
	'use strict';
    
    	angular
		.module('chasqui')
		.controller('SelectPurchaseContextCtrl', SelectPurchaseContextCtrl);
    
	function SelectPurchaseContextCtrl($scope, contextPurchaseService, agrupationTypeVAL, contextCatalogObserver, 
                                     $mdDialog, addProductService, $rootScope, variety, $timeout, contextOrdersService,
                                     contextAgrupationsService, vendedorService, $log) {
    
    $scope.grupos = [];
    $scope.agrupationSelected = {};
    $scope.showSelector = showSelector;
    $scope.setGroupAsAgrupationSelected = setGroupAsAgrupationSelected;
    $scope.setPersonalAsAgrupationSelected = setPersonalAsAgrupationSelected;
    $scope.isSelectedOrderConfirmed = false;
    $scope.canSelectAgrupation = false;
    

    function init(){
      contextCatalogObserver.observe(function(){
        $scope.agrupationSelected = {
          idGrupo: -1,
          type: agrupationTypeVAL.TYPE_PERSONAL
        }
        vendedorService.obtenerConfiguracionVendedor().then(
            function(response){
                var few = response.data.few;
                if(few.gcc){
                    contextPurchaseService.getAgrupations().then(function(agrupationsInt) {
                      $scope.grupos = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(),agrupationTypeVAL.TYPE_GROUP);
                    });
                }
            }
        );
      })
    }

    init();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function cambiarContexto() {
      $log.debug("Cambio de contexto:", $scope.agrupationSelected);
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
      $scope.canSelectAgrupation = $scope.agrupationSelected.type == agrupationTypeVAL.TYPE_PERSONAL;
      $scope.isSelectedOrderConfirmed = !$scope.canSelectAgrupation;
      if($scope.agrupationSelected.idGrupo != -1 && $scope.agrupationSelected.type != agrupationTypeVAL.TYPE_PERSONAL){
        contextOrdersService.ensureOrders(contextPurchaseService.getCatalogContext(), 
                                          $scope.agrupationSelected.type).then(function(){
          contextAgrupationsService.getAgrupation(contextPurchaseService.getCatalogContext(), 
                                                  $scope.agrupationSelected.idGrupo, 
                                                  $scope.agrupationSelected.type).then(function(agrupation){
            var orderSelected = contextOrdersService.getOrder(contextPurchaseService.getCatalogContext(), 
                                                              agrupation.idPedidoIndividual, 
                                                              $scope.agrupationSelected.type);
            $scope.isSelectedOrderConfirmed = orderSelected.estado == "CONFIRMADO";
            $scope.canSelectAgrupation = !$scope.isSelectedOrderConfirmed;
          })
        })
      }
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