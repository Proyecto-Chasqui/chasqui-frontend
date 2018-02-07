(function() {
	'use strict';

	angular
		.module('chasqui')
		.factory('itemsBuilder', ItemsBuilder);

    
	function ItemsBuilder(){
                
        var landingPage = { 
                            id: 'WELCOME',
                            route: 'landingPage',
                            label: 'MENU_BIENVENIDO',
                            needLogin: false
                        };
        
        var howToBuy = {   
                            id: 'HOW_TO_BUY',
                            route: 'howToBuy',
                            label: 'MENU_COMO_COMPRAR',
                            needLogin: false
                        };
        
        var products = {
                            id: 'CATALOG',
                            route: 'products',
                            label: 'MENU_CATALOGO',
                            needLogin: false
                        };
        
        var userOrders = {
                            id: 'MY_ORDERS',
                            route: 'userOrders',
                            label: 'MENU_PEDIDO',
                            needLogin: true
                        };
        
        var userGroups = { 
                            id: 'MY_GROUPS',
                            route: 'userGroups',
                            label: 'MENU_GRUPO',
                            needLogin: true
                        };
        
        var userNodes = { 
                            id: 'MY_NODES',
                            route: 'userNodes',
                            label: 'MENU_NODES',
                            needLogin: true
                        };
        
        var userProfile = {  
                            id: 'PERFIL',
                            route: 'profile',
                            label: 'MENU_PERFIL',
                            needLogin: true
                        }
       
        return function(strategy){
            
            var itemsMenu = [
                                landingPage,
                                howToBuy,
                                products,
                                userOrders
                            ];
            
            if(strategy.gcc) itemsMenu.push(userGroups);
            if(strategy.nodos) itemsMenu.push(userNodes);
            
            itemsMenu.push(userProfile);
            
            return itemsMenu;
        }
        
	}
})();
