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
    $scope.addressDefined = false;
    $scope.validated = false;
    $scope.validateInput = validateInput;
    

    
    ////////////////////////////////////////////////
    
    
    function save() {
      callNewNode();
    }

    function callNewNode() {

      function doOk(response) {
          $log.debug("respuesta guardar nodo ", response);
          toastr.success("El administrador del catálogo se comunicará con vos para gestionar los detalles de su aprobación para que puedas empezar a comprar.","Solicitud enviada! ");
          $state.go('catalog.userNodes.all');
      }

      if(formValidated()){
        $scope.node.idVendedor = contextPurchaseService.getCatalogContext();
        $scope.node.tipoNodo = $scope.tipoNodo? "NODO_ABIERTO" : "NODO_CERRADO";
        $log.debug("guardar nodo", $scope.node);
        nodeService.nuevoNodo($scope.node).then(doOk);
      }
    }


    function validateInput(input){
      console.log($scope.node[input]);
      if($scope.validated  && !($scope.node[input])){
        return "ch-error-input";
      } else {
        return "";
      }
    }

    function formValidated(){
      $scope.validated = true;
      const addressDefined = $scope.node.nombreNodo && $scope.node.nombreNodo.length > 0;
      const barrioDefined = $scope.node.barrio && $scope.node.barrio.length > 0;
      const domicilioDefined = $scope.node.idDomicilio;

      return addressDefined && barrioDefined && domicilioDefined;
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