(function() {
	'use strict';
    
  angular.module('chasqui').controller('NodesCtrl', NodesCtrl);
    
  function NodesCtrl(navigation_state, contextCatalogObserver, contextPurchaseService, agrupationTypeVAL, $scope, 
                     $rootScope, $log, usuario_dao, nodeService){
    
    $log.debug("controler NodesCtrl");
    $scope.nodes = [];

    function toTop(){
      window.scrollTo(0,0);
    }

    ///////////////////////////////////////
      
    // Privado
      
    //////////////////////////////////////////
      
    $rootScope.$on('nodes-information-actualized', function(event) {
      $log.debug("nodes-information-actualized");
      init();
    });
    
    $rootScope.$on('new-node', function(event) {
      $log.debug("new-node");
      init();
    });
    
    $rootScope.$on('exit-node', function(event) {
      $log.debug("exit-node");
      init();
    });
      
      
    /////////////////// INIT ////////////////////

    function init(){
      $log.debug("init nodos");
      if(usuario_dao.isLogged()){
        contextCatalogObserver.observe(function(){
          contextPurchaseService.getAgrupations().then(function(agrupations_dao_int){
            $scope.nodes = agrupations_dao_int.getAgrupationsByType(contextPurchaseService.getCatalogContext(), agrupationTypeVAL.TYPE_NODE);
            console.log($scope.nodes);
            $scope.nodes = $scope.nodes.map(function(g){
              g.alias = g.alias.length > 40? g.alias.slice(0,40) + "..." : g.alias;
              g.descripcion = g.descripcion && g.descripcion.length > 60? g.descripcion.slice(0,60) + "..." : g.descripcion;
              return g;
            });
            $scope.nodes.forEach(function(node) {
              if(node.esAdministrador){
                nodeService.getNodeRequests(node.id)
                .then(function(response){
                  node.requests = response.data.filter(function(r){return r.estado == "solicitud_pertenencia_nodo_enviado"});
                })
              }
            });

            $rootScope.$broadcast('nodes-are-loaded', $scope.nodes);

            toTop();
          });
        });  
      }
      navigation_state.goMyNodesTab();
    }

    init();

  }
    
})();