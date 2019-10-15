(function() {
  'use strict';

  angular.module('chasqui').controller('NodesListCtrl', NodesListCtrl);

  function NodesListCtrl($log, $scope, $rootScope, dialogCommons, contextPurchaseService) {

    // Interfaz

    $scope.newNode = newNode;


    // Implementación

    function newNode(){

      function doOk(newGroup){
        contextPurchaseService.refresh().then(function(){
          newGroupCreated = true;
          $rootScope.$emit('new-node');
        });
      }

      dialogCommons.newNode(doOk);
    }


    // Inicialización
    function init(){
        
    }

    init();

  }

})();
