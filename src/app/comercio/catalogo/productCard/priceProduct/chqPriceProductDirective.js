angular.module('chasqui').directive('chqPriceProduct',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqPriceProductCtrl',
      scope:{
          entero: '='
      },
      templateUrl: 'app/comercio/catalogo/productCard/priceProduct/chqPriceProduct.html'
    }
});
