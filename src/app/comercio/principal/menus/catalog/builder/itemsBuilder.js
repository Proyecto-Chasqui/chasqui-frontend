(function() {
	'use strict';

	angular
		.module('chasqui')
		.factory('itemsBuilder', ItemsBuilder);

    
	function ItemsBuilder(){
    
      var impl = {
        general: general,
        catalog: catalog
      }
                
      function general(strategy){

          var itemsMenu = [
                              landingPage,
                              howToBuy,
                              products
                          ];
        
          if(strategy.nodos){
            itemsMenu.splice(1,1);
          }
          
          if(strategy.puntoDeEntrega){
            itemsMenu.push(deliveryPoints);
          }

          return itemsMenu;
      }
    
      function catalog(strategy){

          var itemsMenu = [];

          if(strategy.compraIndividual) itemsMenu.push(userOrders);
          if(strategy.gcc) itemsMenu.push(userGroups);
          if(strategy.nodos) itemsMenu.push(userNodes);

          return itemsMenu;
      }
      
      var landingPage = { 
                          id: 'WELCOME',
                          route: 'landingPage',
                          label: 'MENU_BIENVENIDO',
                          needLogin: false,
                          mobile_icon: 'home',
                      };

      var howToBuy = {   
                          id: 'HOW_TO_BUY',
                          route: 'howToBuy',
                          label: 'MENU_COMO_COMPRAR',
                          needLogin: false,
                          mobile_icon: 'live_help',
                      };

      var products = {
                          id: 'CATALOG',
                          route: 'products',
                          label: 'MENU_CATALOGO',
                          needLogin: false,
                          mobile_icon: 'list',
                      };

      var userOrders = {
                          id: 'MY_ORDERS',
                          route: 'userOrders',
                          label: 'MENU_PEDIDO',
                          needLogin: true,
                          mobile_icon: 'location_on',
                      };

      var userGroups = { 
                          id: 'MY_GROUPS',
                          route: 'userGroups.all',
                          label: 'MENU_GRUPO',
                          needLogin: true,
                          mobile_icon: 'group', 
                      };

      var userNodes = { 
                          id: 'MY_NODES',
                          route: 'userOrders', //route: 'userNodes',
                          label: 'MENU_NODES',
                          needLogin: true
                      };

      var deliveryPoints = { 
                          id: 'DELIVERY_POINTS',
                          route: 'deliveryPoints',
                          label: 'MENU_DELIVERY_POINTS',
                          needLogin: false
                      };

      var userProfile = {  
                          id: 'PROFILE',
                          route: 'profile',
                          label: 'MENU_PERFIL',
                          needLogin: true
                      }

      return impl;
    
        
	}
})();
