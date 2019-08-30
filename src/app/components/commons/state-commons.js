(function() {
  'use strict';

  angular.module('chasqui').service('StateCommons', StateCommons);

  function StateCommons($localStorage, $log, us, REST_ROUTES, usuario_dao) {
    $log.debug('INIT localstorage', $localStorage);

    var vm = this;
    vm.ls = $localStorage;

    vm.ls.notificacionActiva = false;

    //                    hs mm ss ms
    const maxTimeRandom = 12*60*60*1000; // 12 horas

    vm.getNextRandom = function(){
      if(vm.ls.lastRandom == null || vm.ls.lastRandom == undefined || parseInt(moment().diff(vm.ls.lastRandom.time)) > maxTimeRandom){
          vm.ls.lastRandom = {
            time: moment(),
            random: Math.ceil(Math.random()*100)
          };
      }
      return vm.ls.lastRandom.random;
    }


  } // function
})(); // anonimo
