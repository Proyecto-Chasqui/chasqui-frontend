(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('ArrepentimientoController', ArrepentimientoController);

    /** @ngInject */
    function ArrepentimientoController($scope, $window, toastr, $stateParams, $state, soporteService, usuario_dao, perfilService) {
      var vm = $scope;

      vm.isContextoTienda = !!$stateParams.catalogShortName;
      vm.enviadoSuccess = false;
      vm.enviadoAEmail = "";
      
      vm.solicitud = {
        nombreVendedor: $stateParams.catalogShortName
      }

      vm.enviar = function() {
        var hasError = Object.keys(vm.arrepentimientoForm.$error).length > 0;
        if(hasError) {
          toastr.warning("Revise el formulario por favor");
          return;
        }

        var onOk = function(response) {
          toastr.success("Solictud enviada");
          vm.enviadoSuccess = true;
          toTop();
          vm.enviadoAEmail = response.data.emailTo;
        }

        var onReject = function () {
          toastr.error("No se pudó enviar la solicitud");
        }

        const promise = soporteService.solicitudArrepentimiento(vm.solicitud, onReject);
        promise.then(onOk);
      }

      vm.volver = function() {
        if(vm.isContextoTienda) {
          $state.go("catalog.products");
        } else {
          $state.go("home.multicatalogo");
        }
      }

      function buscarDatosUsuario() {
        var usuario = usuario_dao.getUsuario();
        if(!usuario || Object.keys(usuario).length === 0) {
          return;
        }

        perfilService.verUsuario().then(function(response) {
          if(!response || !response.data) {
            return;
          }

          var perfil = response.data;
          vm.solicitud.nombre = perfil.nombre + " " + perfil.apellido;
          vm.solicitud.telefono = perfil.telefonoMovil || perfil.telefonoFijo || "";
        });
        vm.solicitud.email = usuario.email;
      }

      function toTop() {
        $window.scrollTo(0, 0);
      }

      buscarDatosUsuario();
      toTop();
    }
})();