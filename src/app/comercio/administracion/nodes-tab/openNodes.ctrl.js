(function() {
  'use strict';

  angular.module('chasqui').controller('OpenNodesController', OpenNodesController);

  function OpenNodesController($scope, $rootScope, nodeService, contextCatalogObserver, contextPurchaseService) {

    // Interfaz

    $scope.openNodes = [];
    $scope.requests = [];
    $scope.showOptions = [];

    $scope.sendRequest = sendRequest;
    $scope.cancelRequest = cancelRequest;
    $scope.showOptionsForNode = showOptionsForNode;
    $scope.getFormatedAdress = getFormatedAdress;
    $scope.formatRequestDate = formatRequestDate;


    function sendRequest(node){
      nodeService.sendRequest(contextPurchaseService.getCatalogContext(), node.idNodo)
      .then(init_requests);
    }

    function cancelRequest(request){
      nodeService.cancelRequest(request.id)
      .then(init_requests);
    }

    function showOptionsForNode(nodeIndex){
      $scope.showOptions = $scope.showOptions.map(function(o,i){return i == nodeIndex && !o});
    }

    function getFormatedAdress(node){
      return node.direccionDelNodo.calle+" "+node.direccionDelNodo.altura+", "+node.barrio+", "+node.direccionDelNodo.localidad;
    }

    function formatRequestDate(request){
      return request.fechaCreacion.slice(0,10);
    }
    // Inicialización


    /* 
      Prec: $scope.openNodes initialized
    */
    function init_requests(){
      nodeService.userRequests(contextPurchaseService.getCatalogContext())
      .then(function(response_requests){
        console.log(response_requests.data);
        $scope.requests = response_requests.data.filter(function(r){return r.estado == "solicitud_pertenencia_nodo_enviado"});
        $scope.openNodes = $scope.openNodes.map(function(node){
          node.requested = $scope.requests.reduce(function(r,request){
            console.log(node, node.idNodo == request.nodo.idNodo);
            if(node.idNodo == request.nodo.idNodo){
              node.request = request;
            }
            return r || (node.idNodo == request.nodo.idNodo);
          }, false);
          return node;
        });
        console.log($scope.openNodes);
        console.log($scope.requests);
      })
    }
    
    function init(){
      nodeService.nodosAbiertos(contextPurchaseService.getCatalogContext())
      .then(function(response_nodes){
        console.log($scope.nodes);
        $scope.openNodes = response_nodes.data.filter(function(nodeList){
          return $scope.nodes.reduce(function(r, node){
            console.log(node.id, nodeList.idNodo, (node.id != nodeList.idNodo));
            return r && (node.id != nodeList.idNodo);
          }, true);
        })
        init_requests();
        $scope.showOptions = $scope.nodes.map(function(n){return false});
      })      
    }

    $rootScope.$on('nodes-are-loaded', init);

    init();

  }

})();
