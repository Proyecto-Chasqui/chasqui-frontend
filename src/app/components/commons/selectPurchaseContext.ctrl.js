(function() {
	'use strict';
    
    	angular
		.module('chasqui')
		.controller('SelectPurchaseContextCtrl', SelectPurchaseContextCtrl);
    
	function SelectPurchaseContextCtrl($scope, contextPurchaseService, agrupationTypeVAL, contextCatalogObserver, 
                                     $mdDialog, addProductService, $rootScope, variety, $timeout, contextOrdersService,
                                     contextAgrupationsService, vendedorService, $log) {
    
    $scope.grupos = [];
    $scope.nodes = [];
    $scope.agrupationSelected = {};
    $scope.showSelector = showSelector;
    $scope.setPersonalAsAgrupationSelected = setPersonalAsAgrupationSelected;
    $scope.setGroupAsAgrupationSelected = setGroupAsAgrupationSelected;
    $scope.setNodeAsAgrupationSelected = setNodeAsAgrupationSelected;    
    $scope.isSelectedOrderConfirmed = false;
    $scope.canSelectAgrupation = false;
    

    function init(){
      contextCatalogObserver.observe(function(){
        $scope.agrupationSelected = {
          id: -1,
          type: agrupationTypeVAL.TYPE_PERSONAL
        }
        vendedorService.obtenerConfiguracionVendedor().then(
          function(response){
            var few = response.data.few;
            contextPurchaseService.getAgrupations()
            .then(function(agrupations_dao_int) {
              if(few.gcc){
                $scope.grupos = agrupations_dao_int.getAgrupationsByType(contextPurchaseService.getCatalogContext(),
                                                                        agrupationTypeVAL.TYPE_GROUP);
              }
              if(few.nodos){
                $scope.nodes = agrupations_dao_int.getAgrupationsByType(contextPurchaseService.getCatalogContext(),
                                                                            agrupationTypeVAL.TYPE_NODE);
              }
              if(!showSelector()){
                $scope.okAction();
              }
            });
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
      $rootScope.$broadcast('contexto.compra.cambia.grupo', $scope.agrupationSelected);
    }

    function showSelector(){
      return ($scope.grupos.length + $scope.nodes.length) > 0;
    }

    function setPersonalAsAgrupationSelected(idGrupo){
        $scope.agrupationSelected.id = idGrupo;
        $scope.agrupationSelected.type = agrupationTypeVAL.TYPE_PERSONAL;
        checkSelectedOrderConfirmed();
    }

    function setGroupAsAgrupationSelected(idGrupo){
        $scope.agrupationSelected.id = idGrupo;
        $scope.agrupationSelected.type = agrupationTypeVAL.TYPE_GROUP;
        checkSelectedOrderConfirmed();
    }
    

    function setNodeAsAgrupationSelected(idGrupo){
      $scope.agrupationSelected.id = idGrupo;
      $scope.agrupationSelected.type = agrupationTypeVAL.TYPE_NODE;
      checkSelectedOrderConfirmed();
  }
  
    function checkSelectedOrderConfirmed(){
      $scope.canSelectAgrupation = $scope.agrupationSelected.type == agrupationTypeVAL.TYPE_PERSONAL;
      $scope.isSelectedOrderConfirmed = !$scope.canSelectAgrupation;
      if($scope.agrupationSelected.id != -1 && $scope.agrupationSelected.type != agrupationTypeVAL.TYPE_PERSONAL){
        contextOrdersService.ensureOrders(contextPurchaseService.getCatalogContext(), 
                                          $scope.agrupationSelected.type).then(function(){
          contextAgrupationsService.getAgrupation(contextPurchaseService.getCatalogContext(), 
                                                  $scope.agrupationSelected.id, 
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