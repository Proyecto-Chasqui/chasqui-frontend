(function() {
	'use strict';

	angular.module('chasqui').controller('DetalleGruposController',
		DetalleGruposController);

	/**
	 * @ngInject Contenido del tab de grupo. Recibe por parametro el id del
	 *           grupo
	 */
	function DetalleGruposController($log, $scope, $timeout, ToastCommons, toastr,
                                      dialogCommons, gccService, StateCommons, us, 
                                      URLS, REST_ROUTES, usuario_dao) {
        
		var vm = this;

		vm.grupo = $scope.grupo;
		vm.isAdmin = $scope.grupo.esAdministrador;

		vm.allContacts;
    vm.membersOptionsShowed = false;
		vm.urlBase = URLS.be_base;
        


		vm.quitarMiembro = function(miembro) {
			var nombre = miembro.nickname == null ? miembro.email : miembro.nickname;
			// Esto es un resabio de la forma de cargar miembros que pronto va a ser modificado. 
			var pregunta,confirmacion,fallo;
			if (vm.isLoggedMember(miembro)) {
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
				us.translate('SI_QUIERO') + confirmacion, us.translate('NO'),
				function() {
					vm.callQuitarMiembro(miembro);
				},
				function() {
					$log.debug(fallo);
				});
		}

		// //////////
		// //////REST

		vm.callQuitarMiembro = function(miembro) {
			function doOk() {
				toastr.info(us.translate('SE_QUITO_MIEMBRO'),us.translate('AVISO_TOAST_TITLE'));
				//$scope.$emit("quito-miembro-grupo");
				vm.grupo.miembros.splice(vm.grupo.miembros.indexOf(miembro), 1);
			}
			var params = {};
			params.idGrupo = vm.grupo.idGrupo;
			params.emailCliente = miembro.email;

			gccService.quitarMiembro(params).then(doOk)
		}

		
		vm.selfPara = function(miembro) {
			if (us.isUndefinedOrNull(miembro.nickname)) return "";
			return miembro.nickname + tagSelf(miembro.email == vm.grupo.emailAdministrador, us.translate('ADMIN')) +
				tagSelf(vm.isLoggedMember(miembro), us.translate('TU'));
		}

		function tagSelf(condicion, tag) {
			return (condicion) ? " (" + tag + ")" : "";
		}

		vm.isLoggedMember = function(miembro) {
			return (miembro.email == usuario_dao.getUsuario().email); 
		}


		vm.miembrosVisiblesParaUsuarioLogeado = function() {
			if (vm.grupo.miembros.reduce(function(r, m) {
					return r || (vm.isLoggedMember(m) && m.invitacion != 'NOTIFICACION_ACEPTADA')
				}, false)) {
				return vm.grupo.miembros.filter(function(m) { return m.invitacion == "NOTIFICACION_ACEPTADA" })
			}
			return vm.grupo.miembros;
		}

		vm.showRemoveGroupsMember = function(member) {
			return (vm.isAdmin && !vm.isLoggedMember(member)) || (!vm.isAdmin && vm.isLoggedMember(member));
		}
        
    vm.showCederAdministracionGrupo = function(member){
        return vm.isAdmin && !vm.isLoggedMember(member);
    }


    vm.cederAdministracionGrupo = function(member){
      var nombre = member.nickname == null ? member.email : member.nickname;
      // Esto es un resabio de la forma de cargar members que pronto va a ser modificado. 
      var pregunta,confirmacion,fallo;
            
      pregunta = us.translate('SWAP_ADMINISTRATION_WITH') + nombre + "? ";
      fallo = 'No se pudo quitar a ' + nombre + ' del grupo de compra';

			dialogCommons.confirm(us.translate('SWAP_GROUP_ADMINISTRATION_TITLE'),
				us.translate('ESTAS_SEGURO_DE') + pregunta + us.translate('REVERSIBLE_OPTION'),
				us.translate('SI_QUIERO'), 
        us.translate('NO'),
				function() {
					$log.debug("Nuevo administrador: ", member);
                    callCederAdministracionGrupo(member);
				},
				function() {
					$log.debug(fallo);
				});
    }
        
    function callCederAdministracionGrupo(miembro){            
      function doOk() {
        toastr.success("El nuevo administrador es " + miembro.nickname , us.translate('AVISO_TOAST_TITLE'));
        vm.isAdmin = false;
        vm.grupo.emailAdministrador = miembro.email;
        vm.hideMemberOptions();
      }
      var params = {
          idGrupo: vm.grupo.idGrupo,
          emailCliente: miembro.email
      };

      gccService.cederAdministracion(params).then(doOk)   
    }


    vm.canShowMemberOptions = function(){
        return !vm.membersOptionsShowed;
    }

    vm.showMembersOptions = function(){
        vm.membersOptionsShowed = true;
    }

    vm.canHideMemberOptions = function(){
        return vm.membersOptionsShowed;
    }

    vm.hideMemberOptions = function(){
        vm.membersOptionsShowed = false;
    }
	}
})();
