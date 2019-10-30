(function() {
  'use strict';

  angular.module('chasqui').controller('NodesListCtrl', NodesListCtrl);

  function NodesListCtrl($log, $scope, $rootScope, dialogCommons, contextPurchaseService) {

    // Interfaz

    $scope.newNode = newNode;
    $scope.showOptions = [];
    $scope.showOptionsForNode = showOptionsForNode;
    $scope.isLoggedUserNodeAdmin = isLoggedUserNodeAdmin;

    // Implementación

    function newNode(){
      function doOk(newNode){
        contextPurchaseService.refresh().then(function(){
          $rootScope.$emit('new-node');
        });
      }

      dialogCommons.newNode(doOk);
    }

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
      $scope.showOptions = $scope.nodes.map(function(n){return false});
      toTop();
    }

    $rootScope.$on('nodes-are-loaded', init);

    init();

  }

})();
