(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('QuestionairDialogController', QuestionairDialogController);

    QuestionairDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'DataUtils', 'entity', 'Questionair', 'Course', 'User'];

    function QuestionairDialogController ($timeout, $scope, $stateParams, $uibModalInstance, DataUtils, entity, Questionair, Course, User) {
        var vm = this;

        vm.questionair = entity;
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.courses = Course.getcourse().query();
        vm.users = User.query();
        vm.questionairs = Questionair.getque().query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.questionair.id !== null) {
                Questionair.getque().update(vm.questionair, onSaveSuccess, onSaveError);
            } else {
                Questionair.getque().save(vm.questionair, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('hopefullyApp:questionairUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
