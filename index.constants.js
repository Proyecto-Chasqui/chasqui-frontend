/* global malarkey:false, moment:false */
(function() {
    'use strict';

    angular
        .module('chasqui')
        .constant('settings', {
            APP_TITLE: 'chasqui',
            API_URL: 'http://localhost/api',
            DEBUG_ENABLED: true
        })

        .constant('URLS', function() {
            
            var backends = [
                //    Servidor LOCAL
               "backend local", // COMPLETAR
                
                // Backend desarrollo
                "backend de desarrollo" // COMPLETAR
            ];
            
            var URL_BASE = backends[0];        

            var URL_REST_BASE = URL_BASE + "rest/";

            var PRODUCTO = URL_REST_BASE + "productos/";

            return {
                be_base: URL_BASE,

                be_rest: URL_REST_BASE,
            }

        }())
    
        .constant('IdVendedor', function(){
            
            var idVendedorConfig = 0; // COMPLETAR
        
            return idVendedorConfig;
        
        }());

})();
