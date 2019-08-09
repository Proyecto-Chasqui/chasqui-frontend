(function() {
  'use strict';

  angular.module('chasqui').controller('groupMembersController', groupMembersController);

  function groupMembersController($log, $scope, $state, contextCatalogObserver, $rootScope,
                          dialogCommons, toastr, gccService, URLS, agrupationTypeVAL,
                          us, usuario_dao, navigation_state, contextPurchaseService, contextAgrupationsService) {


    $scope.exitGroup = exitGroup;    
    $scope.isAdmin = false;
    $scope.allContacts;
    $scope.membersOptionsShowed = false;
    $scope.urlBase = URLS.be_base;
    $scope.invitarUsuario = invitarUsuario;
   
      
    //////////////////////////// Private ///////////////////////////////////////

    $scope.selfPara = function(miembro) {
      if (us.isUndefinedOrNull(miembro.nickname)) return "";
      return miembro.nickname + tagSelf(miembro.email == $scope.group.emailAdministrador, us.translate('ADMIN')) +
        tagSelf($scope.isLoggedMember(miembro), us.translate('TU'));
    }

    function tagSelf(condicion, tag) {
      return (condicion) ? " (" + tag + ")" : "";
    }

    $scope.isLoggedMember = function(miembro) {
      return (miembro.email == usuario_dao.getUsuario().email); 
    }


    $scope.miembrosVisiblesParaUsuarioLogeado = function() {
      if ($scope.group.miembros != undefined && $scope.group.miembros.reduce(function(r, m) {
          return r || ($scope.isLoggedMember(m) && m.invitacion != 'NOTIFICACION_ACEPTADA')
        }, false)) {
        return $scope.group.miembros.filter(function(m) { return m.invitacion == "NOTIFICACION_ACEPTADA" })
      }
      return $scope.group.miembros;
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
      fallo = 'No se pudo quitar a ' + nombre + ' del grupo de compra';

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
    function invitarUsuario(grupo) {
      $log.debug("Invitar miembro al grupo");

      function doOk(response) {
          $log.debug("Se seleccionó Invitar a usuario con mail", response);
          callInvitarUsuario(response, grupo);
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

    /** Salir del grupo. Manejo del popUP */
    function exitGroup() {
        dialogCommons.confirm(
            us.translate('SALIR'), 
            us.translate('SEGURO_SALIR'), 
            us.translate('SI_MEVOY'), 
            us.translate('CANCELAR'),
            function(result) {
              callQuitarMiembro(usuario_dao.getUsuario(), function(){
                toastr.success(us.translate('TE_FUISTE_GRUPO'), us.translate('AVISO_TOAST_TITLE'));
                contextPurchaseService.getAgrupations().then(function(agrupationsInt){
                  agrupationsInt.deleteAgrupation(contextPurchaseService.getCatalogContext(), 
                                                  $scope.group.idGrupo,
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
        fallo = 'No pudo salir del grupo de compra';
      } else {
        pregunta = us.translate('QUITAR_A') + nombre;
        confirmacion = us.translate('QUITARLO');
        fallo = 'No se pudo quitar a ' + nombre + ' del grupo de compra';
      }

      dialogCommons.confirm(us.translate('SALIR_GRUPO_TITULO'),
        us.translate('ESTAS_SEGURO_DE') + pregunta + '?',
        us.translate('SI_QUIERO') + ' ' + confirmacion, 
        us.translate('NO'),
        function() {
          callQuitarMiembro(miembro, function(){
            toastr.info(us.translate('SE_QUITO_MIEMBRO'),us.translate('AVISO_TOAST_TITLE'));
            $scope.group.miembros.splice($scope.group.miembros.indexOf(miembro), 1);
          });
        },
        function() {
          $log.debug(fallo);
        });
    }

    /////// REST ////////


    function callQuitarMiembro(miembro, callback) {
      $log.debug("quitar", miembro)

      var params = {
          idGrupo: $scope.group.idGrupo,
          emailCliente: miembro.email
      }

      gccService.quitarMiembro(params).then(callback);
    }
    
    function callInvitarUsuario(emailClienteInvitado, grupo) {

      var doOk = function(response) {
          toastr.info(us.translate('ENVIARA_MAIL'),us.translate('AVISO_TOAST_TITLE'));
          var recienInvitado = {
              avatar: null, 
              nickname: null, 
              email: emailClienteInvitado, 
              invitacion: "NOTIFICACION_NO_LEIDA", 
              estadoPedido: "INEXISTENTE",
              pedido:null
          };
          
          grupo.miembros.push(recienInvitado);
      }

      var params = {
          idGrupo: grupo.idGrupo,
          emailInvitado: emailClienteInvitado
      }
      gccService.invitarUsuarioAGrupo(params).then(doOk);
    }
    
    
        
    function callCederAdministracionGrupo(miembro){            
      function doOk() {
        toastr.success("El nuevo administrador es " + miembro.nickname , us.translate('AVISO_TOAST_TITLE'));
        $scope.isAdmin = false;
        $scope.group.emailAdministrador = miembro.email;
        $scope.hideMemberOptions();
      }
      
      var params = {
        idGrupo: $scope.group.idGrupo,
        emailCliente: miembro.email
      }

      gccService.cederAdministracion(params).then(doOk)   
    }
        
    
    //////////////////////////// INIT ///////////////////////////////////////
    
    function init(){
        $scope.isAdmin = $scope.group.esAdministrador;
    }
    
    $rootScope.$on('group-is-loaded', function(event, group) {
        $log.debug("group", group);
        init();
    });
    
    
    init();
    
  }
})();