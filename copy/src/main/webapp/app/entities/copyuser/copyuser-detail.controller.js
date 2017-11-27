(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CopyuserDetailController', CopyuserDetailController);

    CopyuserDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'DataUtils', 'entity', 'Copyuser', 'User', 'Course'];

    function CopyuserDetailController($scope, $rootScope, $stateParams, previousState, DataUtils, entity, Copyuser, User, Course) {
        var vm = this;

        vm.copyuser = entity;
        vm.previousState = previousState.name;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;

        var unsubscribe = $rootScope.$on('hopefullyApp:copyuserUpdate', function(event, result) {
            vm.copyuser = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
