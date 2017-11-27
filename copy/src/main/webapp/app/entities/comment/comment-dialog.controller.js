(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CommentDialogController', CommentDialogController);

    CommentDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'DataUtils', 'entity', 'Comment', 'Copyuser', 'Course'];

    function CommentDialogController ($timeout, $scope, $stateParams, $uibModalInstance, DataUtils, entity, Comment, Copyuser, Course) {
        var vm = this;

        vm.comment = entity;
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.copyusers = Copyuser.getcopyuser().query();
        vm.courses = Course.getcourse().query();
        vm.comments = Comment.getcomment().query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.comment.id !== null) {
                Comment.getcomment().update(vm.comment, onSaveSuccess, onSaveError);
            } else {
                Comment.getcomment().save(vm.comment, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('hopefullyApp:commentUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
