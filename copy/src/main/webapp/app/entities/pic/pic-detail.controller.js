(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('PicDetailController', PicDetailController);

    PicDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'DataUtils', 'entity', 'Pic', 'Course'];

    function PicDetailController($scope, $rootScope, $stateParams, previousState, DataUtils, entity, Pic, Course) {
        var vm = this;

        vm.pic = entity;
        vm.previousState = previousState.name;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;

        var unsubscribe = $rootScope.$on('hopefullyApp:picUpdate', function(event, result) {
            vm.pic = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
