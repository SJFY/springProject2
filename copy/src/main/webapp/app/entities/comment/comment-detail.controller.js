(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CommentDetailController', CommentDetailController);

    CommentDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'DataUtils', 'entity', 'Comment', 'Copyuser', 'Course'];

    function CommentDetailController($scope, $rootScope, $stateParams, previousState, DataUtils, entity, Comment, Copyuser, Course) {
        var vm = this;

        vm.comment = entity;
        vm.previousState = previousState.name;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;

        var unsubscribe = $rootScope.$on('hopefullyApp:commentUpdate', function(event, result) {
            vm.comment = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
