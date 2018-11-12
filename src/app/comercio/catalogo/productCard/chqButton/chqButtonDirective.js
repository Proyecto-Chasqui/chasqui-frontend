angular.module('chasqui').directive('chqButton',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqButtonCtrl',
      transclude: true,
      scope:{
      	color: '@?',
        text: '@?'
      },
      templateUrl: 'app/comercio/catalogo/productCard/chqButton/chqButton.html'
    }
});