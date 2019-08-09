(function() {
  'use strict';

  angular.module('chasqui').controller('GroupsListController', GroupsListController);

  
  function GroupsListController($log, $scope, $rootScope, $state, contextCatalogObserver, $mdDialog,
                    dialogCommons, gccService, URLS, agrupationTypeVAL, productoService, toastr,
                    us, usuario_dao, contextPurchaseService, contextAgrupationsService, vendedorService) {


    $scope.urlBase = URLS.be_base;
    $scope.showOptions = [];
    $scope.newGroup = newGroup;
    $scope.showOptionsForGroup = showOptionsForGroup;
    $scope.countOrdersConfirmed = countOrdersConfirmed;
    $scope.montoTotalGrupo = montoTotalGrupo;
    $scope.getClassForItemGroup = getClassForItemGroup;
    $scope.goToCatalog = goToCatalog;
    $scope.miembrosActivosDelGrupo = miembrosActivosDelGrupo;
    $scope.selfPara = selfPara;
    $scope.getLoggedUser = getLoggedUser;

    $scope.isLoggedUser = isLoggedUser;
    $scope.classForState = classForState;
    $scope.vocativoPara = vocativoPara;
    $scope.totalForMember = totalForMember;
    $scope.isLoggedUserGroupAdmin = isLoggedUserGroupAdmin;
    

    $scope.confirmGCCOrder = confirmGCCOrder;
    $scope.puedeCerrarPedidoGCCSegunEstrategias = puedeCerrarPedidoGCCSegunEstrategias;
    $scope.puedeCerrarPedidoGCC = puedeCerrarPedidoGCC;
    

    ///////////////////////////////////////

    function newGroup(){

        function doOk(newGroup){
            contextAgrupationsService.reset(contextPurchaseService.getCatalogContext());
            init();
        }

        dialogCommons.newGroup(doOk);
    }
      
    function showOptionsForGroup(groupIndex){
        $scope.showOptions = $scope.showOptions.map(function(o,i){return i == groupIndex && !o});
    }
      
    function countOrdersConfirmed(group){
        return countOrdersWithState(group, "CONFIRMADO");
    }
      
      
    function getClassForItemGroup(i){
        return $scope.showOptions[i]? "ch-item-selected" : "ch-item-no-selected";
    }

    function goToCatalog(group){
      contextPurchaseService.setContextByAgrupation(group);
      $state.go('catalog.products');
    }
      
    function miembrosActivosDelGrupo(group){
      return group.miembros.filter(function(m) { return m.invitacion == 'NOTIFICACION_ACEPTADA' });
    }

    function selfPara(miembro){
      return miembro.nickname + ((miembro.email == usuario_dao.getUsuario().email) ? " (Vos)" : ""); 
    }

    function getLoggedUser(group){
        return group.miembros.filter(isLoggedUser)[0];
    }

    function isLoggedUser(member){
      return member.email == usuario_dao.getUsuario().email;
    }

    function vocativoPara(miembro){
        return (miembro.email == usuario_dao.getUsuario().email) ? "tuyos" : "de " + miembro.nickname;
    }

    function isLoggedUserGroupAdmin(group){
      return group.miembros[0].email == usuario_dao.getUsuario().email;
    }

    function classForState(state){
      var res = {
          ABIERTO: "ch-estado-pedido-abierto",
          CANCELADO: "ch-estado-pedido-cancelado",
          CONFIRMADO: "ch-estado-pedido-confirmado"
      };

      return res[state];
    }


    function puedeCerrarPedidoGCC(group){
      return !hayAlgunPedidoAbierto(group) && hayAlgunPedidoConfirmado(group) && montoTotalGrupo(group) >= $scope.montoMinimo;
    }


    function puedeCerrarPedidoGCCSegunEstrategias(group){
        return !hayAlgunPedidoAbierto(group) && hayAlgunPedidoConfirmado(group);
    }

    function hayAlgunPedidoAbierto(group) {
        return algunPedidoTieneEstado(group.miembros, 'ABIERTO');
    }

    function hayAlgunPedidoConfirmado(group){
        return algunPedidoTieneEstado(group.miembros, 'CONFIRMADO');
    }

    function algunPedidoTieneEstado(miembros, estado){
        return any(miembros, function(m){return m.pedido != null && m.pedido.estado == estado})
    }

    function any(list, property){
        return list != undefined && list.reduce(function(r,e){return r || property(e)}, false);
    }
    
    function totalForMember(member){
      return member.pedido != null? member.pedido.productosResponse.reduce(function(r,p){return r + (p.precio * p.cantidad)}, 0): 0;
    }

    function montoTotalGrupo(group){
        return group.miembros != undefined? group.miembros.reduce(function(r,m){
            if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
                return r + m.pedido.montoActual;
            }else{
                return r;
            }
        }, 0) : 0;
    }

    // Confirm group's order

    function confirmGCCOrder(group) {	
      var actions = {
          doOk: doConfirmOrder(group),
          doNotOk: ignoreAction
      };

      var activeMembers = group.miembros.filter(function(m){return m.pedido != null && m.pedido.estado == "CONFIRMADO"});

      var adHocOrder = {
          montoActual: activeMembers.reduce(function(r,m){return r + m.pedido.montoActual}, 0),
          nombresDeMiembros: activeMembers.map(function(m){return m.nickname}),
          montoActualPorMiembro: activeMembers.reduce(function(r,m){r[m.nickname] = m.pedido.montoActual; return r}, {}),
          type: agrupationTypeVAL.TYPE_GROUP
      }

      dialogCommons.selectDeliveryAddress(actions, adHocOrder);
    }

    function doConfirmOrder(group){
      return function(selectedAddress, answers) {
        $log.debug('callConfirmar', $scope.pedido);

        function doOk(response) {
              $log.debug("--- confirmar pedido response ", response.data);
              toastr.success(us.translate('PEDIDO_CONFIRMADO_MSG'),us.translate('AVISO_TOAST_TITLE'));
              location.reload();
        }

        var params = {
            idGrupo: group.idGrupo,
            idDireccion: "",
            idPuntoDeRetiro: "",
            idZona: "",
            comentario: "",
            opcionesSeleccionadas: answers.map(function(a){
                return {
                    nombre: a.nombre,
                    opcionSeleccionada: a.answer
                }
            })
        }

        gccService.confirmarPedidoColectivo(completeConfirmColectiveOrderParams(params, selectedAddress)).then(doOk);
      }
    }

    function completeConfirmColectiveOrderParams(params, selectedAddress){
      return {
          address: function(){
              params.idDireccion = selectedAddress.selected.idDireccion;
              params.idZona = selectedAddress.zone.id;
              params.comentario = selectedAddress.particularities;
              return params;
          },
          deliveryPoint: function(){
              params.idPuntoDeRetiro = selectedAddress.selected.id;
              return params;
          }
      }[selectedAddress.type]();
    }


    function ignoreAction(){
      $mdDialog.hide();
    }

    // Privado
      
    function countOrdersWithState(group, state){        
        return group.miembros.filter(function(m){return m.pedido != null && m.pedido.estado == state}).length;
    }
      
    function toTop(){
      window.scrollTo(0,0);
    }
    //////////////////////////////////////////
      
    $rootScope.$on('group-information-actualized', init);
      
    $rootScope.$on('groups-are-loaded', init);
      
    /////////////////// INIT ////////////////////

    function init(){
        vendedorService.obtenerConfiguracionVendedor().then(
            function(response){
                $scope.montoMinimo = response.data.montoMinimo;
            }
        );
        toTop();
    }

    init();

  }

})();
