angular.module('chasqui').directive('chqPrincipalProductImage',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqPrincipalProductImageCtrl',
      transclude: true,
      scope:{
          image: '@',
          texto: '@'
      },
      templateUrl: 'app/comercio/catalogo/productCard/principalProductImage/chqPrincipalProductImage.html'
    }
});
