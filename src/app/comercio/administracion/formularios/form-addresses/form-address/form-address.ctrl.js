(function() {
  'use strict';

  angular.module('chasqui').controller('FormAddressController',
    FormAddressController);

  /*
   *  Formulario para direccion */
  function FormAddressController($log, $scope, $mdDialog) {

    $log.debug("FormAddressController", $scope.address);

    
    $scope.aliasValido = false;
    $scope.calleValida = false;
    $scope.alturaValida = false;
    $scope.localidadValida = false;
    $scope.latitudValida = false;
    $scope.longitudValida = false;

    
    //Muestra un alert simple, puede cambiarse para levantar
    //mensaje mas complejo y amigable definiendo una pagina HTML.
    function showAlert(ev, mensaje) {
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#mappopupContainer')))
        .clickOutsideToClose(true)
        .title('Ayuda')
        .htmlContent(mensaje)
        .ok('OK')
        .targetEvent(ev)
      );
    };

    $scope.mostrarAyuda = function(ev) {
      var mensaje = '<br>' +
        '<div align="center">Requisitos para Guardar una dirección</div>' +
        '<br>' +
        '<li> Se debe almenos Buscar o Marcar la dirección. </li>' +
        '<li> Se debe confirmar la posición en alguna de las opciones previamente mencionadas. </li>' +
        '<li> Todos los campos con " * " deben ser completados. </li>';
      showAlert(ev, mensaje);
    };
  }



  // ///// TODO: ver cuando este para asociar a una grupo
  /*
  var guardarDireccionGrupo = function() {
  	$log.debug("guardar domicilio al grupo", $scope.address);


  	function doOk(response) {
  		$log.debug("respuesta guardar domicilio ", response);

  		// TODO: en realidad la navegacion depende de donde vino
  		$state.go("catalog.userGroups");
  	}

  	perfilService.direccionGrupo(1, $scope.address).then(doOk);
  }*/

})();
