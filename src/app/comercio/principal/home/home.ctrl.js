(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('HomeController', HomeController);

    
	function HomeController($scope, URLS, contextCatalogsService, $state, sellerService) {
        
    $scope.catalogs = [];
    $scope.url = url;
    $scope.goToCatalog = goToCatalog;
    $scope.catalogOrganizationType = catalogOrganizationType;
        

    ////////////////////////////////////

    function catalogOrganizationType(catalog){
      return catalog.tagsTipoOrganizacion.length > 0? catalog.tagsTipoOrganizacion[0].nombre : "";
    }

    // busqueda de catalogos

    $scope.tags = {};
    $scope.selectedTags = {
      idTagTipoOrganizacion: 0,
      idTagTipoProducto: 0,
      idTagZonaDeCobertura: 0,
      nombre: "",
      usaEstrategiaNodos: false,
      usaEstrategiaGrupos: false,
      usaEstrategiaIndividual: false,
      entregaADomicilio: false,
      usaPuntoDeRetiro: false
    }

    $scope.confirmSearch = function (){
      // adaptacion

      const selectedTags = {
        nombre: $scope.selectedTags.nombre,
        usaEstrategiaNodos: $scope.selectedTags.usaEstrategiaNodos,
        usaEstrategiaGrupos: $scope.selectedTags.usaEstrategiaGrupos,
        usaEstrategiaIndividual: $scope.selectedTags.usaEstrategiaIndividual,
        entregaADomicilio: $scope.selectedTags.entregaADomicilio,
        usaPuntoDeRetiro: $scope.selectedTags.usaPuntoDeRetiro,
      }
      selectedTags.idsTagsTipoOrganizacion = $scope.selectedTags.idTagTipoOrganizacion == 0? [] : [$scope.selectedTags.idTagTipoOrganizacion];
      selectedTags.idsTagsTipoProducto = $scope.selectedTags.idTagTipoProducto == 0? [] : [$scope.selectedTags.idTagTipoProducto];
      selectedTags.idsTagsZonaDeCobertura = $scope.selectedTags.idTagZonaDeCobertura == 0? [] : [$scope.selectedTags.idTagZonaDeCobertura];

      console.log(selectedTags);

      sellerService.getSellersWithTags(selectedTags).then(function(response){
        $scope.catalogs = response.data;
        console.log($scope.catalogs);
      })

    }

    ////////////////////////////////////

        
    function url(path){
        return URLS.be_base + path;
    }
    
    function goToCatalog(catalogShortName){
        $state.go('catalog.landingPage', {catalogShortName: catalogShortName});
    }
    
    function init(){
      contextCatalogsService.getCatalogs().then(function(catalogs){
          $scope.catalogs = catalogs;
      })
      sellerService.getSellersTags().then(function(response){
        $scope.tags = response.data;
        console.log($scope.tags);
      })
    }
    
    init();
	}
})();
