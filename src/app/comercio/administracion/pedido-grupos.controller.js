(function() {
  'use strict';

  angular.module('chasqui').controller('PedidoGruposController',
    PedidoGruposController);

  /**
   * @ngInject Contenido del tab de grupo. Recibe por parametro el id del
   *           grupo
   */
  function PedidoGruposController($scope, StateCommons, $log, perfilService, $mdDialog, 
    gccService, us,ToastCommons,contextPurchaseService,$state, usuario_dao) {
    $log.debug('PedidoGruposController', $scope.grupo);

    var vm = this;
    vm.grupo = $scope.grupo;
    vm.direcciones = [];
    vm.direccionSelected;
    vm.puedeCerrarPedidoGCC = !hayAlgunPedidoAbierto();
    vm.comentario = "";

    vm.cerrarToolTipMsg = function() {
      if (vm.puedeCerrarPedidoGCC) {
        return "Podes cerrar el pedido grupal "
      } else {
        return "Para cerrar el pedido deben estar todos los pedidos confirmardos"
      }
    }

    vm.selfPara = function(miembro) {
      return (miembro.email == usuario_dao.getUsuario().email) ? miembro.nickname + "(Tú)" : miembro.nickname; 
    }

    vm.vocativoPara = function(miembro) {
      return (miembro.email == usuario_dao.getUsuario().email) ?
        "tuyos" :
        "de " + miembro.nickname;
    }

    vm.miembrosActivosDelGrupo = function() {
      $log.debug("PASO POR MIEMBROS ACTIVOS");
      return vm.grupo.miembros.filter(function(m) { return m.invitacion == 'NOTIFICACION_ACEPTADA' });
    }

    vm.cerrarPedidoGccClick = function(ev) {
      $log.debug('cerrarPedidoGccClick');
      callDirecciones();
      //callConfirmar();
    }

    /****************/

    function hayAlgunPedidoAbierto() {
      var result = false;
      angular.forEach(vm.grupo.miembros, function(miembro) {
        if (!us.isUndefinedOrNull(miembro.pedido)) {
          result = miembro.pedido.estado == 'ABIERTO'
        }
      });
      return result;
    }

    /*************** */

    function callConfirmar() {
      $log.debug('callConfirmar   ', $scope.pedido);

      function doOk(response) {
        $log.debug("--- confirmar pedido response ", response.data);
        ToastCommons.mensaje(us.translate('PEDIDO_CONFIRMADO_MSG'));
        contextPurchaseService.refreshPedidos().then(
          function(pedidos) {
            $state.reload();
          });
        location.reload();// TODO: Revisar $localStorage
      }
            // Modificado por favio....
      var params = {};
      params.idGrupo = vm.grupo.idGrupo;
      params.idDireccion = vm.direccionSelected.idDireccion;
      //params.comentario = vm.comentario;

      gccService.confirmarPedidoColectivo(params).then(doOk);


    }

    function callDirecciones() {
      $log.debug('call direcciones ');

      function doOk(response) {
        $log.debug('call direcciones response ', response);
        vm.direcciones = response.data;

        if (vm.direcciones.length === 0){
          ToastCommons.mensaje(us.translate('PEDIR_DOMICILIO'));          
        }else{
          popUpElegirDireccion();
        }
      }

      perfilService.verDirecciones().then(doOk);
    }

    function popUpElegirDireccion(ev) {
      $log.debug('confirmarDomicilioOpenDialog');
      $mdDialog.show({
        templateUrl: 'dialog-direccion.html',
        scope: $scope,
        preserveScope: true
        //targetEvent: ev
      });
    }

    vm.confirmarDomicilio = function() {
      $log.debug('close');
      $mdDialog.hide();
      callConfirmar();
    };

  }
})();
