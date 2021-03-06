(function() {
  'use strict';

  angular
    .module('chasqui')
    .config(routerConfig);

    
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '',
            templateUrl: 'app/comercio/principal/home/home.tmpl.html',
            controller: 'HomeController',
            abstract: true,
        })

        .state('home.multicatalogo', {
            url: '/',
            templateUrl: 'app/comercio/principal/home/multicatalogo.tmpl.html',
            controller: 'MulticatalogoCtrl'
        })
      
        .state('home.profile', {
            url: '/perfil',
            templateUrl: 'app/comercio/administracion/perfil.html',
            controller: 'PerfilController',
            controllerAs: 'perfilCtrl',
            params: { index: null },
            auth: true
        })
        .state('home.login', {
            url: '/login',
            templateUrl: 'app/comercio/administracion/formularios/login.html',
            controller: 'LogInController',
            controllerAs: 'loginCtrl',
            params: { toPage: null },
        })
    
        .state('catalog', {
            url: '/:catalogShortName',
            templateUrl: 'app/comercio/principal/catalog/catalog.tmpl.html',
            controller: 'CatalogController',
            params: { mail: null },
            abstract: true
        })
      
            .state('catalog.terminosYcondiciones', {
              url: '/terminosYcondiciones',
              templateUrl: 'app/comercio/varios/terminos.html',
              controller: 'TerminosCtrl',
            })
    
            .state('catalog.landingPage', {
                url: '/bienvenida',
                templateUrl: 'app/comercio/principal/principal.html',
                controller: 'PrincipalController',
                controllerAs: 'principalCtrl'
            })
            .state('catalog.howToBuy', {
                url: '/comoComprar',
                templateUrl: 'app/comercio/varios/como_comprar.html',
                controller: 'ComoComprarController',
                controllerAs: 'comoComprarCtrl'
            })
            .state('catalog.products', {
                url: '/productos',
                templateUrl: 'app/comercio/catalogo/catalogo.html', // TODO: cambiar nombre de "Catalog" a "Productos" o lista de productos
                controller: 'CatalogoController',
                controllerAs: 'catalogoCtrl'
            })
            .state('catalog.productor', {
                url: '/productores/:idProductor',
                templateUrl: 'app/comercio/varios/productor.html',
                controller: 'ProductorController'
            })
            .state('catalog.userOrders', {
                url: '/misPedidos',
                templateUrl: 'app/comercio/carrito/lista-pedidos.html',
                controller: 'ListaPedidosController',
                controllerAs: 'listaPedidoCtrl',
                auth: true
            })
            .state('catalog.userGroups', {
                url: '/misGrupos',
                templateUrl: 'app/comercio/administracion/gcc-tab/groups.tmpl.html',
                controller: 'GroupsController',
                auth: true,
                abstract: true,
            })
    
                .state('catalog.userGroups.all', {
                  url: '/todos',
                  templateUrl: 'app/comercio/administracion/gcc-tab/groupsList.tmpl.html',
                  controller: 'GroupsListController',
                  auth: true
                })
                .state('catalog.userGroups.help', {
                  url: '/ayuda',
                  templateUrl: 'app/comercio/administracion/gcc-tab/groupsHelp.tmpl.html',
                  controller: 'HelpGCCController',
                  auth: true
                })
                .state('catalog.userGroups.invitations', {
                  url: '/invitaciones',
                  templateUrl: 'app/comercio/administracion/gcc-tab/groupsInvitations.tmpl.html',
                  controller: 'InvitationsGCCController',
                  auth: true
                })
                .state('catalog.userGroups.group', {
                    url: '/:groupId',
                    templateUrl: 'app/comercio/administracion/gcc-tab/group.tmpl.html',
                    controller: 'GroupController',
                    //abstract: true,
                    auth: true
                })
                    // No se esta usando la sección de pedido actual
                    //
                    // .state('catalog.userGroups.group.membersOrders', {
                    //     url: '/pedidoActual',
                    //     templateUrl: 'app/comercio/administracion/gcc-tab/groupOrder.tmpl.html',
                    //     controller: 'GroupOrderController',
                    //     auth: true
                    // })
                    .state('catalog.userGroups.group.historicOrders', {
                        url: '/historial',
                        templateUrl: 'app/comercio/administracion/gcc-tab/groupOrders.tmpl.html',
                        //controller: 'GroupOrdersController',
                        auth: true
                    })
                    .state('catalog.userGroups.group.members', {
                        url: '/integrantes',
                        templateUrl: 'app/comercio/administracion/gcc-tab/groupMembers.tmpl.html',
                        controller: 'groupMembersController',
                        auth: true
                    })
                    .state('catalog.userGroups.group.admin', {
                        url: '/administracion',
                        templateUrl: 'app/comercio/administracion/gcc-tab/groupAdmin.tmpl.html',
                        controller: 'GroupAdminController',
                        auth: true
                    })
            .state('catalog.userNodes', {
                url: '/misNodos',
                templateUrl: 'app/comercio/administracion/nodes-tab/nodes.tmpl.html',
                controller: 'NodesCtrl',
                auth: false,
                abstract: true,
            })
                .state('catalog.userNodes.openNodes', {
                  url: '/nodosAbiertos',
                  templateUrl: 'app/comercio/administracion/nodes-tab/openNodes.tmpl.html',
                  controller: 'OpenNodesController',
                  auth: false
                })
                .state('catalog.userNodes.invitations', {
                  url: '/invitaciones',
                  templateUrl: 'app/comercio/administracion/nodes-tab/nodesInvitations.tmpl.html',
                  controller: 'NodesInvitationsController',
                  auth: true
                })
                .state('catalog.userNodes.help', {
                  url: '/ayuda',
                  templateUrl: 'app/comercio/administracion/nodes-tab/nodesHelp.tmpl.html',
                  controller: 'NodeHelpCtrl',
                  auth: false
                })
                .state('catalog.userNodes.newNode', {
                  url: '/nuevoNodo',
                  templateUrl: 'app/comercio/administracion/nodes-tab/newNode.tmpl.html',
                  controller: 'NewNodeCtrl',
                  auth: true
                })
                .state('catalog.userNodes.editNewNode', {
                  url: '/editarNuevoNodo',
                  templateUrl: 'app/comercio/administracion/nodes-tab/editNewNode.tmpl.html',
                  controller: 'EditNewNodeCtrl',
                  auth: true
                })
                .state('catalog.userNodes.all', {
                  url: '/todos',
                  templateUrl: 'app/comercio/administracion/nodes-tab/nodesList.tmpl.html',
                  controller: 'NodesListCtrl',
                  auth: false
                })
                .state('catalog.userNodes.node', {
                    url: '/:nodeId',
                    templateUrl: 'app/comercio/administracion/nodes-tab/node.tmpl.html',
                    controller: 'NodeController',
                    //abstract: true,
                    auth: true
                })
                  .state('catalog.userNodes.node.members', {
                      url: '/integrantes',
                      templateUrl: 'app/comercio/administracion/nodes-tab/nodeMembers.tmpl.html',
                      controller: 'NodeMembersController',
                      auth: true
                  })
                  .state('catalog.userNodes.node.historicOrders', {
                      url: '/historial',
                      templateUrl: 'app/comercio/administracion/nodes-tab/nodeOrders.tmpl.html',
                      //controller: 'NodeOrdersController',
                      auth: true
                  })
                  .state('catalog.userNodes.node.admin', {
                      url: '/administracion',
                      templateUrl: 'app/comercio/administracion/nodes-tab/nodeAdmin.tmpl.html',
                      controller: 'NodeAdminController',
                      auth: true
                  })
            .state('catalog.deliveryPoints', {
                url: '/puntosDeEntrega',
                templateUrl: 'app/comercio/administracion/deliveryPoints.tmpl.html',
                controller: 'DeliveryPointsCtrl'
            })
            .state('catalog.notifications', {
                url: '/notificaciones',
                templateUrl: 'app/comercio/administracion/notificaciones.html',
                controller: 'PerfilController',
                controllerAs: 'perfilCtrl',
                auth: true
            })    
            .state('catalog.confirmOrder', {
                url: '/confirmacionDelPedido',
                templateUrl: 'app/comercio/carrito/confirm-order/confirm-order.tmpl.html',
                controller: 'ConfirmOrderCtrl',
                params: { 
                  actions: null, 
                  order: null
                },
                auth: true
            })
            .state('catalog.profile', {
                url: '/perfil',
                templateUrl: 'app/comercio/administracion/perfil.html',
                controller: 'PerfilController',
                controllerAs: 'perfilCtrl',
                params: { index: null },
                auth: true
            })
            .state('catalog.login', {
                url: '/login',
                templateUrl: 'app/comercio/administracion/formularios/login.html',
                controller: 'LogInController',
                controllerAs: 'loginCtrl',
                params: { toPage: null },
            })
            .state('catalog.singUp', {
                url: '/registro',
                templateUrl: 'app/comercio/administracion/registros/registro.html',
                controller: 'RegistroController'
            })
            .state('catalog.singUpGCCMailInvitation', {
                url: '/registro/gcc/:idInvitacion',
                templateUrl: 'app/comercio/administracion/registros/registro-invitacionGCC.tmpl.html',
                controller: 'RegistroInvitacionGCCController',
                params: { toPage: 'userGroups' },
            })
            .state('catalog.singUpNodeMailInvitation', {
                url: '/registro/nodos/:idInvitacion',
                templateUrl: 'app/comercio/administracion/registros/registro-invitacionGCC.tmpl.html',
                controller: 'RegistroInvitacionGCCController',
                params: { toPage: 'userNodes' },
            })
            .state('catalog.urlError', { // This is similar as landing page
                url: '/:urlError',
                templateUrl: 'app/comercio/principal/principal.html',
                controller: 'PrincipalController',
                controllerAs: 'principalCtrl'
            })
    
      .state('terminosYcondiciones', {
        url: '/terminosYcondiciones',
        templateUrl: 'app/comercio/varios/terminos.html',
        controller: 'TerminosCtrl',
      })


    
      .state('error', {
        url: '/error/:key',
        controller: 'ErrorController as error',
        templateUrl: 'app/error/error.html'
      })
    ;

    $urlRouterProvider.otherwise('/');
  }

})();
