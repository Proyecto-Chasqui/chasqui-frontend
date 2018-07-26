(function(){
	'use strict';
	/*
	* A simple paginator.
	* Favio Juan.
	* 7-20-2018
	*/
	angular.module('chasqui').controller('ChqPaginatorCtrl', ChqPaginatorCtrl);

	function ChqPaginatorCtrl($scope, $rootScope, $log){

	$scope.activeIndex = 1;
    $scope.iterables = [1];
    $scope.addIndex = 1;
    $scope.realPage = $scope.activeIndex;
    $scope.lastPage = 0;


/*
* Load default values, receive the value of the last page by broadcast.
* Request the loading of the first page by default.
*/
    function init(){
      console.log("INIT");
      $scope.activate(0);
      $scope.$on('setLastPage', function(event, data){
        $scope.lastPage = data;
        $log.warn("Ultima pagina", data);
    })
    }

/*
* Moves to the next page
*/
	$scope.moveNext = function (){
		if($scope.realPage < $scope.lastPage){
			$scope.iterables[0] += 1;
			$scope.realPage = $scope.iterables[0];
		}
		$scope.$emit('paginatorChange', $scope.realPage);
	}

	/*
	* Moves to the previous page
	*/
	$scope.movePrevious = function (){
		if($scope.realPage > 1){
			$scope.iterables[0] -= 1;
			$scope.realPage = $scope.iterables[0];
		}
		$scope.$emit('paginatorChange', $scope.realPage);
	}


	/*
	* Moves to the first page
	*/
  	$scope.moveFirst = function(){
			if($scope.realPage > 1){
				$scope.iterables[0] = 1;
				$scope.realPage = $scope.iterables[0];
			}
			$scope.$emit('paginatorChange', $scope.realPage);
		}

/*
* Moves to the last page
*/
		$scope.moveLast = function(){
			if($scope.realPage < $scope.lastPage){
				$scope.iterables[0] = $scope.lastPage;
				$scope.realPage = $scope.iterables[0];
			}
			$scope.$emit('paginatorChange', $scope.realPage);
    }

////////////////////// viene de filtro
// $scope.$watch(vm.lastPage, $scope.$on('filterEvent', function(event, arg) {
//   $log.debug("filterEvent", arg);
//   // vm.ultimoFiltro = arg;
//   // vm.paging.total = 0;
//   // vm.paging.current = 1;
//   //actualizar(arg);
//   $scope.activate(0);
// }));


/*
* Receive an index and increase it by one, set the value of the current page and send it up.
* @params: aIndex (number)
*/
	  $scope.activate = function(aIndex){
      $scope.activeIndex = aIndex + 1;
      $scope.$emit('paginatorChange', $scope.realPage);
		}

    init();
	}

})();
