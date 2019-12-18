(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('ContextoCompraController', ContextoCompraController);

  /**
   * Lista lateral de productos del pedido seleccionado
   */
  function ContextoCompraController($rootScope, $log, $scope, contextPurchaseService, agrupationTypeVAL,
                                       contextCatalogObserver) {

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
        });
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

    $rootScope.$on('contexto.compra.cambia.grupo', function(event, grupo) {
      init();
    });

        
  }
})();
