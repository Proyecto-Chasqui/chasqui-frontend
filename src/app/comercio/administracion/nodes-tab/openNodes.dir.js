angular.module('chasqui').directive('openNodes', openNodes);

function openNodes(){

  return {
    restrict: 'E',
    controller: 'OpenNodesController',
    scope: {
      nodes: '=nodes'
    },
    templateUrl: 'app/comercio/administracion/nodes-tab/openNodes.tmpl.html'
  };
  
};