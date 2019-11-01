(function() {
  'use strict';

  angular.module('chasqui').controller('EditNewNodeCtrl', EditNewNodeCtrl);

  /**
  * @ngInject
  */
  function EditNewNodeCtrl($log, $scope, nodeService, perfilService, contextPurchaseService, toastr, $state) {
      
    $scope.node = {};
    $scope.save = save;
    $scope.directions = [];
    $scope.tipoNodo = false;

    
    ////////////////////////////////////////////////
    
    
    function save() {
      callSaveChanges();
    }

    function callSaveChanges() {

      function doOk(response) {
          $log.debug("respuesta guardar nodo ", response);
          toastr.success("Cuando el administrador del catalogo lo apruebe se podrá usar para comprar","Solicitud modificada");
          $state.go('catalog.userNodes.all');
      }

      $scope.node.idVendedor = contextPurchaseService.getCatalogContext();
      $scope.node.tipoNodo = $scope.tipoNodo? "NODO_ABIERTO" : "NODO_CERRADO";
      console.log("guardar nodo", $scope.node);
      $log.debug("guardar nodo", $scope.node);
      nodeService.editarSolicitud($scope.node).then(doOk)
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
            idVendedor : 2,
            nombreNodo : $scope.openRequests[0].nombreNodo,
            descripcion : $scope.openRequests[0].descripcion,
            idDomicilio : $scope.openRequests[0].domicilio.id,
            barrio : $scope.openRequests[0].barrio,
            descripcion: $scope.openRequests[0].descripcion,
          }

          $scope.tipoNodo = $scope.openRequests[0].tipoNodo == "NODO_ABIERTO";
          console.log($scope.node);
        }
      })
    }

    init();
  }

})();