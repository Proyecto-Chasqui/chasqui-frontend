(function() {
  'use strict';

  angular.module('chasqui').service('StateCommons', StateCommons);

  function StateCommons($localStorage, $log, us, REST_ROUTES, usuario_dao) {
    $log.debug('INIT localstorage', $localStorage);

    var vm = this;
    vm.ls = $localStorage;

    vm.ls.notificacionActiva = false;


    vm.vendedor = function() {
      //TODO: pedir al servicio, hacer singleton con el LS
      var config = {
          id: REST_ROUTES.idVendedor,
          imagen: "/imagenes/usuarios/adminpds/puentedelsur.png"          
      };
      return config;
    }

  } // function
})(); // anonimo
