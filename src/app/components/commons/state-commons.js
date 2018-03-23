(function() {
  'use strict';

  angular.module('chasqui').service('StateCommons', StateCommons);

  function StateCommons($localStorage, $log, us, REST_ROUTES, usuario_dao) {
    $log.debug('INIT localstorage', $localStorage);

    var vm = this;
    vm.ls = $localStorage;

    vm.ls.notificacionActiva = false;


  } // function
})(); // anonimo
