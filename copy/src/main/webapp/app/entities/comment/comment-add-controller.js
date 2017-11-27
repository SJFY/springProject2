(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CommentAddController', CommentAddController);

    CommentAddController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'DataUtils', 'entity', 'entityc', 'Comment', 'Copyuser', 'Course'];

    function CommentAddController ($timeout, $scope, $stateParams, $uibModalInstance, DataUtils, entity, entityc, Comment, Copyuser, Course) {
        var vm = this;

        vm.comment = {};
        vm.comment.writter = entity;
        vm.comment.targetcourse = entityc;
        vm.course = entityc;
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

       // vm.tmp2 = $scope.rating;
      //  vm.tmp = entityc.rating;

        function save () {
            vm.isSaving = true;
            if (vm.comment.id !== null) {
                Comment.getcomment().update(vm.comment, onSaveSuccess, onSaveError);
            } else {
                Comment.getcomment().save(vm.comment, onSaveSuccess, onSaveError), function () {
                    vm.course.rating = vm.comment.rating;
                    Course.getcourse().update(vm.course, onSaveSuccess, onSaveError);
                }
            }

        }

        $scope.$watch('vm.comment.rating', function(v) {
            vm.tmp = v;
            Comment.getbycourse().query({id:entityc.id}, function (result) {
                vm.tmp1 = result.length;
                vm.tmp3 = entityc.rating;
                a = (v + entityc.rating * vm.tmp1)/(vm.tmp1 + 1);
            })
        });

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
