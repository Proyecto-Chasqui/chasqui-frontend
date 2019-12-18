(function() {
  'use strict';

  angular.module('chasqui').controller('EditNewNodeCtrl', EditNewNodeCtrl);

  /**
  * @ngInject
  */
  function EditNewNodeCtrl($log, $scope, nodeService, perfilService, contextPurchaseService, toastr, $state) {
      
    $scope.node = {};
    $scope.save = save;
    $scope.cancel = cancel;
    $scope.directions = [];
    $scope.tipoNodo = false;
    $scope.validateInput = validateInput;

    
    ////////////////////////////////////////////////
    
    
    function save() {
      callSaveChanges();
    }

    function callSaveChanges() {

      function doOk(response) {
          $log.debug("respuesta guardar nodo ", response);
          toastr.success("El administrador del catálogo se comunicará con vos para gestionar los detalles de su aprobación para que puedas empezar a comprar.","Solicitud modificada!");
          $state.go('catalog.userNodes.all');
      }

      if(formValidated()){
        $scope.node.tipoNodo = $scope.tipoNodo? "NODO_ABIERTO" : "NODO_CERRADO";
        $log.debug("guardar nodo", $scope.node);
        nodeService.editarSolicitud($scope.node).then(doOk);
      }
    }

    function cancel(){
      nodeService.cancelarNuevoNodo({
        idSolicitud: $scope.node.idSolicitud,
        idVendedor: contextPurchaseService.getCatalogContext()
      })
      .then(function(){
        toastr.success("","Solicitud cancelada");
        $state.go('catalog.userNodes.all');
      })
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
      
      nodeService.openRequests(contextPurchaseService.getCatalogContext())
      .then(function(response){
        $scope.openRequests = response.data.filter(function(r){
          return r.estado == "solicitud_nodo_en_gestion";
        });
        if($scope.openRequests.length > 0){
          $scope.node = {
            idSolicitud : $scope.openRequests[0].id,
            idVendedor : contextPurchaseService.getCatalogContext(),
            nombreNodo : $scope.openRequests[0].nombreNodo,
            descripcion : $scope.openRequests[0].descripcion,
            idDomicilio : $scope.openRequests[0].domicilio.id,
            barrio : $scope.openRequests[0].barrio,
          };

          $scope.tipoNodo = $scope.openRequests[0].tipoNodo == "NODO_ABIERTO";
        }
      })
    }

    init();
  }

})();