(function() {
	'use strict';

	angular.module('chasqui').controller('AskToCollaborateCtrl', AskToCollaborateCtrl);

	/** @ngInject */
	function AskToCollaborateCtrl($scope, dialogCommons, $mdDialog) {
    
    $scope.cancelAction = $mdDialog.hide;
    $scope.collaborate = dialogCommons.collaborateWithQuestions;
  }
  
})();