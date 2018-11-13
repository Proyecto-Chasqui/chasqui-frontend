angular.module('chasqui').directive('chqStamps',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqStampsCtrl',
      scope:{
      	stamps: '@?'
      },
      templateUrl: 'app/comercio/catalogo/productCard/sellos/chqStamps.html'
    }
});