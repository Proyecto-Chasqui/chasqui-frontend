(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, webDevTec, toastr, $http) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1459740181233;
    vm.showToastr = showToastr;
    vm.sendName = sendName;
    activate();

    function activate() {
      getWebDevTec();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }

    vm.respuestaRest = "??????????";

    function sendName() {
      $http.get("http://localhost:8081/chasqui-mock/ejemplo/api/producto/" + vm.nombre)
        .then(getContributorsComplete)

      function getContributorsComplete(response) {
        vm.respuestaRest = response.data;
        return response.data;
      }

    }
  }
})();
