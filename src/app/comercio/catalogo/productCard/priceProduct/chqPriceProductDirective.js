angular.module('chasqui').directive('chqPriceProduct',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqPriceProductCtrl',
      scope:{
          intPart: '=',
          decimalPart: '@'
      },
      templateUrl: 'app/comercio/catalogo/productCard/priceProduct/chqPriceProduct.html'
    }
});
