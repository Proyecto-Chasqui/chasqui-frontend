(function () {
    'use strict';

    angular.module('chasqui').service('contextCatalogsService', contextCatalogsService);

    function contextCatalogsService(catalogs_dao, sellerService, setPromise) {


        ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        var contextCatalogsServiceInt = {
            getCatalogs: getCatalogs,
            getCatalog: getCatalog,
            getCatalogByShortName: getCatalogByShortName
        };


        ///////////////////////////////////////// Public \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


        function getCatalogs() {
            return setPromise(function (defered) {
                var preCacheCatalogs = catalogs_dao.getCatalogs();
                if (preCacheCatalogs.length > 0) {
                    defered.resolve(preCacheCatalogs);
                } else {
                    sellerService.getSellers().then(function (response) {
                        var data = response.data.data.map((data) => (sellerService.normalizadorVendedores(data)));
                        catalogs_dao.loadCatalogs(data);
                        //catalogs_dao.loadCatalogs(response.data);
                        defered.resolve(catalogs_dao.getCatalogs());
                    });
                }
            });
        }


        function getCatalog(catalogId) {
            return setPromise(function (defered) {
                getCatalogs().then(function (catalogs) {
                    defered.resolve(catalogs.filter(function (c) { return c.id == catalogId })[0]);
                });
            });
        }


        function getCatalogByShortName(catalogShortName) {
            return setPromise(function (defered) {
                getCatalogs().then(function (catalogs) {
                    defered.resolve(catalogs.filter(function (c) { return c.nombreCorto.toLowerCase() == catalogShortName.toLowerCase() })[0]);
                });
            });
        }

        ///////////////////////////////////////// INIT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        return contextCatalogsServiceInt;
    }
    
})();   