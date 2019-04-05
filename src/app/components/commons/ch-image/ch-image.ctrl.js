(function() {
	'use strict';
    
    	angular
		.module('chasqui')
		.controller('ChImageController', ChImageController);
    
	function ChImageController($scope, URLS) {
    
    $scope.getPath = getPath;
    
    function getPath(partialPath){
      return partialPath == undefined || partialPath == null || partialPath == ""? 
              "../assets/images/sinfotochasqui200.jpg":
              URLS.be_base + partialPath;
    }
        
	} 
    
})();