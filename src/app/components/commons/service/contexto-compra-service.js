(function() {
	'use strict';

	angular.module('chasqui').service('contextoCompraService', contextoCompraService);
	/** Orquesta grupos y pedidos
		- Utils con Logica que podria estar en backend
		- Cache para evitar llamadas continuas
		- La cache limpia automaticamente 
				- a los N segundos
				- ante un F5 del browser
				- cuando llega una notificacion (supone algun cambio)
		- La cache se puede limpiar manualmente cuando se llama un servicio que se 
		sabe impacta en datos, por ejemplo borrar miembro.
		 */
	function contextoCompraService($log, us, StateCommons, $localStorage, 
		productoService, gccService, $q, $timeout, $rootScope,moment,CTE_REST, 
        usuario_dao, orders_dao, groups_dao, order_context) {
		var vm = this;
		
		vm.ls = $localStorage;
        
        
        function init(){
            console.log("contextoCompraService init");
            initGroups();
            order_context.setGroupSelected(idGrupoPedidoIndividual); 
            initOrders();
            order_context.setOrderSelected(idPedidoIndividualGrupoPersonal);
        }
        
        
        function initGroups(){
            groups_dao.reset();
            groups_dao.newGroup(grupoIndividualVirtual);
        }
        
        function initOrders(){
            orders_dao.reset();
            //order_context.setOrderSelected(idPedidoIndividualGrupoPersonal);
            addNewOrder(pedidoIndividualVirtual);
        }
        
        var idGrupoPedidoIndividual = 0;            // Ningún grupo tiene id = 0
        var idPedidoIndividualGrupoPersonal = 0;    // Ningún pedido tiene id = 0

		// Representa el concepto de grupo indivial para el caso de que no tiene un pedido abierto
		var grupoIndividualVirtual = {
            alias: "Personal",
            esAdministrador: true,
            idGrupo: idGrupoPedidoIndividual,
            idPedidoIndividual: idPedidoIndividualGrupoPersonal
        }
        
        var pedidoIndividualVirtual = {
            aliasGrupo: "Personal",
            estado: "CANCELADO",
            id: idPedidoIndividualGrupoPersonal,
            idGrupo: idGrupoPedidoIndividual,
            productosResponse: []
        }
        
		vm.ls.varianteSelected = undefined;
		vm.ls.lastUpdate = moment();		
			 
        
        function addNewOrder(newOrder){
            if(orders_dao.getOrders().filter(function(o){return o.id == newOrder.id}).length === 0){
                if(newOrder.idGrupo == null){ // Esto significa que es el pedido individual cargado desde el BE
                    newOrder.idGrupo = idGrupoPedidoIndividual;
                    newOrder.aliasGrupo = "Personal";
                    orders_dao.removeOrder(idPedidoIndividualGrupoPersonal);
                    vm.getGrupos().then(function(grupos){
                        grupos.modifyGroup(idGrupoPedidoIndividual, function(group){
                            group.idPedidoIndividual = newOrder.id;
                            return group;
                        })
                    })
                    order_context.setOrderSelected(newOrder.id);
                }
                orders_dao.newOrder(newOrder);
            }
        }
        
        /////////////////////////////////////
        
        function getContext(contextName, context, cacheIsEmpty, returnFromServer){
			var defered = $q.defer();
			var promise = defered.promise;

			if (vencioTiempoChache() || cacheIsEmpty) {
                $log.debug("NO tiene " + contextName + " en cache");
                returnFromServer(defered);
			} else {
				context().then(defered.resolve);
			}

			return promise;
		}
        
        
		vm.getGrupos = function() {
            return getContext(
                "grupos", 
                function(){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    defered.resolve(groups_dao);
                    return promise;                
                },                
                groups_dao.getGroups().length === 1, 
                function(defered){
                    function doOK(response) {					
                        vm.ls.lastUpdate=moment();	
                        initGroups();
                        response.data.forEach(groups_dao.newGroup);
                        defered.resolve(groups_dao);
                    }
                    gccService.gruposByusuario().then(doOK);    
                });
           
		}

		vm.getPedidos = function() {
            return getContext(
                "pedidos", 
                function(){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    addOrdersFromGroupsWithoutOrders(orders_dao.getOrders()).then(function(orders){
                            orders.forEach(addNewOrder);
                            console.log("New orders: ", orders_dao.getOrders());
                            defered.resolve(orders_dao);
                        });
                    return promise;                
                },   
                orders_dao.getOrders().length === 1, 
                function(defered){

                    function doOk(response) {	
                        vm.ls.lastUpdate=moment();	
                        initOrders();
                        addOrdersFromGroupsWithoutOrders(response.data).then(function(orders){
                            orders.forEach(addNewOrder);
                            console.log("New orders: ", orders_dao.getOrders());
                            defered.resolve(orders_dao);
                        });
                    }

                    gccService.pedidosByUser().then(doOk);                  
                });
		}
        
        
        /* Prop:   creates orders for every group without a created order (order-group is a relation bidirectional)
         * Params: orders :: [Order], a list with all user's open orders.
         * Return: [Order], a list with an order for every user's group plus the individual order
         */
        function addOrdersFromGroupsWithoutOrders(orders){
			var defered = $q.defer();
			var promise = defered.promise;
            vm.getGrupos().then(
                function(grupos){
                    var groupsWithoutOrders = grupos.getGroups().filter(function(g){
                        return !(orders.map(function(o){return o.idGrupo}).includes(g.idGrupo) ||  // Filtra los grupos que no tienen pedidos creados
                                 g.alias === "Personal");
                    });                    
                    createOrdersForGroupsWithoutOrders(groupsWithoutOrders, orders).then(defered.resolve);
                });                   
            return promise;
        }
        
                            
        function createOrdersForGroupsWithoutOrders(groupsWithoutOrders, orders){
            var defered = $q.defer();
			var promise = defered.promise;
			console.log("Groups wo order:", groupsWithoutOrders);
            
            async.each(groupsWithoutOrders, function(group, callback) {  
                console.log("Inside");
                createOrderForGroup(group).then(function(newOrder){
                    orders.push(newOrder);
                    console.log('Pedido agregado', newOrder, orders);
                    callback();
                })
                
            }, function(err) {
                if( err ) {
                  console.log('A file failed to process');
                } else {
                  defered.resolve(orders);
                }
            });
            
            return promise;
        }
      
        
        /* Prop: Creates
         *
         */
        function createOrderForGroup(group){
			var defered = $q.defer();
			var promise = defered.promise;
            
            function doOK(response) {
				$log.debug("callCrearPedidoGrupal", response);
                defered.resolve(response.data);
			}
                        
            function doNoOK(response) {
				$log.debug("error crear gcc individual, seguramente ya tenia pedido",response);
			}
            
			var params = {}
			params.idGrupo = group.idGrupo;
			params.idVendedor = StateCommons.vendedor().id;
			gccService.crearPedidoGrupal(params, doNoOK).then(doOK);
            
            return promise;
        }
        
        
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
            initOrders();
			return vm.getPedidos();
		}

		vm.refreshGrupos = function() {
			$log.debug("refreshGrupos");
            initGroups();
			return vm.getGrupos();
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

		function vencioTiempoChache(){
			return parseInt(moment().diff(vm.ls.lastUpdate))/1000 > CTE_REST.TIEMPO_MAX_CACHE;
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
