angular.module('chasqui').directive('chImage',
  function(){
    return {
      restrict: 'E',
      controller: 'ChImageController',
      scope:{
        src: '=',
        alt: '=',
        description: '=',
        width: '=',
        height: '=',
      },
      templateUrl: 'app/components/commons/ch-image/ch-image.tmpl.html'
    }
});
