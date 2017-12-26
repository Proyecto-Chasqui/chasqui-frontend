(function() {
  'use strict';

  angular
    .module('chasqui')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('principal', {
        url: '/',
        templateUrl: 'app/comercio/principal/principal.html',
        controller: 'PrincipalController',
        controllerAs: 'principalCtrl'
      })
      .state('menu', {
        url: '/menu',
        templateUrl: 'app/comercio/principal/menu.html',
        controller: 'MenuController',
        controllerAs: 'menu'
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
      .state('lista-grupos', {
        url: '/lista-grupos',
        templateUrl: 'app/comercio/administracion/lista-grupos.html',
        controller: 'ListaGruposController',
        controllerAs: 'listaGruposCtrl',
        auth: true
      })
      .state('detalle-grupos', {
        url: '/detalle-grupos',
        templateUrl: 'app/comercio/administracion/detalle-grupos.html',
        controller: 'DetalleGruposController'        
      })/*
      .state('pedido-grupos', {
        url: '/pedido-grupos',
        templateUrl: 'app/comercio/administracion/pedido-grupos.html',
        controller: 'PedidoGruposController',
        controllerAs: 'pedidoGruposCtrl'
      })*/
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
      .state('demo', {
        url: '/demo',
        templateUrl: 'app/comercio/demo/demo.html',
        controller: 'DemoController',
        controllerAs: 'demoCtrl'
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
