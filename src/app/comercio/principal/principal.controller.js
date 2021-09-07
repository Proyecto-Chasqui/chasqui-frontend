(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('PrincipalController', PrincipalController);

  /** @ngInject */
  function PrincipalController($scope, $log, navigation_state,vendedorService,URLS,$state, contextPurchaseService, contextCatalogObserver) {
    $log.debug("PrincipalController ..... ");
    navigation_state.goWelcomeTab();
    var vm = this;

    $scope.imageurl1 = "app/components/image/banner-chasqui2.jpg";
    $scope.imageurl2 = "app/components/image/banner-chasqui.jpg";
    $scope.imageurl3 = "app/components/image/banner-chasqui3.jpg";
    $scope.texto = "<h2><b>Quienes Somos</b></h2> <p>Chasqui es una herramienta multiplataforma de licencia libre que permite a diferentes organizaciones de la Economía Social y Solidaria (productores, comercializadoras y cooperativas de servicios,etc...) vender de forma electrónica sus productos y servicios desde su catálogo en la plataforma. Para los consumidores es una forma simple de acceder a una oferta variada y reconocer los diferenciales de la Economía Social, sus valores y su calidad.</p> </br> <p> Chasqui consta de una aplicación móvil y una aplicación web, que permiten realizar pedidos en las diversas modalidades que hemos identificado que proveen identidad, pero también sostenibilidad a la economía social: compras individuales y colectivas, nodos de consumo, almacenes y ferias. La herramienta busca visibilizar y poner en valor las caracterı́sticas del comercio justo y la Economía Social y Solidaria, promoviendo el consumo responsable a través de una interfaz atractiva e intuitiva. Además, Chasqui se desarrolla bajo licencia libre, lo que permite su difusión y adaptación a nuevos contextos, nacionales e internacionales.</p> </br> <p> Está previsto que pueda conectarse con complementos y programas que le permitan incorporar nuevas funcionalidades como: gestión de compras y ventas, control de stock, administración contable y financiera, sistemas de pago electrónico y monedas sociales, etc.</p> ";
    $scope.imagenUrlPortada = "app/components/image/imagenNoDisponiblePortada.jpg";
    $scope.nombreOrganizacion = "";
    $scope.imagesurls = ["app/components/image/banner-chasqui2.jpg","app/components/image/banner-chasqui.jpg","app/components/image/banner-chasqui3.jpg"];
    $scope.goToLink = goToLink;
    $scope.show = show;

    $scope.show_contacto = true;
    vm.ir = function(page) {
      $log.debug("ir a ..... ", page);
            toTop();
            $state.go(page);
    };

    function toTop(){
        window.scrollTo(0,0);
    }

    function validateForNullDir(data){
      var value = data + " "
      if(data === null || data === undefined || data === ""){
        value = "";
      }
      return value;
    }

    function validateForNull(data){
      var value = data + " "
      if(data === null || data === undefined || data === ""){
        value = "";
      }
      return value;
    }

    function formarDireccion(direccion){
      var direccionFormada = "";
      if(direccion !== null){
          var calle = validateForNullDir(direccion.calle);
          var altura = validateForNullDir(direccion.altura);
          var localidad = validateForNullDir(direccion.localidad);
          var provincia = validateForNullDir(direccion.provincia);
          var pais = validateForNullDir(direccion.pais);
          var codigo_postal = validateForNullDir(direccion.codigo_postal);
          direccionFormada = calle + altura + localidad + provincia + pais + codigo_postal;
      }      
      return direccionFormada
    }

    function completarDatosDeContacto(data){
      $scope.direccion = formarDireccion(data.direccion);
      $scope.celular = validateForNull(data.celular);
      $scope.telefono = validateForNull(data.telefono);
      $scope.email= validateForNull(data.email);
      $scope.url= validateForNull(data.url);
    }

    function show(field){
      return field != undefined && field != "";
    }

    function goToLink(url){
      if(!url.slice(0,4).includes("http")){
        url = "http://" + url;
      }

      window.open(url);
    }

    function init(){
      contextCatalogObserver.observe(function(){
        // contextPurchaseService.getSelectedCatalog().then(function(catalog){
          //if(catalog.portadaVisible){
            vendedorService.verDatosDePortada().then(function(response){
              if(response.data.portadaVisible.data[0]) {
                completarDatosDeContacto(response.data.dataContacto);
                var i;
                var text = response.data.textoPortada;
                var urlportada = response.data.urlImagenesPortada;
                if(text !== null){
                  if(text.length > 1){
                    $scope.texto = text;
                  }
                }
                if(urlportada != null){
                  if(urlportada.length >0){
                    $scope.imagenUrlPortada = URLS.be_base + urlportada[0];
                  }
                }
                if(response.data.urlImagenesBanner !== null){
                  for (i = 0; i < response.data.urlImagenesBanner.length; i++) { 
                    if(i===0){
                      $scope.imageurl1 = URLS.be_base + response.data.urlImagenesBanner[i];
                    }
                    if(i===1){
                      $scope.imageurl2 = URLS.be_base + response.data.urlImagenesBanner[i];
                    }
        
                    if(i===2){
                      $scope.imageurl3 = URLS.be_base + response.data.urlImagenesBanner[i];
                    }
                  }
                }
              } else {
                $state.go("catalog.products");
              }
            });

            vendedorService.obtenerConfiguracionVendedor().then(function(response){
              $scope.nombreOrganizacion = response.data.nombre;
            });
        // })
      });
    }

    init();
  }
})();
