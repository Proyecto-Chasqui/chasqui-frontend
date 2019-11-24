(function() {
  'use strict';

  angular.module('chasqui').controller('NodesListCtrl', NodesListCtrl);

  function NodesListCtrl(URLS, $scope, $rootScope, $state, contextPurchaseService, nodeService, $log, toastr,
                         usuario_dao, perfilService, us, dialogCommons, $mdDialog, agrupationTypeVAL,
                         contextOrdersService, contextAgrupationsService) {

    // Interfaz

    $scope.urlBase = URLS.be_base;
    $scope.showOptions = [];
    $scope.openRequests = $scope.openRequests;
    $scope.showOptionsForNode = showOptionsForNode;
    $scope.isLoggedUserNodeAdmin = isLoggedUserNodeAdmin;
    $scope.userIsLog = usuario_dao.isLogged();
    $scope.goToCatalog = goToCatalog;
    $scope.montoTotalNodo = montoTotalNodo;
    $scope.montoSinIncentivo = montoSinIncentivo;
    $scope.incentivoNodo = incentivoNodo;
    $scope.countOrdersConfirmed = countOrdersConfirmed;
    $scope.showGoToCatalog = showGoToCatalog;
    $scope.nodeActiveMembers = nodeActiveMembers;
    $scope.totalForMember = totalForMember;
    $scope.puedeCerrarPedidoGCC = puedeCerrarPedidoGCC;
    $scope.puedeCerrarPedidoGCCSegunEstrategias = puedeCerrarPedidoGCCSegunEstrategias;
    $scope.confirmNodeOrder = confirmNodeOrder;

    // Implementación


    function showOptionsForNode(nodeIndex){
      $scope.showOptions = $scope.showOptions.map(function(o,i){return i == nodeIndex && !o});
    }

    function isLoggedUserNodeAdmin(node){
      return node.esAdministrador;
    }

    function montoTotalNodo(node){
      return node.miembros != undefined? node.miembros.reduce(function(r,m){
        if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
            return r + m.pedido.montoActual + m.pedido.incentivoActual;
        }else{
            return r;
        }
      }, 0) : 0;
    }

    function montoSinIncentivo(node){
      return node.miembros != undefined? node.miembros.reduce(function(r,m){
        if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
            return r + m.pedido.montoActual;
        }else{
            return r;
        }
      }, 0) : 0;
    }

    function incentivoNodo(node){
      return node.miembros != undefined? node.miembros.reduce(function(r,m){
        if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
            return r + m.pedido.incentivoActual;
        }else{
            return r;
        }
      }, 0) : 0;
    }

    function countOrdersConfirmed(node){
      return countOrdersWithState(node, "CONFIRMADO");
    }

    function nodeActiveMembers(node){
      return node.miembros.filter(function(m) { return m.invitacion == 'NOTIFICACION_ACEPTADA' });
    }

    function totalForMember(member){
      return member.pedido != null? member.pedido.productosResponse.reduce(function(r,p){return r + ((p.precio + p.incentivo) * p.cantidad)}, 0): 0;
    }

    function puedeCerrarPedidoGCC(node){
      return !hayAlgunPedidoAbierto(node) && hayAlgunPedidoConfirmado(node) && montoTotalNodo(node) >= $scope.montoMinimo;
    }

    function puedeCerrarPedidoGCCSegunEstrategias(node){
        return !hayAlgunPedidoAbierto(node) && hayAlgunPedidoConfirmado(node);
    }

    function hayAlgunPedidoAbierto(node) {
        return algunPedidoTieneEstado(node.miembros, 'ABIERTO');
    }

    function hayAlgunPedidoConfirmado(node){
        return algunPedidoTieneEstado(node.miembros, 'CONFIRMADO');
    }

    function algunPedidoTieneEstado(miembros, estado){
        return any(miembros, function(m){return m.pedido != null && m.pedido.estado == estado})
    }

    function showGoToCatalog(node){
      const pedido = node.miembros.filter(function(m){
        return m.email == usuario_dao.getUsuario().email;
      })[0].pedido;

      return pedido == null || ( pedido.productosResponse.length >= 0 && pedido.estado != 'CONFIRMADO');
    }

    function confirmNodeOrder(node){
      var actions = {
          doOk: doConfirmOrder(node),
          doNotOk: ignoreAction
      };

      var activeMembers = node.miembros.filter(function(m){return m.pedido != null && m.pedido.estado == "CONFIRMADO"});

      var adHocOrder = {
          montoActual: activeMembers.reduce(function(r,m){return r + m.pedido.montoActual + m.pedido.incentivoActual}, 0),
          nombresDeMiembros: activeMembers.map(function(m){return m.nickname}),
          montoActualPorMiembro: activeMembers.reduce(function(r,m){r[m.nickname] = m.pedido.montoActual + m.pedido.incentivoActual; return r}, {}),
          type: agrupationTypeVAL.TYPE_NODE,
          idDireccion: node.direccionDelNodo.id,
          node: node
      }

      dialogCommons.selectDeliveryAddress(actions, adHocOrder);

    }

    function doConfirmOrder(node){
      return function(selectedAddress, answers) {
        $log.debug('callConfirmar', node);

        function doOk(response) {
          $log.debug("--- confirmar pedido response ", response.data);
          toastr.success(us.translate('PEDIDO_CONFIRMADO_MSG'),us.translate('AVISO_TOAST_TITLE'));
          contextOrdersService.confirmAgrupationOrder(contextPurchaseService.getCatalogContext(),
                                                      node.id,
                                                      agrupationTypeVAL.TYPE_NODE)
          .then(function (){
            contextAgrupationsService.confirmAgrupationOrder(contextPurchaseService.getCatalogContext(),
                                                              node.id,
                                                              agrupationTypeVAL.TYPE_NODE);
            $rootScope.$emit("nodes-information-actualized");
            dialogCommons.askToCollaborate();
          });
          toTop();
        }

        var params = {
            idGrupo: node.id,
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

        nodeService.confirmNodeOrder(completeConfirmColectiveOrderParams(params, selectedAddress)).then(doOk);
      }
    }

    function completeConfirmColectiveOrderParams(params, selectedAddress){
      params.idDireccion = selectedAddress.selected.idDireccion;
      params.comentario = selectedAddress.particularities;
      return params;
    }

    function ignoreAction(){
      $mdDialog.hide();
    }

    function callNotificaciones() {
			function doOk(response) {
				$scope.invitaciones = response.data.filter(function(notificacion){
          return notificacion.estado == 'NOTIFICACION_NO_LEIDA' && isCompraColectiva(notificacion);
        }).length;
			}
			perfilService.notificacionesNoLeidas().then(doOk);
    }
    
    function isCompraColectiva(notificacion){			
			return us.contieneCadena(notificacion.mensaje ,'ha invitado al nodo de compras colectivas');
    }

    function goToCatalog(node){
      contextPurchaseService.setContextByAgrupation(node);
      $state.go('catalog.products');
    }
    // Privado
      
    function countOrdersWithState(node, state){
      return node.miembros.filter(function(m){return m.pedido != null && m.pedido.estado == state}).length;
    }  

    function any(list, property){
      return list != undefined && list.reduce(function(r,e){return r || property(e)}, false);
    } 

    function toTop(){
      window.scrollTo(0,0);
    }

    // Inicialización
    function init(){
      if(usuario_dao.isLogged()){
        nodeService.openRequests(contextPurchaseService.getCatalogContext())
        .then(function(response){
          $scope.openRequests = response.data.filter(function(r){
            return r.estado == "solicitud_nodo_en_gestion";
          });
        })
        $scope.showOptions = $scope.nodes.map(function(n){return false});
        callNotificaciones();
      }
      toTop();
    }

    $rootScope.$on('nodes-are-loaded', init);

    init();

  }

})();
