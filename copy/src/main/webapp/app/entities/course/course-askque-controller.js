(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CourseAskQueController', CourseAskQueController);

    CourseAskQueController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'que', 'Principal', 'DataUtils', 'entity', 'Questionair', 'Course', 'User'];

    function CourseAskQueController ($timeout, $scope, $stateParams, $uibModalInstance, que, Principal, DataUtils, entity, Questionair, Course, User) {
        var vm = this;

        vm.questionair = {};
        vm.questionair.course = entity;
        vm.questionair.questionair = que;
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
      //  vm.courses = Course.getcourse().query();
      //  vm.users = User.query();
      //  vm.questionairs = Questionair.getque().query();

       // vm.tmp = vm.questionair.questionair;
        var copyAccount = function (account) {
            return account;
        };

        Principal.identity().then(function(account) {
            vm.questionair.user = copyAccount(account);
        });

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
