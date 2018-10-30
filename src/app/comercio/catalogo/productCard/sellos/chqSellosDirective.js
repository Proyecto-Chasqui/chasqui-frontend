angular.module('chasqui').directive('chqSellos',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqSellosCtrl',
      scope:{
      	collection: '='
      },
      templateUrl: 'app/comercio/catalogo/productCard/sellos/chqSellos.html'
    }
});