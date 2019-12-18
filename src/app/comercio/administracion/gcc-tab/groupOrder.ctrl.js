(function() {
  'use strict';

  angular.module('chasqui').controller('GroupOrderController',GroupOrderController);

  function GroupOrderController($scope, $rootScope, $log, URLS, gccService, us, toastr, agrupationTypeVAL, $interval, 
                                   contextOrdersService, contextPurchaseService,$state, usuario_dao, dialogCommons, 
                                   $mdDialog, confirmOrder, productoService, vendedorService) {

    $scope.urlBase = URLS.be_base;

    $scope.puedeCerrarPedidoGCC = puedeCerrarPedidoGCC;
    $scope.cerrarToolTipMsg = cerrarToolTipMsg;
    $scope.cerradoToolTipMsg = cerradoToolTipMsg;
    $scope.puedeCerrarPedidoGCCSegunEstrategias = puedeCerrarPedidoGCCSegunEstrategias;

    $scope.selfPara = selfPara;
    $scope.vocativoPara = vocativoPara;

    $scope.miembrosActivosDelGrupo = [];
    $scope.totalForMember = totalForMember;

    $scope.confirmOrder = confirmOrderImpl;
    $scope.cancelOrder = cancelOrder;
    $scope.confirmGCCOrder = confirmGCCOrder;

    $scope.isLoggedUser = isLoggedUser;
    $scope.classForState = classForState;


    /////////////////////////////////////////////////

    function cerrarToolTipMsg(){
        return "Podes cerrar el pedido grupal!";
    }

    function cerradoToolTipMsg(){
        return "El pedido grupal esta cerrado. Confirma tu pedido individual para abrirlo!";
    }

    function selfPara(miembro){
        return miembro.nickname + ((miembro.email == usuario_dao.getUsuario().email) ? " (Vos)" : ""); 
    }

    function isLoggedUser(member){
        return member.email == usuario_dao.getUsuario().email;
    }

    function vocativoPara(miembro){
        return (miembro.email == usuario_dao.getUsuario().email) ? "tuyos" : "de " + miembro.nickname;
    }

    function puedeCerrarPedidoGCC(){
        return !hayAlgunPedidoAbierto() && hayAlgunPedidoConfirmado() && montoTotalGrupo() >= $scope.montoMinimo;
    }


    function puedeCerrarPedidoGCCSegunEstrategias(){
        return !hayAlgunPedidoAbierto() && hayAlgunPedidoConfirmado();
    }

    function hayAlgunPedidoAbierto() {
        return algunPedidoTieneEstado($scope.group.miembros, 'ABIERTO');
    }

    function hayAlgunPedidoConfirmado(){
        return algunPedidoTieneEstado($scope.group.miembros, 'CONFIRMADO');
    }

    function algunPedidoTieneEstado(miembros, estado){
        return any(miembros, function(m){return m.pedido != null && m.pedido.estado == estado})
    }

    function any(list, property){
        return list != undefined && list.reduce(function(r,e){return r || property(e)}, false);
    }


    // Confirm group's order

    function confirmGCCOrder() {	
        var actions = {
            doOk: doConfirmOrder,
            doNotOk: ignoreAction
        };

        var activeMembers = $scope.group.miembros.filter(function(m){return m.pedido != null && m.pedido.estado == "CONFIRMADO"});

        var adHocOrder = {
            montoActual: activeMembers.reduce(function(r,m){return r + m.pedido.montoActual}, 0),
            nombresDeMiembros: activeMembers.map(function(m){return m.nickname}),
            montoActualPorMiembro: activeMembers.reduce(function(r,m){r[m.nickname] = m.pedido.montoActual; return r}, {}),
            type: agrupationTypeVAL.TYPE_GROUP
        }

        dialogCommons.selectDeliveryAddress(actions, adHocOrder);
    };


    function doConfirmOrder(selectedAddress, answers) {
        $log.debug('callConfirmar', $scope.pedido);

       function doOk(response) {
            $log.debug("--- confirmar pedido response ", response.data);
            toastr.success(us.translate('PEDIDO_CONFIRMADO_MSG'),us.translate('AVISO_TOAST_TITLE'));
            location.reload();
       }

       var params = {
            idGrupo: $scope.group.id,
            idDireccion: "",
            idPuntoDeRetiro: "",
            idZona: "",
            comentario: "",
            opcionesSeleccionadas: answers.map(function(a){
                return {
                    nombre: a.nombre,
                    opcionSeleccionada: a.answer
                }
            })
        }

        gccService.confirmarPedidoColectivo(completeConfirmColectiveOrderParams(params, selectedAddress)).then(doOk);
    }

    function completeConfirmColectiveOrderParams(params, selectedAddress){
        return {
            address: function(){
                params.idDireccion = selectedAddress.selected.idDireccion;
                params.idZona = selectedAddress.zone.id;
                params.comentario = selectedAddress.particularities;
                return params;
            },
            deliveryPoint: function(){
                params.idPuntoDeRetiro = selectedAddress.selected.id;
                return params;
            }
        }[selectedAddress.type]();
    }

    // Confirm & cancel personal order in GCC

    function confirmOrderImpl(order){
        order.type = "GROUP";
        confirmOrder(order)
    }

    function cancelOrder(order){
        dialogCommons.confirm("¿Cancelar pedido?", 
                              "¿Está seguro que quiere cancelarlo?", 
                              "Si", 
                              "No", 
                              doCancelOrder(order), 
                              ignoreAction);
    }


    function doCancelOrder(order){
        return function(){
            $log.debug('DetallePedidoController , cancelar', order);

            function doOk(response) {
                $log.debug("--- cancelar pedido response ", response.data);
                toastr.success(us.translate('CANCELADO'),us.translate('AVISO_TOAST_TITLE'));
                /*contextOrdersService.setStateCancel(contextPurchaseService.getCatalogContext(), order);
                if(order.type == "PERSONAL"){
                    contextOrdersService.setVirtualPersonalOrder(contextPurchaseService.getCatalogContext());
                }*/
                location.reload();
            }

            productoService.cancelarPedidoIndividual(order.id).then(doOk);
        }
    }


    function ignoreAction(){
        $mdDialog.hide();
    }

    function totalForMember(member){
        return member.pedido != null? member.pedido.productosResponse.reduce(function(r,p){return r + (p.precio * p.cantidad)}, 0): 0;
    }

    function montoTotalGrupo(){
        return $scope.group.miembros != undefined? $scope.group.miembros.reduce(function(r,m){
            if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
                return r + m.pedido.montoActual;
            }else{
                return r;
            }
        }, 0) : 0;
    }

    function classForState(state){
        var res = {
            ABIERTO: "ch-estado-pedido-abierto",
            CANCELADO: "ch-estado-pedido-cancelado",
            CONFIRMADO: "ch-estado-pedido-confirmado"
        };

        return res[state];
    }

    //////// Init

    function init(){
        if($scope.group.miembros != undefined){
          $scope.miembrosActivosDelGrupo = $scope.group.miembros.filter(function(m) { return m.invitacion == 'NOTIFICACION_ACEPTADA' });
          $scope.montoMinimo = $scope.group.miembros[0].pedido? $scope.group.miembros[0].pedido.montoMinimo : 500; // TODO pedir esta info dsd be
          $scope.porcentajeMontoMinimo = 0;
        }
        vendedorService.obtenerConfiguracionVendedor().then(
            function(response){
                $scope.montoMinimo = response.data.montoMinimo;
            }
        );
    }

    $rootScope.$on('group-is-loaded', function(event, group) {
        $log.debug("group", group);
        init();
    });
    
    
    init();
    
  }
})();