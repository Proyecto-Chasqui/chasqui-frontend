angular.module('chasqui').directive('chqPaginator',
  function() {
    return {
      restrict: 'E',
      controller: 'ChqPaginatorCtrl',
      templateUrl: 'app/comercio/varios/paginador/paginator.html'
    }
  }
);
