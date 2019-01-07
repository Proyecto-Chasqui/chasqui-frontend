(function() {
    'use strict';

angular
    .module('chasqui').
    service('digestMessageService', digestMessageService);

    function digestMessageService(toastr,$log,contextPurchaseService,usuario_dao){
    var vm = this;

    //Campos del mensaje

    //Integer idUsuario;
    //String tipo; campo libre por si necesita hacer que el mensaje se divida por tipos
    //Integer idPedido;
    //String action; campo libre por si se necesita hacer que el backend mande acciones al frontend
    //Integer idVendedor; 

    vm.webSocketMessageDispatch = function(ListJSON){
        for(var i in ListJSON){
            if(ListJSON[i].idVendedor === contextPurchaseService.getCatalogContext() && ListJSON[i].idUsuario === usuario_dao.getUsuario().id){
                dispatchAction(ListJSON[i]);
            }
        }
    }

    function dispatchAction(JSON){
        if(JSON.accion === "notificar_vencimiento"){
            toastr.info("Pedido Vencido!!!","WEBSOCKET MESSAGE",{timeOut: 800000});
        }
    }

    };
})(); // anonimo    














