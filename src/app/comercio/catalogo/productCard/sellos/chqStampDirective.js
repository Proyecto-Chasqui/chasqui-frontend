angular.module('chasqui').directive('chqStamp',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqStampCtrl',
      scope:{
      	image: '@',
      	texto: '='
      },
      templateUrl: 'app/comercio/catalogo/productCard/sellos/chqStamp.html'
    }
});