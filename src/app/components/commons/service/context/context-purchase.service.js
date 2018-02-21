(function() {
	'use strict';

	angular.module('chasqui').service('contextPurchaseService', contextPurchaseService);
	/** Orquesta grupos y pedidos
		- Cache para evitar llamadas continuas
		- La cache limpia automaticamente 
				- a los N segundos
				- ante un F5 del browser
		- La cache se puede limpiar manualmente cuando se llama un servicio que se 
		sabe impacta en datos, por ejemplo borrar miembro.
		 */
	function contextPurchaseService($log, $localStorage, orders_dao, groups_dao, order_context, 
                                     contextOrdersService, contextAgrupationsService, agrupationTypeVAL,
                                     idGrupoPedidoIndividual, idPedidoIndividualGrupoPersonal) {
        
        ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        var contextPurchaseServiceInt = { 
            //Nueva interfaz
            setContextByCatalog: setContextByCatalog,       // :: catalog -> null
            setContextByOrder: setContextByOrder,           // :: order -> null
            setContextByAgrupation: setContextByAgrupation,  // :: agrupation -> null
            
            getCatalogContext: getCatalogContext,
            getOrderContext: getOrderContext,
            getAgrupationContext: getAgrupationContext,
            
            getSelectedOrder: getSelectedOrder,
            getSelectedAgrupation: getSelectedAgrupation,
            
            resetContext: resetContext,
            
            // Vieja interfaz
            clean: clean,
            refresh: refresh,
            refreshPedidos: refreshPedidos,
            refreshGrupos: refreshGrupos,
            
            tienePedidoInividual: tienePedidoInividual, // TODO: cambiar a nombre más descriptivo
            
            isGrupoIndividualSelected: isGrupoIndividualSelected, // TODO: cambiar a nombre más descriptivo
            isPedidoInividualSelected: isPedidoInividualSelected, // TODO: cambiar a nombre más descriptivo
            isAdmin: isAdmin,
            ls: $localStorage
        }
        	
        
        ///////////////////////////////////////// Public \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                
        /////////////////// Nueva interfaz
        
        /* Prop: setea el contexto de compra segun el catalogo para el usuario logeado
         * Modifica:    order_context.agrupationId
         *              order_context.agrupationType
         *              order_context.orderId
         */
        function setContextByCatalog(catalog){
            // Dadas las estrategias del catalogo depende el contexto inicial. TODO: Dinamizar
            
            order_context.setCatalogId(catalog.id);
            
            // Por el momento se setea por defecto el pedido individual
            order_context.setAgrupationId(idGrupoPedidoIndividual); 
            order_context.setAgrupationType(agrupationTypeVAL.TYPE_PERSONAL); 
            order_context.setOrderId(idPedidoIndividualGrupoPersonal);
        }
        
        /* Prop: setea el contexto de compra segun el pedido para el usuario logeado
         * Modifica:    order_context.agrupationId
         *              order_context.agrupationType
         *              order_context.orderId
         */
        function setContextByOrder(order){
            order_context.setOrderId(order.id);
            order_context.setAgrupationId(getAgrupationByOrder(order));
            order_context.setAgrupationType(order.type);
        }
        
        /* Prop: setea el contexto de compra segun la agrupacion para el usuario logeado
         * Modifica:    order_context.agrupationId
         *              order_context.agrupationType
         *              order_context.orderId
         */
        function setContextByAgrupation(agrupation){
            order_context.setOrderId(getOrderByAgrupation(agrupation));
            order_context.setAgrupationId(agrupation.id);
            order_context.setAgrupationType(agrupation.type);            
        }
        
        function getCatalogContext(){
            return order_context.getCatalogId();   
        }
        
        function getOrderContext(){
            return order_context.getOrderId();
        }
        
        function getAgrupationContext(){
            return {
                id: order_context.getAgrupationId(),
                type: order_context.getAgrupationType()
            };
        }
        
        /*
         *  Prec: Caché inicializada
         *  Retorna: Pedido seleccionado
         */
        function getSelectedOrder(){
            return contextOrdersService.getOrder(getOrderContext());
        }
        
        /*
         *  Prec: Caché inicializada
         *  Retorna: Agrupacion seleccionado
         */
        function getSelectedAgrupation(){
            return contextAgrupationsService.getAgrupation(getAgrupationContext());
        }
        
        function resetContext(){
            order_context.reset();
        }
                
        
        /////////////////// Vieja interfaz
        
       
      
		function tienePedidoInividual() {
            return getOrderSelected().estado === "ABIERTO";
		}

        
        /* Prop: cleans orders and groups cache. 
         */
        function clean(){
            contextOrdersService.reset();
            contextAgrupationsService.reset();
        }
        
        
		function refresh() {
            //var prevGroupSelected = getGroupSelected();
			refreshGrupos();
			refreshPedidos();
            //setContextoByGrupo(prevGroupSelected.idGrupo);
		}

		function refreshPedidos() {
			$log.debug("refreshPedidos");
            contextOrdersService.init();
			return contextOrdersService.getOrders();
		}

		function refreshGrupos() {
			$log.debug("refreshGrupos");
            contextAgrupationsService.init();
			return contextAgrupationsService.getAgrupations();
		}


		function isGrupoIndividualSelected() {
			return contextAgrupationsService.getAgrupation(order_context.getAgrupationId()).type === agrupationTypeVAL.TYPE_PERSONAL;
		}

		function isPedidoInividualSelected() {
			return contextOrdersService.getOrder(order_context.getOrderId()).type === agrupationTypeVAL.TYPE_PERSONAL;
		}

        
        
        /* TODO Revisar si sigue teniendo sentido esta funcion
         * ProxDeprec (04/12/17)
         */
		function isAdmin(pedidoParam) {
			var result = false;
			angular.forEach(contextAgrupationsService.getAgrupations(), function(grupo, key) {
				if (grupo.esAdministrador) {
					angular.forEach(grupo.miembros, function(miembro, key) {
						if (miembro.pedido && miembro.pedido.id === pedidoParam.id) {
							result = true;
						};
					});
				}
			});

			return result;
		}

        
		///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
       

		function getAgrupationByOrder(order) {
			return order.idGrupo;
		}

		function getOrderByAgrupation(agrupation) {
            return agrupation.idPedidoIndividual;
		}

        
        ///////////////////////////////////////// INIT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
        
		contextPurchaseServiceInt.ls.varianteSelected = undefined;
        
        function init(){
            contextAgrupationsService.init();
            order_context.setAgrupationId(idGrupoPedidoIndividual); 
            
            contextOrdersService.init();
            order_context.setOrderId(idPedidoIndividualGrupoPersonal);
        }
        
        init();
        
		$(window).unload(function() {
			$log.debug("reset por F5");
            clean();
		});
        
        return contextPurchaseServiceInt;
	} 
})(); 
