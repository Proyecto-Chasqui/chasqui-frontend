(function() {
  'use strict';

  angular.module('chasqui').controller('NewNodeCtrl', NewNodeCtrl);

  /**
  * @ngInject
  */
  function NewNodeCtrl($log, $scope, nodeService, perfilService, contextPurchaseService, toastr, $state) {
      
    $scope.node = {};
    $scope.save = save;
    $scope.directions = [];
    $scope.tipoNodo = false;

    
    ////////////////////////////////////////////////
    
    
    function save() {
      callNewNode();
    }

    function callNewNode() {

      function doOk(response) {
          $log.debug("respuesta guardar nodo ", response);
          toastr.success("Cuando el administrador del catalogo lo apruebe se podrá usar para comprar","Nuevo nodo creado!");
          $state.go('catalog.userNodes.all');
      }

      $scope.node.idVendedor = contextPurchaseService.getCatalogContext();
      $scope.node.tipoNodo = $scope.tipoNodo? "NODO_ABIERTO" : "NODO_CERRADO";
      $log.debug("guardar nodo", $scope.node);
      nodeService.nuevoNodo($scope.node).then(doOk)
    }

    // Inicialización

    function init(){

			function doOk(response) {
				$log.debug('call addresses response ', response);
				$scope.directions = response.data;
			}

			perfilService.verDirecciones().then(doOk);
    }

    init();
  }

})();