(function() {
  'use strict';

  angular.module('chasqui').controller('NodeMembersController', NodeMembersController);

  function NodeMembersController($log, $scope, $state, contextCatalogObserver, $rootScope, contextAgrupationsService,
                          dialogCommons, toastr, nodeService, URLS, agrupationTypeVAL,
                          us, usuario_dao, navigation_state, contextPurchaseService) {

    $scope.requests = [];
    $scope.exitGroup = exitGroup;    
    $scope.isAdmin = false;
    $scope.allContacts;
    $scope.membersOptionsShowed = false;
    $scope.urlBase = URLS.be_base;
    $scope.invitarUsuario = invitarUsuario;
    $scope.declineRequest = declineRequest;
    $scope.acceptRequest = acceptRequest;
   
      
    //////////////////////////// Private ///////////////////////////////////////

    $scope.selfPara = function(miembro) {
      if (us.isUndefinedOrNull(miembro.nickname)) return "";
      return miembro.nickname + tagSelf(miembro.email == $scope.node.emailAdministrador, us.translate('ADMIN'));
    }

    function tagSelf(condicion, tag) {
      return (condicion) ? " (" + tag + ")" : "";
    }

    $scope.isLoggedMember = function(miembro) {
      return (miembro.email == usuario_dao.getUsuario().email); 
    }


    $scope.miembrosVisiblesParaUsuarioLogeado = function() {
      if ($scope.node.miembros != undefined && $scope.node.miembros.reduce(function(r, m) {
          return r || ($scope.isLoggedMember(m) && m.invitacion != 'NOTIFICACION_ACEPTADA')
        }, false)) {
        return $scope.node.miembros.filter(function(m) { return m.invitacion == "NOTIFICACION_ACEPTADA" })
      }
      return $scope.node.miembros;
    }

    $scope.showRemoveGroupsMember = function(member) {
      return ($scope.isAdmin && !$scope.isLoggedMember(member)) || (!$scope.isAdmin && $scope.isLoggedMember(member));
    }
        
    $scope.showCederAdministracionGrupo = function(member){
        return $scope.isAdmin && !$scope.isLoggedMember(member) && member.invitacion != 'NOTIFICACION_NO_LEIDA';
    }
        
    $scope.canShowMemberOptions = function(){
      return !$scope.membersOptionsShowed;
    }

    $scope.showMembersOptions = function(){
        $scope.membersOptionsShowed = true;
    }

    $scope.canHideMemberOptions = function(){
        return $scope.membersOptionsShowed;
    }

    $scope.hideMemberOptions = function(){
        $scope.membersOptionsShowed = false;
    }
    
    $scope.cederAdministracionGrupo = function(member){
      var nombre = member.nickname == null ? member.email : member.nickname;
      // Esto es un resabio de la forma de cargar members que pronto va a ser modificado. 
      var pregunta,confirmacion,fallo;
            
      pregunta = us.translate('SWAP_ADMINISTRATION_WITH') + nombre + "? ";
      fallo = 'No se pudo quitar a ' + nombre + ' del nodo de compra';

      dialogCommons.confirm(
        us.translate('SWAP_GROUP_ADMINISTRATION_TITLE'),
        us.translate('ESTAS_SEGURO_DE') + pregunta + us.translate('REVERSIBLE_OPTION'),
        us.translate('SI_QUIERO'), 
        us.translate('NO'),
        function doOk() {
          $log.debug("Nuevo administrador: ", member);
                    callCederAdministracionGrupo(member);
        },
        function doNotOk() {
          $log.debug(fallo);
        }
      )
    }

    /** habilita el panel para agregar integrantes. */
    function invitarUsuario(node) {
      $log.debug("Invitar miembro al nodo");

      function doOk(mail) {
          $log.debug("Se seleccionó Invitar a usuario con mail", mail);
          callInvitarUsuario(mail, node);
      }

      function doNoOk() {
          $log.debug("Se seleccionó Cancelar");
      }

      dialogCommons.prompt(
          us.translate('INV_MIEMBRO'),
          us.translate('INGRESAR_CORREO'), 
          'correo@correo.com',
          us.translate('INVITAR'), 
          us.translate('CANCELAR'), 
          doOk, 
          doNoOk
      );
    }

    /** Salir del nodo. Manejo del popUP */
    function exitGroup() {
        dialogCommons.confirm(
            us.translate('SALIR'), 
            us.translate('SEGURO_SALIR'), 
            us.translate('SI_MEVOY'), 
            us.translate('CANCELAR'),
            function(result) {
              callQuitarMiembro(usuario_dao.getUsuario(), function(){
                toastr.success(us.translate('TE_FUISTE_GRUPO'), us.translate('AVISO_TOAST_TITLE'));
                contextPurchaseService.getAgrupations().then(function(agrupations_dao_int){
                  agrupations_dao_int.deleteAgrupation(contextPurchaseService.getCatalogContext(), 
                                                  $scope.node.id,
                                                  agrupationTypeVAL.TYPE_GROUP
                                                  );
                  $scope.$emit("exit-group");
                  $state.go('catalog.userGroups.all');
                });
              });
            },
            function() {
              $log.debug("se quedo");
            }
        )
    }



    $scope.quitarMiembro = function(miembro) {
      // Esto es un resabio de la forma de cargar miembros 
      var nombre = miembro.nickname == null ? miembro.email : miembro.nickname;
      var pregunta,confirmacion,fallo;
      if ($scope.isLoggedMember(miembro)) {
        pregunta = us.translate('SALIR_GRUPO');
        confirmacion = us.translate('SALIR');
        fallo = 'No pudo salir del nodo de compra';
      } else {
        pregunta = us.translate('QUITAR_A') + nombre;
        confirmacion = us.translate('QUITARLO');
        fallo = 'No se pudo quitar a ' + nombre + ' del nodo de compra';
      }

      dialogCommons.confirm(us.translate('SALIR_GRUPO_TITULO'),
        us.translate('ESTAS_SEGURO_DE') + pregunta + '?',
        us.translate('SI_QUIERO') + ' ' + confirmacion, 
        us.translate('NO'),
        function() {
          callQuitarMiembro(miembro, function(){
            toastr.info(us.translate('SE_QUITO_MIEMBRO'),us.translate('AVISO_TOAST_TITLE'));
            $scope.node.miembros.splice($scope.node.miembros.indexOf(miembro), 1);
          });
        },
        function() {
          $log.debug(fallo);
        });
    }


    function declineRequest(request){
      nodeService.declineRequest(request.id)
      .then(function(){
        init();
        toastr.success("" , "Solicitud rechazada");
      })
    }

    function acceptRequest(request){
      nodeService.acceptRequest(request.id)
      .then(function(){
        contextAgrupationsService.reset(contextPurchaseService.getCatalogContext());
        toastr.success("" , "Solicitud aceptada");
        $scope.$emit('node-information-actualized', $scope.node);
      })
    }

    /////// REST ////////


    function callQuitarMiembro(miembro, callback) {
      $log.debug("quitar", miembro)

      var params = {
          idGrupo: $scope.node.id,
          emailCliente: miembro.email
      }

      nodeService.quitarMiembro(params).then(callback);
    }
    
    function callInvitarUsuario(email, node) {

      var doOk = function(response) {
          toastr.info(us.translate('ENVIARA_MAIL'),us.translate('AVISO_TOAST_TITLE'));
          var recienInvitado = {
              avatar: null, 
              nickname: null, 
              email: email, 
              invitacion: "NOTIFICACION_NO_LEIDA", 
              estadoPedido: "INEXISTENTE",
              pedido:null
          };
          
          node.miembros.push(recienInvitado);
      }

      var params = {
        idGrupo: node.id,
        emailInvitado: email
      }

      nodeService.invitarUsuario(params).then(doOk);
    }
    
    
        
    function callCederAdministracionGrupo(miembro){            
      function doOk() {
        toastr.success("El nuevo administrador es " + miembro.nickname , us.translate('AVISO_TOAST_TITLE'));
        $scope.isAdmin = false;
        $scope.node.emailAdministrador = miembro.email;
        $scope.hideMemberOptions();
      }
      
      var params = {
        idGrupo: $scope.node.id,
        emailCliente: miembro.email
      }

      nodeService.cederAdministracion(params).then(doOk)   
    }
        
    
    //////////////////////////// INIT ///////////////////////////////////////
    
    function init(){
        $scope.isAdmin = $scope.node.esAdministrador;

        function doOk(response){
          $scope.requests = response.data.filter(function(r){return r.estado == "solicitud_pertenencia_nodo_enviado"});
        }
        if(usuario_dao.isLogged()){
          nodeService.getNodeRequests($scope.node.id).then(doOk);
        }
    }
    
    $rootScope.$on('node-is-loaded', function(event, node) {
        $log.debug("node", node);
        init();
    });
    
    
  }
})();