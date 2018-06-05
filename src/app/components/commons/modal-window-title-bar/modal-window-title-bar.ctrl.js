(function() {
	'use strict';
    
    angular.module('chasqui').controller('ModalWindowTitleBarCtrl', ModalWindowTitleBarCtrl);
    
	function ModalWindowTitleBarCtrl($scope, $mdDialog){
        
        $scope.cancel = function(){
            $scope.cancelAction();
			$mdDialog.hide();
        }
        
        function init(){
            
        }
        
        init();
    }
    
})();