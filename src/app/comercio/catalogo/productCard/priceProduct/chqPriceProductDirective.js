angular.module('chasqui').directive('chqPriceProduct',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqPriceProductCtrl',
      scope:{
          precio: '=',
          tamanho: '=',
      },
      templateUrl: 'app/comercio/catalogo/productCard/priceProduct/chqPriceProduct.html'
    }
});
