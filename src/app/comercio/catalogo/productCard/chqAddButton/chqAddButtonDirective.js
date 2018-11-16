angular.module('chasqui').directive('chqAddButton',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqAddButtonCtrl',
      transclude: true,
      scope:{
      	color: '@?',
        textColor: '@?',
        text: '@?',
        title: '@?'
      },
      templateUrl: 'app/comercio/catalogo/productCard/chqAddButton/chqAddButton.html'
    }
});