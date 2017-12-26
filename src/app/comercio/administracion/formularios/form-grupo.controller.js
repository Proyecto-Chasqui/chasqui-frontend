(function() {
  'use strict';

  angular.module('chasqui').controller('FormGrupoController',
    FormGrupoController);

  /**
   * @ngInject Formulario para crear un grupo
   */
  function FormGrupoController($log, $scope, $state, gccService, StateCommons, us, contextoCompraService, usuario_dao) {
    $log.debug("controler FormGrupoController", $state.params);
    var vm = this;

    vm.grupo;
    vm.user = usuario_dao.getUsuario();
    // la direccion del grupo es la misma que la del usuairio que lo
    // administra
    vm.isDireccionUsuario = true;


    if (us.isUndefinedOrNull($state.params.grupo)) {
      vm.isEdit = false;
    } else {
      vm.isEdit = true;
      vm.grupo = $state.params.grupo;
    }

    vm.guardar = function() {
      if (vm.isEdit) {
        callEditarGrupo();
      } else {
        callGuardarGrupo();
      }
    }

    var callGuardarGrupo = function() {
      $log.debug("guardar grupo", vm.grupo);

      function doOk(response) {
        $log.debug("respuesta guardar grupo ", response);
       
        contextoCompraService.refresh();
        // TODO: guardar el id del grupo creado
        
        $state.go("lista-grupos");
          
      }

      gccService.nuevoGrupo(vm.grupo).then(doOk)
    }

    var callEditarGrupo = function() {
      $log.debug("editar grupo", vm.grupo);

      function doOk(response) {       
        contextoCompraService.refresh();
        $state.go("lista-grupos");
      }
      //alias, idDomicilio, telefono, calle, numero, codigoPostal, localidad, provincia , token 
      var params = {}
      params.alias = vm.grupo.alias
      params.descripcion = vm.grupo.descripcion
      gccService.editarGrupo(vm.grupo.idGrupo, params).then(doOk)
    }
  }

})();
