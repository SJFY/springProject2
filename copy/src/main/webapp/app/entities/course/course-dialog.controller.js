(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CourseDialogController', CourseDialogController);

    CourseDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'DataUtils', 'entity', 'Course', 'Copyuser', 'User', 'Principal'];

    function CourseDialogController ($timeout, $scope, $stateParams, $uibModalInstance, DataUtils, entity, Course, Copyuser, User, Principal) {
        var vm = this;

        vm.course = entity;
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.copyusers = Copyuser.getcopyuser().query();
        vm.users = User.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        var copyAccount = function (account) {
            return account;
        };

        Principal.identity().then(function(account) {
            vm.course.teacher = copyAccount(account);
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.course.id !== null) {
                Course.getcourse().update(vm.course, onSaveSuccess, onSaveError);
            } else {
                Course.getcourse().save(vm.course, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('hopefullyApp:courseUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
