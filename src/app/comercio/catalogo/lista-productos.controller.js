(function() {
  'use strict';

  angular.module('chasqui').controller('ListaProductosController',
    ListaProductosController);

  /**
   * @ngInject Lista de productos.
   */
  function ListaProductosController($scope, $rootScope, $log, URLS, REST_ROUTES, StateCommons,
    $state, toastr, productoService, us, contextCatalogsService,
    $mdDialog, productorService, contextPurchaseService, contextCatalogObserver,
        usuario_dao, $stateParams, addProductService, dialogCommons, vendedorService) {

    $log.debug('ListaProductosController',
      $scope.$parent.$parent.catalogoCtrl.isFiltro1);

    var CANT_ITEMS = REST_ROUTES.PRODUCTOS_X_PAG; // TODO : pasar a constante

    var vm = this;

    vm.otherCtrl = $scope.$parent.$parent.catalogoCtrl.isFiltro1;

    vm.urlBase = URLS.be_base;
    vm.productos = [];
    vm.ultimoFiltro = {};
    vm.medallaSelect = undefined;
    vm.pedidoSelected = undefined;
    vm.grupoSelected = undefined;
    vm.emprendedores = [];
    vm.emprendedorSelect = {};
    vm.activeIndex = 1; // Seteado desde paginador
    vm.lastPage = undefined;
    vm.permitirComprar = false;
    vm.isLogged = usuario_dao.isLogged();

    //////// dialogo medalla
    vm.showPrerenderedDialog = function(medalla) {
      vm.medallaSelect = medalla;
      $mdDialog.show({
        contentElement: '#myDialog',
        parent: angular.element(document.body),
        //targetEvent: ev,
        clickOutsideToClose: true
      });
    };

    vm.showPrerenderedDialogProductor = function(id) {

      angular.forEach(vm.emprendedores, function(empr, key) {
        if (empr.idProductor === id)
          vm.emprendedorSelect = empr;
      });

      $mdDialog.show({
        contentElement: '#productorDialog',
        parent: angular.element(document.body),
        //targetEvent: ev,
        clickOutsideToClose: true
      });

    }

    vm.cerrarDialogoMedalla = function() {
      $mdDialog.hide();
    }

    ////////////// dialogo producto

    vm.verProducto = function(product) {
      dialogCommons.showProductInfo(product);
    }


    // PAGINACION
    vm.currentPage = 0;
    vm.paging = {
     total: 0,
     current: 1,
     onPageChanged: loadPages,
    };

    // function loadPages() {
    //   $log.debug('Current page is : ' + vm.paging.current);
    //   // TODO : Load current page Data here
    //   vm.currentPage = vm.paging.current;

    //   findProductosPorMultiplesFiltros(vm.paging.current, CANT_ITEMS, vm.ultimoFiltro)
    // }

    vm.setLastPage = function(){
      $scope.$broadcast('setLastPage', vm.lastPage)
      $log.debug("BroadcastLastPage ", vm.lastPage)
    }

      $scope.$watch(vm.lastPage, vm.setLastPage());

      $scope.$on('paginatorChange', function(event, data){
      $log.debug("paginatorChange", vm.setLastPage);
      vm.activeIndex = data;
      vm.paging = {
        current: vm.activeIndex
      };
      loadPages();
  });

  //$scope.$on(vm.lastPage, vm.setLastPage());


    function loadPages() {
      $log.debug('Current page is : ' + vm.paging.current);
      $log.debug("Mi indice es:  " + vm.activeIndex);

      // TODO : Load current page Data here
      vm.currentPage = vm.paging.current;
      findProductosPorMultiplesFiltros(vm.paging.current, CANT_ITEMS, vm.ultimoFiltro);

    }
    $scope.$watch();
    //////////////////////////////

    function toTop(){
        window.scrollTo(0,0);
    }

    vm.agregar = function(variety) {
      if(vm.permitirComprar){
          if (usuario_dao.isLogged()) {
            if(variety.stock > 0){
              if(contextPurchaseService.getAgrupationContextType()){
                addProductService(variety);
              }else{
                dialogCommons.selectPurchaseContext(variety);
              }
            }else{
              dialogCommons.acceptIssue("Producto sin stock",
                                        "Lamentablemente no queda más stock, te recomendamos buscar productos similares",
                                        "Ok",
                                        function(){},
                                        function(){});
            }
          } else {
            toastr.info(us.translate('INVITARMOS_INGRESAR'));
            $log.debug('not logued" ', variety);
            contextPurchaseService.ls.varianteSelected = variety;
            $state.go('catalog.login');
          }       
      }else{
        showCatalogText();
      }
    }

    vm.mostrarDecimales = function(parteDecimal) {
      var res = Number(parteDecimal).toFixed(0).toString();
      if (res.length == 1) res += "0";
      return res;
    }

    vm.identificadorProducto = function(producto) {
      return producto.nombreProducto;
    }

    vm.mostrar = function(variety){
      if(usuario_dao.isLogged() && vm.permitirComprar){
        vm.agregar(variety);
      } else {
        var varietyName = (variety.nombreProducto === undefined)? variety.nombre : variety.nombreProducto;

        dialogCommons.modifyVarietyCount(
          variety,
          null,  // order
          {  // texts
              title: varietyName,
              okButtonAgregar: "Agregar al changuito",
              okButtonModificar: "",
              okButtonRemover: "",
              cancelButton: "Volver"
          },
          {  // texts
              title: varietyName,
              okButtonAgregar: "Agregar al changuito",
              okButtonModificar: "",
              okButtonRemover: "",
              cancelButton: "Volver"
          },
          0, // initial count
          { // actions
            doOk: function doOk(){
              vm.agregar(variety);
            },
            doNoOk:  function doNoOk(){
              return 0;
            }
         });
      }
    }

    // ///////////////////////
    // / Recive el evento de filtrado

    $scope.$on('filterEvent', function(event, query) {
      $log.debug("filterEvent", query);
      vm.ultimoFiltro = query;
      vm.paging.total = 0;
      vm.paging.current = 1;
      actualizar(query);
      vm.activeIndex = 1;
      $scope.$broadcast('setLastPage', vm.lastPage) // favio 27-7-18

      loadPages();
    });

    function actualizar(query) {
      findProductosPorMultiplesFiltros(vm.paging.current, CANT_ITEMS, query);
    }



    // /////////// REST


    function findProductosPorMultiplesFiltros(pagina, items, params){
      $log.debug('find productos multiples filtros');
      function doOk(response) {
        $log.debug('findProductosPorMultiplesFiltros Response ', response);

        vm.productos = response.data.productos;
        $log.debug('productos', vm.productos);
        vm.paging.total = Math.ceil(response.data.total / CANT_ITEMS);
        vm.paging.current = response.data.pagina;
        vm.paging.disponibles = Math.ceil(response.data.total / CANT_ITEMS);
        vm.pageNum = (6 <= vm.paging.disponibles)? 6 : vm.paging.disponibles;
        vm.lastPage = response.data.totalDePaginas;
        vm.setLastPage();
        toTop();
      }


      contextCatalogObserver.observe(function executeWhenCatalogIsLoaded(){          
        var query = {
          idVendedor: contextPurchaseService.getCatalogContext(),
          idCategoria: params.categoria,
          idProductor: params.productor,
          idsSellosProducto: params.sello == undefined? [] : params.sello,
          idsSellosProductor: params.selloProductor == undefined? [] : params.selloProductor,
          numeroDeOrden: StateCommons.getNextRandom(),
          query: params.query,
          pagina: pagina,
          cantItems: items,
          precio: 'Down'
        }
        $log.debug("parametros",params, query);

        productoService.getProductosByMultiplesFiltros(query).then(doOk);      
      })

    }


    function callEmprendedores() {
      $log.debug("---callEmprendedor ---");

      productorService.getProductores().then(function(data){ 
        vm.emprendedores = data.data; 
      })
    }

    

    function setCatalogState(callback){
      contextCatalogsService.getCatalogs().then(function(catalogs){
        contextPurchaseService.getSelectedCatalog().then(
              function(catalog){
                  vm.permitirComprar = catalog.ventasHabilitadas;
                  if(!vm.permitirComprar){
                    showCatalogText();
                  }
                  callback();
              }
          );
      })
    }

    function showCatalogText(){
      contextPurchaseService.getSelectedCatalog()
      .then(function(catalog){
        var text = catalog.mensajeVentasDeshabilitadas? 
          catalog.mensajeVentasDeshabilitadas :
          "Por el momento este catálogo no permite compras, sin embargo podés navegar los productos y gestionar los pedidos que tenías pendientes";

        toastr.error(text,"Ventas deshabilitadas");
      })
    }
    
    function init(){
      if (!us.isUndefinedOrNull(contextPurchaseService.ls.varianteSelected)) {
        $log.debug("tiene una variante seleccionda", contextPurchaseService.ls.varianteSelected)
        setCatalogState(function(){
          vm.agregar(contextPurchaseService.ls.varianteSelected);
          contextPurchaseService.ls.varianteSelected = undefined;
        })

      }
      setCatalogState(function(){});
      //vm.productos = findProductos(1,10,{});
      callEmprendedores();
      //loadPages();
      // findProductos();
    }
    
    init();
  }

})();
