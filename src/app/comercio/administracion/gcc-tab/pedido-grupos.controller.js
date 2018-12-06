(function() {
    'use strict';

    angular.module('chasqui').controller('PedidoGruposController',PedidoGruposController);

    /*
     * Contenido del tab de grupo. Recibe por parametro el id del grupo
     */
    
    /*
     * @ngInject
     */
    function PedidoGruposController($scope, $log, URLS, gccService, us, ToastCommons, agrupationTypeVAL, $interval, contextOrdersService,
                                     contextPurchaseService,$state, usuario_dao, dialogCommons, $mdDialog, confirmOrder, productoService) {

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
        $scope.montoMinimo = $scope.grupo.miembros[0].pedido? $scope.grupo.miembros[0].pedido.montoMinimo : 500; // TODO pedir esta info dsd be
        $scope.porcentajeMontoMinimo = 0;
        $scope.estadoPedido = "colorCero";
        $scope.confirmOrder = confirmOrderImpl;
        $scope.cancelOrder = cancelOrder;
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
        
        
        // Confirm group's order
        
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
                    ToastCommons.mensaje(us.translate('CANCELADO'));
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
            return $scope.group.miembros.reduce(function(r,m){
                if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
                    return r + m.pedido.montoActual;
                }else{
                    return r;
                }
            }, 0);
        }
      
        // animación de la barra del monto total
      
        var porcentajeMontoMinimo = Math.min((montoTotalGrupo() / $scope.montoMinimo)*100, 100);
            
        var interval = $interval(function() {
          var increment = 1;
          
          if($scope.porcentajeMontoMinimo < porcentajeMontoMinimo && $scope.porcentajeMontoMinimo < 100){
            if(($scope.porcentajeMontoMinimo / porcentajeMontoMinimo) * 100 < 75){
              $scope.porcentajeMontoMinimo += increment*6;
            }else{
              $scope.porcentajeMontoMinimo += increment*2;
            }
            
            if($scope.porcentajeMontoMinimo < 17){
              $scope.estadoPedido = "colorCero";
            }else if($scope.porcentajeMontoMinimo < 33){
              $scope.estadoPedido = "colorUno";
            }else if($scope.porcentajeMontoMinimo < 50){
              $scope.estadoPedido = "colorDos";
            }else if($scope.porcentajeMontoMinimo < 67){
              $scope.estadoPedido = "colorTres";
            }else if($scope.porcentajeMontoMinimo < 83){
              $scope.estadoPedido = "colorCuatro";
            }else if($scope.porcentajeMontoMinimo < 100){
              $scope.estadoPedido = "colorCinco";
            }else if($scope.porcentajeMontoMinimo == 100){
              $scope.estadoPedido = "puedeConfirmar";
            }
            
          }else{
            $interval.cancel(interval);
          }
        }, 200);
        
        function classForState(state){
            var res = {
                ABIERTO: "ch-estado-pedido-abierto",
                CANCELADO: "ch-estado-pedido-cancelado",
                CONFIRMADO: "ch-estado-pedido-confirmado"
            };
            
            return res[state];
        }
    }
})();