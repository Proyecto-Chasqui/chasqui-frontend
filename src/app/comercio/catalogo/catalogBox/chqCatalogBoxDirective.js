angular.module('chasqui').directive('chqCatalogBox',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqCatalogBoxCtrl',
      transclude: true,
      scope:{
      },
      templateUrl: 'app/comercio/catalogo/catalogBox/catalog-box.html'
    }
});
