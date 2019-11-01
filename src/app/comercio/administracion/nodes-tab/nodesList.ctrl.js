(function() {
  'use strict';

  angular.module('chasqui').controller('NodesListCtrl', NodesListCtrl);

  function NodesListCtrl($log, $scope, $rootScope, dialogCommons, contextPurchaseService, nodeService) {

    // Interfaz

    $scope.showOptions = [];
    $scope.openRequests = $scope.openRequests;
    $scope.showOptionsForNode = showOptionsForNode;
    $scope.isLoggedUserNodeAdmin = isLoggedUserNodeAdmin;

    // Implementación


    function showOptionsForNode(nodeIndex){
      $scope.showOptions = $scope.showOptions.map(function(o,i){return i == nodeIndex && !o});
    }

    function isLoggedUserNodeAdmin(node){
      return node.esAdministrador;
    }

      
    function toTop(){
      window.scrollTo(0,0);
    }

    // Inicialización
    function init(){
      nodeService.openRequests(contextPurchaseService.getCatalogContext())
      .then(function(response){
        $scope.openRequests = response.data.filter(function(r){
          return r.estado == "solicitud_nodo_en_gestion";
        });
      })
      $scope.showOptions = $scope.nodes.map(function(n){return false});
      toTop();
    }

    $rootScope.$on('nodes-are-loaded', init);

    init();

  }

})();
