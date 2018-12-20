(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('CatalogMenuController', CatalogMenuController);

  
function CatalogMenuController($scope, $log,$rootScope, $state, StateCommons, URLS, REST_ROUTES, $interval, ToastCommons,
                                 perfilService, contextPurchaseService,us, usuario_dao, navigation_state) {
        
    
    $scope.urlBase = URLS.be_base;
    $scope.toTop = toTop;
    $scope.nroNoLeidas = 0;

    
    ////////////////////////// INIT //////////////////////////


    function init() {
        $scope.usuario = usuario_dao.getUsuario();
        $scope.isLogued = usuario_dao.isLogged();
        initRefreshNotification();
        resetNotificacion();
    }

    
    ////////////////////////// Notifications //////////////////////////
    
    var llamadoPeriodico;
    
    function initRefreshNotification() {
        if (usuario_dao.isLogged() && !StateCommons.ls.notificacionActiva) {
                
            llamadoPeriodico = $interval(function() {
                callNotificacionesNoLeidas();
            }, REST_ROUTES.INTERVALO_NOTIFICACION_MIN);
            
            callNotificacionesNoLeidas();
            StateCommons.ls.notificacionActiva = true;
        }
    }
    
    function callNotificacionesNoLeidas() {

        function doOk(response) {
            
            var notificacionesSinLeer = response.data.length

            if (notificacionesSinLeer > 0) {
                if(notificacionesSinLeer !== $scope.nroNoLeidas){
                    $log.debug('hay nuevas notificaciones !');
                    addNotificacion();    
                }                
                if(response.data.length>999){
                    $scope.nroNoLeidas = 999;
                }else{
                    $scope.nroNoLeidas = response.data.length;
                }
                
            } else {
                resetNotificacion();
            }
        }
        
        perfilService.notificacionesNoLeidas().then(doOk);  
    }
    
    
    $scope.options = {
        'rotation': 'circ-in',
        'duration': 1000
    };
    
    function resetNotificacion() {
        $scope.callNotificaciones = false;
        $scope.icon = 'notifications_none';
        $scope.fill = 'white';
        $scope.nroNoLeidas = 0;
    }

    function addNotificacion() {
        $scope.callNotificaciones = true;
        $scope.icon = 'notifications';
        $scope.fill = 'red';
        ToastCommons.mensaje(us.translate('LLEGO_NOTIFICACION'))
    }
    
    $scope.verNotificaciones = function() {
        $log.debug("Ver notificaciones");
        $scope.icon = 'notifications_none';
        $scope.fill = 'white';
        $state.go('catalog.notifications');
    }
    
    
    function toTop(){
        window.scrollTo(0,0);
    }
    
    ////////////////////////// Other //////////////////////////

   $rootScope.refrescarNotificacion = function (){

        function doOk(response) {
            
            var notificacionesSinLeer = response.data.length

            if (notificacionesSinLeer > 0) {
                $log.debug('hay nuevas notificaciones en funcion!');
                if(response.data.length>999){
                    $scope.nroNoLeidas = 999;
                }else{
                    $scope.nroNoLeidas = response.data.length;
                }
                
            } else {
                resetNotificacion();
            }
        }
        
        perfilService.notificacionesNoLeidas().then(doOk);  
    }
    
    $scope.logOut = function() {
        $log.debug("Log Out ..... ");

        usuario_dao.logOut();
        contextPurchaseService.clean();

        $interval.cancel(llamadoPeriodico);

        init();
        $scope.$broadcast('logout');
        $state.go('catalog.landingPage');
    }
    
    
    
    $scope.$on('resetHeader', function(event, msg) {
        init();
    });

    init();

}})();
