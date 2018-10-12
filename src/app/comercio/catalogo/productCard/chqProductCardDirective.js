angular.module('chasqui').directive('chqProductCard',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqProductCardCtrl',
      transclude: true,
      scope:{
      },
      templateUrl: 'app/comercio/catalogo/productCard/product-card.html'
    }
});
