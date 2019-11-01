angular.module('chasqui').directive('openNodes', [
  function(){
    return {
      restrict: 'E',
      controller: 'OpenNodesController',
      scope: {
        nodes: '=nodes'
      },
      templateUrl: 'app/comercio/administracion/nodes-tab/openNodes.tmpl.html'
    };
  
}]);