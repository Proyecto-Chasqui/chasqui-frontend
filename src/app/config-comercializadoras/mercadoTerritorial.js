(function(){
    'use strict';
    
    angular.module('chasqui').factory('mercadoTerritorial', 
                    [
            function(){
                
                return {
                    menus: [
                        {   // Wellcome
                            id: 'WELCOME',
                            route: 'principal',
                            label: 'MENU_BIENVENIDO',
                            needLogin: false
                        },
                        {   // How to buy
                            id: 'HOW_TO_BUY',
                            route: 'como-comprar',
                            label: 'MENU_COMO_COMPRAR',
                            needLogin: false
                        },
                        {   // Catalogue
                            id: 'CATALOG',
                            route: 'catalogo',
                            label: 'MENU_CATALOGO',
                            needLogin: false
                        },
                        {   // Orders
                            id: 'MY_ORDERS',
                            route: 'lista-pedidos',
                            label: 'MENU_PEDIDO',
                            needLogin: true
                        },
                        {   // Groups
                            id: 'MY_GROUPS',
                            route: 'lista-grupos',
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