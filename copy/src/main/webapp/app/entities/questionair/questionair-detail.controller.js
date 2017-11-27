(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('QuestionairDetailController', QuestionairDetailController);

    QuestionairDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'DataUtils', 'entity', 'Questionair', 'Course', 'User'];

    function QuestionairDetailController($scope, $rootScope, $stateParams, previousState, DataUtils, entity, Questionair, Course, User) {
        var vm = this;

        vm.questionair = entity;
        vm.previousState = previousState.name;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;

        var unsubscribe = $rootScope.$on('hopefullyApp:questionairUpdate', function(event, result) {
            vm.questionair = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
