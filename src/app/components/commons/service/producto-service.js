(function(){
	'use strict';

	angular.module('chasqui').service('productoService', productoService);

	function productoService(restProxy, setPromise, $log, REST_ROUTES, promiseService, 
                              toastr, $stateParams, contextCatalogsService) {
		
        var productoServiceInt = {
            getCategorias: getCategorias,
            getMedallas: getMedallas,
            getMedallasProductor: getMedallasProductor,
            getProductosDestacados: getProductosDestacados,
            getProductosByMultiplesFiltros: getProductosByMultiplesFiltros,
            getProductosSinFiltro: getProductosSinFiltro,
            getProductosByCategoria: getProductosByCategoria,
            getProductosByProductor: getProductosByProductor,
            getProductosByMedalla: getProductosByMedalla,
            getProductosByMedallaProductor: getProductosByMedallaProductor,
            getProductosByQuery: getProductosByQuery,
            crearPedidoIndividual: crearPedidoIndividual,
            verPedidoIndividual: verPedidoIndividual,
            agregarPedidoIndividual: agregarPedidoIndividual,
            quitarProductoIndividual: quitarProductoIndividual,
            cancelarPedidoIndividual: cancelarPedidoIndividual,
            confirmarPedidoIndividual: confirmarPedidoIndividual,
            verDirecciones: verDirecciones,
            imagenProducto: imagenProducto
        };

        
        ///////////////////////////////////////// Public \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        function getCategorias(){
            return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service getCategorias ");
                    defered.resolve(promiseService.doGet(REST_ROUTES.categorias(catalog.id), {}));
                })
            });
        }

        function getMedallas(){
            $log.debug(" service getMedallas ");
            return promiseService.doGet(REST_ROUTES.medallasProducto, {});
        }

        function getMedallasProductor(){
            $log.debug(" service getMedallasProdcutor ");
            return promiseService.doGet(REST_ROUTES.medallasProductor, {});
        }

        function getProductosDestacados(){
            return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service getProductosDestacados ");
                    defered.resolve(promiseService.doGet(REST_ROUTES.productosDestacadosByVendedor(catalog.id), {}));
                });
            });
        }
        //crear funcion de REST
        function getProductosByMultiplesFiltros(params){
            return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service getProductosByMultiplesFiltros ");
                    defered.resolve(promiseService.doPostPublic(REST_ROUTES.productosByMultiplesFiltros(catalog.id), params));
                });
            });
        }

        function getProductosSinFiltro(params) {
            return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service getProductosSinFiltro ");
                    defered.resolve(promiseService.doPostPublic(REST_ROUTES.productosSinFiltro(catalog.id), params));
                });
            });
        }

        function getProductosByCategoria(params) {
            $log.debug(" service getProductosByCategoria ");
            return promiseService.doPostPublic(REST_ROUTES.productosByCategoria, params);
        }

        function getProductosByProductor(params) {
            $log.debug(" service getProductosByProductor ");
            return promiseService.doPostPublic(REST_ROUTES.productosByProductor, params);
        }

        function getProductosByMedalla(params) {
            $log.debug(" service getProductosByMedalla ");
            return promiseService.doPostPublic(REST_ROUTES.productosByMedalla, params);
        }

        function getProductosByMedallaProductor(params) {
            $log.debug(" service getProductosByMedallaProductor ");
            return promiseService.doPostPublic(REST_ROUTES.productosByMedallaProductor, params);
        }

        function getProductosByQuery(params) {
            $log.debug(" service getProductosByQuery ");
            return promiseService.doPostPublic(REST_ROUTES.productosByQuery, params);
        }

        function agregarPedidoIndividual(params) {
            $log.debug(" service agregarPedidoIndividual ");

            function doNoOk(response) {
                if (response.status == 404) {
                    toastr.error(response.data.error, "Error");
                } else {
                    toastr.error("ocurrio un error inesperado" , "Error");
                }
            }

            return promiseService.doPut(REST_ROUTES.agregarPedidoIndividual, params, doNoOk);
        }

        function crearPedidoIndividual(params, doNoOK) {
            $log.debug(" service crearPedidoIndividual ");

            return promiseService.doPost(REST_ROUTES.crearPedidoIndividual, params, doNoOK);
        }

        function verPedidoIndividual(params) {
            return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service verPedidoIndividual ");

                    function doNoOk(response) {
                        defered.reject(response);
                    }

                    var promise = promiseService.doGetPrivate(REST_ROUTES.verPedidoIndividual(catalog.id), {}, doNoOk);

                    promise.then(defered.resolve);
                });
            });
        }

        function quitarProductoIndividual(params) {
            $log.debug(" service quitarProductoIndividual ");
            return promiseService.doPut(REST_ROUTES.quitarProductoIndividual, params);
        }

        function cancelarPedidoIndividual(id) {
            $log.debug(" service cancelarPedidoIndividual ");
            return promiseService.doDelete(REST_ROUTES.cancelarPedidoIndividual(id), {});
        }

        function verDirecciones(params) {
            $log.debug(" service verDirecciones ");
            return promiseService.doGetPrivate(REST_ROUTES.verDirecciones, {});
        }

        function imagenProducto(id) {
            $log.debug(" service verDirecciones ");
            return promiseService.doGet(REST_ROUTES.imagenProducto(id), {});
        }

        function confirmarPedidoIndividual(params) {
            return promiseService.doPost(REST_ROUTES.confirmarPedidoIndividual, params);
        }
        
        
        ///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                
        
        return productoServiceInt;

	}
})();
