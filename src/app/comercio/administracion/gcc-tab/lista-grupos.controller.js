(function() {
  'use strict';

  angular.module('chasqui').controller('ListaGruposController', ListaGruposController);

  
  function ListaGruposController($log, $scope, $state, contextCatalogObserver,
                    dialogCommons, ToastCommons, gccService, URLS, agrupationTypeVAL,
                    us, usuario_dao, navigation_state, contextPurchaseService, contextAgrupationsService) {

    $log.debug("controler ListaGruposController");
    navigation_state.goMyGroupsTab();

    $scope.urlBase = URLS.be_base;
    $scope.groups = [];
    $scope.selectedGroup = null;
    $scope.selectedIndexGrupo = 0;
    $scope.newGroup = newGroup;
    $scope.states = ["Abierto", "Confirmado", "Preparado", "Enviado"];

    ///////////////////////////////////////

    function newGroup(){

        function doOk(newGroup){
            contextAgrupationsService.reset(contextPurchaseService.getCatalogContext());
            init();
        }

        dialogCommons.newGroup(doOk);
    }


    function callLoadGrupos() {
        $log.debug("--- find grupos--------");
        contextCatalogObserver.observe(function(){
            contextPurchaseService.getAgrupations().then(function(agrupationsInt){
                contextPurchaseService.getSelectedAgrupation().then(function(selectedAgrupation){
                    $scope.groups = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(), agrupationTypeVAL.TYPE_GROUP);
                    setTabSeleccionado(selectedAgrupation);
                })
            });
        })
    }


    function setTabSeleccionado(selectedAgrupation) {
        $scope.selectedIndexGrupo = $scope.groups.indexOf(selectedAgrupation);
        $scope.selectedIndexGrupo = $scope.selectedIndexGrupo == -1? 0 : $scope.selectedIndexGrupo;
        $scope.selectedGroup = $scope.groups[$scope.selectedIndexGrupo];
        getOrdersWithState($scope.states.map(mapToBEStates));
    }

      
    function getOrdersWithState(state){
        contextCatalogObserver.observe(function(){

            function doOk(response) {
                $scope.pedidosFiltrados = response.data;
                $scope.pedidosFiltrados.reverse();
                console.log($scope.pedidosFiltrados);    
            }

            gccService.pedidosColectivosConEstado($scope.selectedGroup.idGrupo, state).then(doOk);
        })
    }   
      
    function mapToBEStates(state){
      var capState = state.toUpperCase();
      if(capState == "ENVIADO"){
        return "ENTREGADO";
      }else{
        return capState;
      }
    }
    //////////////////////////////////////////
      
    $scope.$on('group-information-actualized', function(event) {
        init();
    });
      
      
    /////////////////// INIT ////////////////////

    function init(){
        callLoadGrupos();
    }

    init();

  }

})();
