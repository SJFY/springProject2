(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CourseDetailController', CourseDetailController);

    CourseDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'DataUtils', 'entity', 'pics', 'Pic', 'Course', 'Copyuser', 'User'];

    function CourseDetailController($scope, $rootScope, $stateParams, previousState, DataUtils, entity, pics, Pic, Course, Copyuser, User) {
        var vm = this;

        vm.course = entity;
        vm.picture = pics;
        vm.previousState = previousState.name;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;

        var unsubscribe = $rootScope.$on('hopefullyApp:courseUpdate', function(event, result) {
            vm.course = result;
            vm.picture = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
