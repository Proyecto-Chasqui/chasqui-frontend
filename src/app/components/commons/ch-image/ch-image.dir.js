angular.module('chasqui').directive('chImage',
  function(){
    return {
      restrict: 'E',
      controller: 'ChImageController',
      scope:{
        src: '=',
        alt: '=',
        title: '=',
        width: '=',
        height: '=',
      },
      templateUrl: 'app/components/commons/ch-image/ch-image.tmpl.html'
    }
});
