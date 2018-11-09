angular.module('chasqui').directive('chqBoxContainer',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqBoxContainerCtrl',
      transclude: true,
      scope:{
      	direccion: '=',
        alto: '='
      },
      templateUrl: 'app/comercio/catalogo/productCard/boxContainer/chqBoxContainer.html'
    }
});