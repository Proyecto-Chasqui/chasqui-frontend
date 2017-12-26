(function() {
    'use strict';

    angular
        .module('chasqui')
        .controller('FooterController', FooterController);

    /** @ngInject */
    function FooterController($log) {
        $log.debug('FooterController ..... ');

        var vm = this

        vm.texto = " Chasqui"


    }
})();
