(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('ArrepentimientoController', ArrepentimientoController);

    /** @ngInject */
    function ArrepentimientoController($scope, $window, toastr, $stateParams, $state, $log, soporteService) {
      var vm = $scope;

      vm.isContextoTienda = !!$stateParams.catalogShortName;
      vm.enviadoSuccess = false;
      vm.enviadoAEmail = "";

      vm.solicitud = {
        nombreVendedor: $stateParams.catalogShortName
      }

      vm.enviar = function() {

        $log.info("apreto en enviar", vm.solicitud);

        var hasError = Object.keys(vm.arrepentimientoForm.$error).length > 0;
        if(hasError) {
          $log.info("apreto en enviar", vm.arrepentimientoForm.$error);
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

      function toTop() {
        $window.scrollTo(0, 0);
      }

      toTop();
    }
})();