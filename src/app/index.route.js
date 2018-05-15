(function() {
  'use strict';

  angular
    .module('chasqui')
    .config(routerConfig);

    
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/comercio/principal/home/home.tmpl.html',
            controller: 'HomeController'
        })
    
        .state('catalog', {
            url: '/:catalogShortName',
            templateUrl: 'app/comercio/principal/catalog/catalog.tmpl.html',
            controller: 'CatalogController',
            abstract: true
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
            .state('catalog.userOrders', {
                url: '/misPedidos',
                templateUrl: 'app/comercio/carrito/lista-pedidos.html',
                controller: 'ListaPedidosController',
                controllerAs: 'listaPedidoCtrl',
                auth: true
            })
            .state('catalog.userGroups', {
                url: '/misGrupos',
                templateUrl: 'app/comercio/administracion/lista-grupos.html',
                controller: 'ListaGruposController',
                auth: true
            })  
            .state('catalog.userNodes', {
                url: '/misNodos',
                templateUrl: 'app/comercio/administracion/lista-nodos.html',
                controller: 'ListaNodosCtrl',
                auth: true
            })            
            .state('catalog.form-grupo', {
                url: '/form-grupo',
                templateUrl: 'app/comercio/administracion/formularios/form-grupo.html',
                controller: 'FormGrupoController',
                controllerAs: 'formGrupoCtrl',
                auth: true,
                params: { "grupo": null }
            })           
            .state('catalog.deliveryPoints', {
                url: '/puntosDeEntrega',
                templateUrl: 'app/comercio/administracion/deliveryPoints.tmpl.html',
                controller: 'DeliveryPointsCtrl'
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
                controllerAs: 'loginCtrl'
            })
      

      .state('productor', {
        url: '/productores/:id',
        templateUrl: 'app/comercio/varios/productor.html',
        controller: 'ProductorController'
      })
      .state('como-comprar', {
        url: '/comoComprar',
        templateUrl: 'app/comercio/varios/como_comprar.html',
        controller: 'ComoComprarController',
        controllerAs: 'comoComprarCtrl'
      })
      .state('medalla', {
        url: '/medalla/:idMedalla',
        templateUrl: 'app/comercio/varios/medalla.html',
        controller: 'MedallaController',
        controllerAs: 'medallaCtrl'
      })
      .state('detalle-grupos', {
        url: '/detalle-grupos',
        templateUrl: 'app/comercio/administracion/detalle-grupos.html',
        controller: 'DetalleGruposController'        
      })
      .state('form-domicilio', {
        url: '/form-domicilio',
        templateUrl: 'app/comercio/administracion/formularios/form-direccion.html',
        controller: 'FormDireccionController',
        controllerAs: 'direccionCtrl',
        params: { test: null }
      })
      .state('form-grupo', {
        url: '/form-grupo',
        templateUrl: 'app/comercio/administracion/formularios/form-grupo.html',
        controller: 'FormGrupoController',
        controllerAs: 'formGrupoCtrl',
        params: { "grupo": null }
      })
      .state('login', {
        url: '/login/:toPage',
        templateUrl: 'app/comercio/administracion/formularios/login.html',
        controller: 'LogInController',
        controllerAs: 'loginCtrl'
      })
      .state('singUp', {
        url: '/registro',
        templateUrl: 'app/comercio/administracion/registros/registro.html',
        controller: 'RegistroController'
      })
      .state('singUpGCCMailInvitation', {
        url: '/registro/gcc/:id',
        templateUrl: 'app/comercio/administracion/registros/registro-invitacionGCC.tmpl.html',
        controller: 'RegistroInvitacionGCCController'
      })
      .state('form-usuario', {
        url: '/form-usuario',
        templateUrl: 'app/comercio/administracion/formularios/form-usuario.html',
        controller: 'FormUsuarioController',
        controllerAs: 'usuarioCtrl',
        params: { domicilio: null }
      })
      .state('lista-pedidos', {
        url: '/lista-pedidos',
        templateUrl: 'app/comercio/carrito/lista-pedidos.html',
        controller: 'ListaPedidosController',
        controllerAs: 'listaPedidoCtrl',
        auth: true
      })
      .state('detalle-pedido', {
        url: '/detalle-pedido',
        templateUrl: 'app/comercio/carrito/detalle-pedido.html',
        controller: 'DetallePedidoController',
        controllerAs : 'detallePedidoCtrl'
      })
      .state('catalogo', {
        url: '/catalogo',
        templateUrl: 'app/comercio/catalogo/catalogo.html',
        controller: 'CatalogoController',
        controllerAs: 'catalogoCtrl'
      })
      .state('perfil', {
        url: '/perfil',
        templateUrl: 'app/comercio/administracion/perfil.html',
        controller: 'PerfilController',
        controllerAs: 'perfilCtrl',
        params: { index: null },
        auth: true
      })
      .state('footer', {
        url: '/footer',
        templateUrl: 'app/comercio/varios/footer.html',
        controller: 'FooterController',
        controllerAs: 'footerCtrl'
      })
      .state('dialog', {
        url: '/dialog',
        templateUrl: 'app/comercio/demo/dialog1.tmpl.html',
        controller: 'DemoDialogController',
        controllerAs: 'demoDialogCtrl'
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
