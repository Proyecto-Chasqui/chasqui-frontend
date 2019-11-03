(function() {
  'use strict';

  angular.module('chasqui').controller('NodeController', NodeController);

  
  function NodeController($scope, $rootScope, $stateParams, contextCatalogObserver, contextPurchaseService, agrupationTypeVAL,
                           $interval, $state,vendedorService, $log) {

    $scope.node = {};

    ///////////////////////////////////////
    
    function toTop(){
      window.scrollTo(0,0);
    }
      
    // Privado
      
    //////////////////////////////////////////
      
    $scope.$on('node-information-actualized', function(event) {
        init();
    });
      
    $rootScope.$on('node-order-cancelled', function(event) {
        init();
    });
      
    /////////////////// INIT ////////////////////

    function init(){
      contextCatalogObserver.observe(function(){
        contextPurchaseService.getAgrupations().then(function(agrupations_dao_int){
          var nodes = agrupations_dao_int.getAgrupationsByType(contextPurchaseService.getCatalogContext(), agrupationTypeVAL.TYPE_NODE);
          $scope.node = nodes[$stateParams.nodeId];
          $rootScope.$broadcast('node-is-loaded', $scope.node);
          toTop();
        });
      })
    }

    init();

  }

})();
