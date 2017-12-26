(function() {
    'use strict';

    angular
        .module('chasqui')
        .controller('DemoController', DemoController);

    /** @ngInject */
    function DemoController($log, $filter, us) {
        $log.debug('DemoController ..... ');

        var vm = this

        vm.texto = " Chasqui"

        vm.textoTraducido = $filter('translate')('TRANS_EXA');
        vm.textoTraducidoService = us.translate('TRANS_EXA');

    }
})();
