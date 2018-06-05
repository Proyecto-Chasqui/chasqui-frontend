(function() {
	'use strict';
    
    angular.module('chasqui').directive('modalWindowTitleBar', modalWindowTitleBar);
    
	function modalWindowTitleBar() {
    
        return {
            restrict: 'E',
            scope: {
                title: '@',
                cancelAction: '&'
            },
            controller: 'ModalWindowTitleBarCtrl',
            templateUrl: 'app/components/commons/modal-window-title-bar/modal-window-title-bar.tmpl.html'
          };
    }
    
})();         