(function(){
    'use strict';
    
    angular.module('chasqui').factory('puenteDelSur', 
                    [
            function(){
                
                return {
                    menus: [
                        {   // Wellcome
                            id: 'WELCOME',
                            route: 'landingPage',
                            label: 'MENU_BIENVENIDO',
                            needLogin: false
                        },
                        {   // How to buy
                            id: 'HOW_TO_BUY',
                            route: 'howToBuy',
                            label: 'MENU_COMO_COMPRAR',
                            needLogin: false
                        },
                        {   // Catalogue
                            id: 'CATALOG',
                            route: 'products',
                            label: 'MENU_CATALOGO',
                            needLogin: false
                        },
                        {   // Orders
                            id: 'MY_ORDERS',
                            route: 'userOrders',
                            label: 'MENU_PEDIDO',
                            needLogin: true
                        },
                        {   // Groups
                            id: 'MY_GROUPS',
                            route: 'userGroups',
                            label: 'MENU_GRUPO',
                            needLogin: true
                        },
                        {   // Perfil
                            id: 'PERFIL',
                            route: 'perfil',
                            label: 'MENU_PERFIL',
                            needLogin: true
                        }
                    ]
                };
                
            }
    ]);    
})();