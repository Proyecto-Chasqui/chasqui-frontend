(function() {
  'use strict';

  angular.module('chasqui').controller('NewNodeCtrl', NewNodeCtrl);

  /**
  * @ngInject
  */
  function NewNodeCtrl($log, $scope, nodeService, perfilService, isEdit, node, callback, $mdDialog, contextPurchaseService) {
      
    $scope.node = node;
    $scope.isEdit = isEdit;
    $scope.save = save;
    $scope.cancel = cancel;
    $scope.directions = [];
    $scope.tipoNodo = false;

    
    ////////////////////////////////////////////////
    
    
    function cancel(){
        $mdDialog.hide();
    }
    
    
    function save() {
      callNewNode();
    }

    function callNewNode() {

        function doOk(response) {
            $log.debug("respuesta guardar nodo ", response);
            callback($scope.node);
            $mdDialog.hide();
        }

        $scope.node.idVendedor = contextPurchaseService.getCatalogContext();
        $scope.node.tipoNodo = $scope.tipoNodo? "NODO_ABIERTO" : "NODO_CERRADO";
        console.log("guardar nodo", $scope.node);
        $log.debug("guardar nodo", $scope.node);
        nodeService.nuevoNodo($scope.node).then(doOk)
    }

    var callSaveChangesInGroup = function() {
        $log.debug("editar grupo", $scope.node);

        function doOk(response) {       
            $log.debug("editar grupo response", response);
            callback($scope.node);
            $mdDialog.hide();
        }
        
        var params = {
            alias: $scope.node.alias,
            descripcion: $scope.node.descripcion
        }
        
        nodeService.editarGrupo($scope.node.idGrupo, params).then(doOk)
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