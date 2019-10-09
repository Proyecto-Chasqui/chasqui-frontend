(function() {
	'use strict';
    
  angular.module('chasqui').controller('NodesCtrl', NodesCtrl);
    
  function NodesCtrl(navigation_state, contextCatalogObserver, contextPurchaseService, agrupationTypeVAL, $scope, 
                     $rootScope, $log){
    
    $log.debug("controler NodesCtrl");
    $scope.nodes = [];

    function toTop(){
      window.scrollTo(0,0);
    }

    ///////////////////////////////////////
      
    // Privado
      
    //////////////////////////////////////////
      
    $rootScope.$on('nodes-information-actualized', function(event) {
        init();
    });
    
    $rootScope.$on('new-node', function(event) {
        init();
    });
    
    $rootScope.$on('exit-node', function(event) {
        init();
    });
      
      
    /////////////////// INIT ////////////////////

    function init(){
      $log.debug("init nodos");
      contextCatalogObserver.observe(function(){
        contextPurchaseService.getAgrupations().then(function(agrupationsInt){
          $scope.nodes = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(), agrupationTypeVAL.TYPE_NODE);
          $scope.nodes = $scope.nodes.map(function(g){
            g.alias = g.alias.length > 40? g.alias.slice(0,40) + "..." : g.alias;
            g.descripcion = g.descripcion && g.descripcion.length > 60? g.descripcion.slice(0,60) + "..." : g.descripcion;
            return g;
          });
          $rootScope.$broadcast('nodes-are-loaded', $scope.nodes);
          toTop();
        });
      });  
      navigation_state.goMyNodesTab();
    }

    init();

  }
    
})();