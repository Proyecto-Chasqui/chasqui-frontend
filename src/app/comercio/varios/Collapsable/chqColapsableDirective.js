angular.module('chasqui').directive('chqColapsable',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqColapsableCtrl',
      transclude: true,
      scope:{
        clickOn: '&',
        visible: '&',
        titulo: '@',
        color: '@?',
        ancho: '@?'
      },
      templateUrl: 'app/comercio/varios/Collapsable/chqColapsable.html'
    }
});
