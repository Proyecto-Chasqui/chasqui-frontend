(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('ContextoCompraController', ContextoCompraController);

  /**
   * Lista lateral de productos del pedido seleccionado
   */
  function ContextoCompraController($rootScope, $log, $scope, contextPurchaseService, agrupationTypeVAL,
                                       contextCatalogObserver, contextOrdersService) {

    $log.debug("ContextoCompraController ..... ");

    $scope.grupos = [];
    $scope.nodes = [];    
    $scope.agrupationSelected = {};
    $scope.cambiarContexto = cambiarContexto;
    $scope.showSelector = showSelector;
    $scope.setPersonalAsAgrupationSelected = setPersonalAsAgrupationSelected;
    $scope.setGroupAsAgrupationSelected = setGroupAsAgrupationSelected;
    $scope.setNodeAsAgrupationSelected = setNodeAsAgrupationSelected;
    

    function init(){
      contextCatalogObserver.observe(function(){
        $scope.agrupationSelected = {
          id: contextPurchaseService.getAgrupationContextId(),
          type: contextPurchaseService.getAgrupationContextType()
        }
        contextPurchaseService.getAgrupations().then(function(agrupations_dao_int) {
          $scope.grupos = agrupations_dao_int.getAgrupationsByType(contextPurchaseService.getCatalogContext(), 
                                                                   agrupationTypeVAL.TYPE_GROUP);                                                    
          $scope.nodes = agrupations_dao_int.getAgrupationsByType(contextPurchaseService.getCatalogContext(), 
                                                                   agrupationTypeVAL.TYPE_NODE);
          if(!showSelector()){
            // load personal order
            $scope.agrupationSelected.id = 0;
            $scope.agrupationSelected.type = agrupationTypeVAL.TYPE_PERSONAL;
            contextPurchaseService.setContextByAgrupation($scope.agrupationSelected);
            contextOrdersService.ensureOrders(contextPurchaseService.getCatalogContext(), 
                                              agrupationTypeVAL.TYPE_PERSONAL).then(function(){
              $rootScope.$emit('ch-context-agrupation-change', $scope.agrupationSelected);
            })
          }
        });
      })
    }

    init();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function cambiarContexto() {
      $log.debug("Cambio de contexto:", $scope.agrupationSelected);
      contextPurchaseService.setContextByAgrupation($scope.agrupationSelected);
      $rootScope.$emit('ch-context-agrupation-change', $scope.agrupationSelected);
    }

    function showSelector(){
        return ($scope.grupos.length + $scope.nodes.length) > 0;
    }

    function setPersonalAsAgrupationSelected(){
        $scope.agrupationSelected.type = agrupationTypeVAL.TYPE_PERSONAL;
    }

    function setGroupAsAgrupationSelected(){
        $scope.agrupationSelected.type = agrupationTypeVAL.TYPE_GROUP;
    }

    function setNodeAsAgrupationSelected(){
        $scope.agrupationSelected.type = agrupationTypeVAL.TYPE_NODE;
    }

    $rootScope.$on('contexto.compra.cambia.grupo', function() {
      init();
    });

        
  }
})();
