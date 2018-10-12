angular.module('chasqui').directive('chqProductDescription',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqProductDescriptionCtrl',
      scope:{
          description: '@'
      },
      templateUrl: 'app/comercio/catalogo/productCard/productDescription/chqProductDescription.html'
    }
});
