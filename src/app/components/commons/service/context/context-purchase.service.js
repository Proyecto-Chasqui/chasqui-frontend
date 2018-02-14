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
                                     contextOrdersService, contextAgrupationsService, 
                                     idGrupoPedidoIndividual, idPedidoIndividualGrupoPersonal) {
        
		var vm = this;
		
		vm.ls = $localStorage;        
                
        
        function init(){
            console.log("contextPurchaseService init");
            contextAgrupationsService.init();
            order_context.setGroupSelected(idGrupoPedidoIndividual); 
            
            contextOrdersService.init();
            order_context.setOrderSelected(idPedidoIndividualGrupoPersonal);
        }
        
		vm.ls.varianteSelected = undefined;
		
        
        /////////////////////////////////////
                
        
        /*
         *  Prec: Caché inicializada
         */
        vm.getOrderContext = function(){
            return order_context;
        }

        /*
         *  Prec: Caché inicializada
         *  Retorna: Pedido seleccionado
         */
        vm.getOrderSelected = function(){
            return orders_dao.getOrder(vm.getOrderContext().getOrderSelected());
        }

        /*
         *  Prec: Caché inicializada
         *  Retorna: Grupo seleccionado
         */
        vm.getGroupSelected = function(){
            return groups_dao.getGroup(vm.getOrderContext().getGroupSelected());
        }

                
		vm.tienePedidoInividual = function() {
            return vm.getOrderSelected().estado === "ABIERTO";
		}

        
        /* Prop: cleans orders and groups cache. 
         */
        vm.clean = function(){
            orders_dao.reset();
            groups_dao.reset();
        }
        
        
		vm.refresh = function() {
            var prevGroupSelected = vm.getGroupSelected();
			vm.refreshGrupos();
			vm.refreshPedidos();
            vm.setContextoByGrupo(prevGroupSelected.idGrupo);
		}

		vm.refreshPedidos = function() {
			$log.debug("refreshPedidos");
            contextOrdersService.init();
			return contextOrdersService.getOrders();
		}

		vm.refreshGrupos = function() {
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
		vm.setContextoByPedido = function(newOrder) {
            addNewOrder(newOrder);
			order_context.setOrderSelected(newOrder.id);
			order_context.setGroupSelected(getGrupoByPedido(newOrder));
		}

        /* Prop: setea el contexto de compra segun el grupo para el usuario logeado
         * Modifica:    order_context <- groupSelectedId
         *              order_context <- orderSelectedId
         * Prec: cache actualizada; debe existir un pedido con id idPedidoIndividual del grupo referenciado por groupId
         */
		vm.setContextoByGrupo = function(groupId) {
			$log.debug("setContextoByGrupo", groupId);
            order_context.setGroupSelected(groupId);
            order_context.setOrderSelected(groups_dao.getGroup(groupId).idPedidoIndividual);            
			$log.debug("pedidoSelected es ", order_context.getOrderSelected());
		}

		vm.isGrupoIndividualSelected = function() {
			return groups_dao.getGroup(order_context.getGroupSelected()).alias === "Personal";
		}

		vm.isPedidoInividualSelected = function() {
			return orders_dao.getOrder(order_context.getOrderSelected()).aliasGrupo === "Personal";
		}

        
        
        /* TODO Revisar si sigue teniendo sentido esta funcion
         * ProxDeprec (04/12/17)
         */
		vm.isAdmin = function(pedidoParam) {
			var result = false;
			angular.forEach(groups_dao.getGroups(), function(grupo, key) {
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

		////////////
		/// privados 
       

		function getGrupoByPedido(pedido) {
			return pedido.idGrupo;
		}

		function getPedidoByGrupo(grupo) {
            return grupo.idPedidoIndividual;
		}

		////////////////////
		////////// INIT 
        
        init();
        
		$(window).unload(function() {
			$log.debug("reset por F5");
            vm.clean();
		});
	} // function
})(); // anonimo
