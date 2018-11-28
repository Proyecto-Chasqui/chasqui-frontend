angular.module('chasqui').directive('chqStampsContainer',
  function(){
    return {
      restrict: 'E',
      transclude: true,
      controller: 'ChqStampsContainerCtrl',
      scope:{
      	direccion: '@?',
        alto: '@?'
      },
      templateUrl: 'app/comercio/catalogo/productCard/sellosContainer/chqStampsContainer.html'
    }
});