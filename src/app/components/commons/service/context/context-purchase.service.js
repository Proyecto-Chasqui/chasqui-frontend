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
            resetContext: resetContext,
            
            // Vieja interfaz
            clean: clean,
            refresh: refresh,
            refreshPedidos: refreshPedidos,
            refreshGrupos: refreshGrupos,
            getOrderContext: getOrderContext,
            getOrderSelected: getOrderSelected,
            getGroupSelected: getGroupSelected,
            tienePedidoInividual: tienePedidoInividual, // TODO: cambiar a nombre más descriptivo
            setContextoByPedido: setContextoByPedido,
            setContextoByGrupo: setContextoByGrupo,
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
            order_context.setAgrupationId(getGrupoByPedido(order));
            order_context.setAgrupationType(order.type);
        }
        
        function setContextByAgrupation(agrupation){
            order_context.setOrderId(getPedidoByGrupo(agrupation));
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
        
        function resetContext(){
            order_context.reset();
        }
                
        
        /////////////////// Vieja interfaz
        
        /*
         *  Prec: Caché inicializada
         */
        function getOrderContext(){
            return order_context;
        }

        /*
         *  Prec: Caché inicializada
         *  Retorna: Pedido seleccionado
         */
        function getOrderSelected(){
            return contextOrdersService.getOrder(getOrderContext().getOrderId());
        }

        /*
         *  Prec: Caché inicializada
         *  Retorna: Grupo seleccionado
         */
        function getGroupSelected(){
            return contextAgrupationsService.getAgrupation(getOrderContext().getAgrupationId());
        }

                
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

        /* Prop: setea el contexto de compra segun el pedido para el usuario logeado
         * Modifica:    order_context <- groupSelectedId
         *              order_context <- orderSelectedId
         * Intenta agregar el pedido a travez de addNewOrder, que lo agrega si es el pedido personal reemplazante del placeholder
         * Prec: cache actualizada
         */
		function setContextoByPedido(newOrder) {
            //addNewOrder(newOrder);
			order_context.setOrderId(newOrder.id);
			order_context.setAgrupationId(getGrupoByPedido(newOrder));
		}

        /* Prop: setea el contexto de compra segun el grupo para el usuario logeado
         * Modifica:    order_context <- groupSelectedId
         *              order_context <- orderSelectedId
         * Prec: cache actualizada; debe existir un pedido con id idPedidoIndividual del grupo referenciado por groupId
         */
		function setContextoByGrupo(groupId) {
            order_context.setAgrupationId(groupId);
            order_context.setOrderId(contextAgrupationsService.getAgrupation(groupId).idPedidoIndividual); 
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
       

		function getGrupoByPedido(pedido) {
			return pedido.idGrupo;
		}

		function getPedidoByGrupo(grupo) {
            return grupo.idPedidoIndividual;
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
