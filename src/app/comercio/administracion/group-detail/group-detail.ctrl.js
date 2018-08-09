(function() {
    'use strict';

    angular.module('chasqui').controller('GroupDetailCtrl', GroupDetailCtrl);

function GroupDetailCtrl($log, $scope, $state, contextCatalogObserver,
                          dialogCommons, ToastCommons, gccService, URLS, agrupationTypeVAL,
                          us, usuario_dao, navigation_state, contextPurchaseService, contextAgrupationsService) {

    $scope.totalOrders;
    $scope.invitarUsuario = invitarUsuario;
    $scope.editGroup = editGroup;
    $scope.exitGroup = exitGroup;
    
    //////////////////////////// INIT ///////////////////////////////////////
    
    function init(){
        $scope.totalOrders = Math.floor($scope.group.miembros.reduce(function(r,m){
            if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
                return r + m.pedido.montoActual;
            }else{
                return r;
            }
        }, 0));
    }
    
    init();
    
    //////////////////////////// Private ///////////////////////////////////////

    /** habilita el panel para agregar integrantes. */
    function invitarUsuario(grupo) {
        $log.debug("Invitar miembro al grupo");

        function doOk(response) {
            $log.debug("Se seleccionó Invitar a usuario con mail", response);
            callInvitarUsuario(response, grupo);
        }

        function doNoOk() {
            $log.debug("Se seleccionó Cancelar");
        }

        dialogCommons.prompt(
            us.translate('INV_MIEMBRO'),
            us.translate('INGRESAR_CORREO'), 
            'correo@correo.com',
            us.translate('INVITAR'), 
            us.translate('CANCELAR'), 
            doOk, 
            doNoOk
        );
    }

    function editGroup(group) {
        dialogCommons.editGroup(group, function(editedGroup){
            contextAgrupationsService.modifyAgrupation(contextPurchaseService.getCatalogContext(), group.idGrupo, agrupationTypeVAL.TYPE_GROUP, function(toModifyGroup){
                toModifyGroup.alias = editedGroup.alias;
                toModifyGroup.descripcion = editedGroup.descripcion;
                $scope.$emit("group-information-actualized");
                return toModifyGroup;
            })
        });
    }


    /** Salir del grupo. Manejo del popUP */
    function exitGroup(group) {
        dialogCommons.confirm(
            us.translate('SALIR'), 
            us.translate('SEGURO_SALIR') + $scope.selectedGroup.alias, 
            us.translate('SI_MEVOY'), 
            us.translate('CANCELAR'),
            function(result) {
                callQuitarMiembro(group);
            },
            function() {
            $log.debug("se quedo");
            }
        )
    }


    /////// REST ////////


    function callInvitarUsuario(emailClienteInvitado, grupo) {

        var doOk = function(response) {
            ToastCommons.mensaje(us.translate('ENVIARA_MAIL'));
            var recienInvitado = {
                avatar: null, 
                nickname: null, 
                email: emailClienteInvitado, 
                invitacion: "NOTIFICACION_NO_LEIDA", 
                estadoPedido: "INEXISTENTE",
                pedido:null
            };
            
            grupo.miembros.push(recienInvitado);
        }

        var params = {
            idGrupo: grupo.idGrupo,
            emailInvitado: emailClienteInvitado
        }
        gccService.invitarUsuarioAGrupo(params).then(doOk);
    }

    function callQuitarMiembro(miembro) {
        $log.debug("quitar", miembro)

        function doOk(response) {
            ToastCommons.mensaje(us.translate('TE_FUISTE_GRUPO'))
            callLoadGrupos();
        }
        var params = {
            idGrupo: miembro.idGrupo,
            emailCliente: usuario_dao.getUsuario().email
        }

        gccService.quitarMiembro(params).then(doOk);
    }

}})();
