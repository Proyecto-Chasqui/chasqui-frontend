(function() {
  'use strict';

  angular.module('chasqui').controller('GroupsController', GroupsController);

  
  function GroupsController($scope, $stateParams, contextCatalogObserver, contextPurchaseService, agrupationTypeVAL) {

    $scope.groups = [];

    ///////////////////////////////////////

      
    // Privado
      
    //////////////////////////////////////////
      
    $scope.$on('group-information-actualized', function(event) {
        init();
    });
      
      
    /////////////////// INIT ////////////////////

    function init(){
        contextCatalogObserver.observe(function(){
            contextPurchaseService.getAgrupations().then(function(agrupationsInt){
                $scope.groups = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(), agrupationTypeVAL.TYPE_GROUP);
            });
        })
    }

    init();

  }

})();
