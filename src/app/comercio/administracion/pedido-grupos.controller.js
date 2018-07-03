(function() {
    'use strict';

    angular.module('chasqui').controller('PedidoGruposController',PedidoGruposController);

    /*
     * Contenido del tab de grupo. Recibe por parametro el id del grupo
     */
    
    /*
     * @ngInject
     */
    function PedidoGruposController($scope, $log, URLS, gccService, us, ToastCommons, agrupationTypeVAL,
                                     contextPurchaseService,$state, usuario_dao, dialogCommons, $mdDialog) {

        $log.debug('PedidoGruposController', $scope.grupo);

        var vm = this;
        vm.grupo = $scope.grupo;
        vm.configuracionVenedor;
        vm.puedeCerrarPedidoGCC = !hayAlgunPedidoAbierto();
        vm.urlBase = URLS.be_base;
        vm.cerrarToolTipMsg = cerrarToolTipMsg;
        vm.selfPara = selfPara;
        vm.vocativoPara = vocativoPara;
        vm.miembrosActivosDelGrupo = miembrosActivosDelGrupo;
        vm.confirmGCCOrder = confirmGCCOrder;
        
        /////////////////////////////////////////////////
        
        function cerrarToolTipMsg(){
            if (vm.puedeCerrarPedidoGCC) {
                return "Podes cerrar el pedido grupal "
            } else {
                return "Para cerrar el pedido deben estar todos los pedidos confirmardos"
            }
        }

        function selfPara(miembro){
            return miembro.nickname + ((miembro.email == usuario_dao.getUsuario().email) ? " (Vos)" : ""); 
        }

        function vocativoPara(miembro){
            return (miembro.email == usuario_dao.getUsuario().email) ? "tuyos" : "de " + miembro.nickname;
        }

        function miembrosActivosDelGrupo(){
            $log.debug("PASO POR MIEMBROS ACTIVOS");
            return vm.grupo.miembros.filter(function(m) { return m.invitacion == 'NOTIFICACION_ACEPTADA' });
        }


        function hayAlgunPedidoAbierto() {
            return vm.grupo.miembros.reduce(function(r,m){return r || m.pedido != null && m.pedido.estado == 'ABIERTO'}, false);
        }

        
        /////////////////////////////////////////////////
        
        
        function confirmGCCOrder() {	
            var actions = {
                doOk: doConfirmOrder,
                doNotOk: ignoreAction
            };
            
            var activeMembers = vm.grupo.miembros.filter(function(m){return m.pedido != null});

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
                idGrupo: vm.grupo.idGrupo,
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
    }
})();