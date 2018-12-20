(function() {
    'use strict';

    angular
        .module('chasqui')
        .config(config);

    /** @ngInject */
    function config($logProvider, toastrConfig, $translateProvider, cfpLoadingBarProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Set options third-party lib
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 3000;
        maxOpened: 3,
        toastrConfig.positionClass = 'toast-top-left';
        toastrConfig.preventOpenDuplicates = true;
        toastrConfig.progressBar = true;
        cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Cargando ...</div>';

        ////////////// TRADUCCIONES
        /* TODO: VER por que no anda,  se dispara el proceso*/
        var langMap = {
            'en_AU': 'en',
            'en_CA': 'en',
            'en_NZ': 'en',
            'en_PH': 'en',
            'en_UK': 'en',
            'en_US': 'en',
            'es_AR': 'es',
            'es_BO': 'es',
            'es_CL': 'es',
            'es_CO': 'es',
            'es_CR': 'es',
            'es_DO': 'es',
            'es_EC': 'es',
            'es_SV': 'es',
            'es_GT': 'es',
            'es_HN': 'es',
            'es_MX': 'es',
            'es_NI': 'es',
            'es_PA': 'es',
            'es_PY': 'es',
            'es_PE': 'es',
            'es_PR': 'es',
            'es_ES': 'es',
            'es_UY': 'es',
            'es_VE': 'es'
        };

        var translationEntries = [];
        var files = [
            'common.json',
            'forms.json',
            'administracion.json',
            'carrito.json',
            'catalogo.json',
            'varios.json',
            'domicilio.json'
        ];

        angular.forEach(files, function(file) {
            translationEntries.push({ prefix: 'locales/', suffix: '/' + file });
        });

        $translateProvider.useSanitizeValueStrategy(null).useStaticFilesLoader({ files: translationEntries })
            .registerAvailableLanguageKeys(['en', 'es'], langMap).determinePreferredLanguage().fallbackLanguage(['en']);



    }

})();
