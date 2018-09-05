(function() {
    'use strict';

    angular.module('chasqui').controller('PedidoGruposController',PedidoGruposController);

    /*
     * Contenido del tab de grupo. Recibe por parametro el id del grupo
     */
    
    /*
     * @ngInject
     */
    function PedidoGruposController($scope, $log, URLS, gccService, us, ToastCommons, agrupationTypeVAL, $interval,
                                     contextPurchaseService,$state, usuario_dao, dialogCommons, $mdDialog) {

        $scope.configuracionVenedor;
        $scope.puedeCerrarPedidoGCC = puedeCerrarPedidoGCC;
        $scope.urlBase = URLS.be_base;
        $scope.cerrarToolTipMsg = cerrarToolTipMsg;
        $scope.cerradoToolTipMsg = cerradoToolTipMsg;
        $scope.selfPara = selfPara;
        $scope.vocativoPara = vocativoPara;
        $scope.miembrosActivosDelGrupo = $scope.grupo.miembros.filter(function(m) { return m.invitacion == 'NOTIFICACION_ACEPTADA' });
        $scope.confirmGCCOrder = confirmGCCOrder;
        $scope.totalForMember = totalForMember;
        $scope.montoTotalGrupo = montoTotalGrupo;
        $scope.montoMinimo = $scope.grupo.miembros[0].pedido.montoMinimo;
        $scope.porcentajeMontoMinimo = 0;
        $scope.estadoPedido = function(){
          return $scope.porcentajeMontoMinimo < 100? "noPuedeConfirmar" : "puedeConfirmar";
        }
      
        
        /////////////////////////////////////////////////
        
        function cerrarToolTipMsg(){
            return "Podes cerrar el pedido grupal!";
        }
        
        function cerradoToolTipMsg(){
            return "El pedido grupal esta cerrado. Confirma tu pedido para abrirlo!";
        }
        
        function selfPara(miembro){
            return miembro.nickname + ((miembro.email == usuario_dao.getUsuario().email) ? " (Vos)" : ""); 
        }

        function vocativoPara(miembro){
            return (miembro.email == usuario_dao.getUsuario().email) ? "tuyos" : "de " + miembro.nickname;
        }

        function puedeCerrarPedidoGCC(){
            return !hayAlgunPedidoAbierto() && hayAlgunPedidoConfirmado() && montoTotalGrupo() >= $scope.montoMinimo;
        }

        function hayAlgunPedidoAbierto() {
            return algunPedidoTieneEstado($scope.grupo.miembros, 'ABIERTO');
        }
        
        function hayAlgunPedidoConfirmado(){
            return algunPedidoTieneEstado($scope.grupo.miembros, 'CONFIRMADO');
        }
            
        function algunPedidoTieneEstado(miembros, estado){
            return any(miembros, function(m){return m.pedido != null && m.pedido.estado == estado})
        }
        
        function any(list, property){
            return list.reduce(function(r,e){return r || property(e)}, false);
        }
        
        function confirmGCCOrder() {	
            var actions = {
                doOk: doConfirmOrder,
                doNotOk: ignoreAction
            };
            
            var activeMembers = $scope.grupo.miembros.filter(function(m){return m.pedido != null && m.pedido.estado == "CONFIRMADO"});

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
                ToastCommons.mensaje(us.translate('PEDIDO_CONFIRMADO_MSG'));
                location.reload();
			     }

			     var params = {
                idGrupo: $scope.grupo.idGrupo,
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


        function ignoreAction(){
            $mdDialog.hide();
        }
        
        function totalForMember(member){
            return Math.floor(member.pedido.productosResponse.reduce(function(r,p){return r + (p.precio * p.cantidad)}, 0));
        }
      
        function montoTotalGrupo(){
            return Math.floor($scope.group.miembros.reduce(function(r,m){
                if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
                    return r + m.pedido.montoActual;
                }else{
                    return r;
                }
            }, 0));
        }
      
        // animación de la barra del monto total
      
        var porcentajeMontoMinimo = Math.min((montoTotalGrupo() / $scope.montoMinimo)*100, 100);
            
        var interval = $interval(function() {
          var increment = 2;
          
          if($scope.porcentajeMontoMinimo < porcentajeMontoMinimo && $scope.porcentajeMontoMinimo < 100){
            if(($scope.porcentajeMontoMinimo / porcentajeMontoMinimo) * 100 < 75){
              $scope.porcentajeMontoMinimo += increment*6;
            }else{
              $scope.porcentajeMontoMinimo += increment;
            }
            
          }else{
            $interval.cancel(interval);
          }
        }, 200);
    }
})();