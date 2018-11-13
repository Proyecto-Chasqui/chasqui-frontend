angular.module('chasqui').directive('chqButton',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqButtonCtrl',
      transclude: true,
      scope:{
      	color: '@?',
        textColor: '@?',
        text: '@?'
      },
      templateUrl: 'app/comercio/catalogo/productCard/chqButton/chqButton.html'
    }
});