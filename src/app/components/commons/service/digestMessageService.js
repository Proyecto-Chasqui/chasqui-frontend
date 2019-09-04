(function() {
    'use strict';

angular
    .module('chasqui').
    service('digestMessageService', digestMessageService);

    function digestMessageService(toastr,$log,contextPurchaseService,usuario_dao, contextOrdersService, $rootScope,
                                  agrupationTypeVAL){
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

    function dispatchAction(info){
        if(info.accion === "notificar_vencimiento"){
          contextOrdersService.getOrders(info.idVendedor).then(function(orders){
            var expiredOrder = orders.filter(function(o){return o.id == info.idPedido;})[0];
            contextOrdersService.setStateExpired(info.idVendedor, expiredOrder);
            contextPurchaseService.setContextByCatalogId(info.idVendedor);
            toastr.info(
                (expiredOrder.type == agrupationTypeVAL.TYPE_PERSONAL? 
                "Tu pedido individual" : "Tu pedido del grupo " + expiredOrder.aliasGrupo )
                + " se venció por falta de actividad",
                "Pedido vencido",
                {timeOut: 300000}
            );
            $rootScope.$broadcast('order-cancelled');
          });
        }
    }

    };
})(); // anonimo