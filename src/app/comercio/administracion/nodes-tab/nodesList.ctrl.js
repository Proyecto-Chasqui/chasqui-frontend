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
          newGroupCreated = true;
          $rootScope.$emit('new-node');
        });
      }

      dialogCommons.newNode(doOk);
    }

    function showOptionsForNode(nodeIndex){
      $scope.showOptions = $scope.showOptions.map(function(o,i){return i == nodeIndex && !o});
      console.log($scope.showOptions);
    }

    function isLoggedUserNodeAdmin(node){
      return node.esAdministrador;
    }


    // Inicialización
    function init(){
      $scope.showOptions = $scope.nodes.map(function(n){return false});
      console.log($scope.showOptions);
    }

    $rootScope.$on('nodes-are-loaded', init);

    init();

  }

})();
