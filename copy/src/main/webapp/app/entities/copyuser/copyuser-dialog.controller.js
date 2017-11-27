(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CopyuserDialogController', CopyuserDialogController);

    CopyuserDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', '$q', 'DataUtils', 'entity', 'Copyuser', 'User', 'Course', 'Principal'];

    function CopyuserDialogController ($timeout, $scope, $stateParams, $uibModalInstance, $q, DataUtils, entity, Copyuser, User, Course, Principal) {
        var vm = this;

        vm.copyuser = entity;
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.users = User.query();
        vm.courses = Course.getcourse().query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        var copyAccount = function (account) {
            return account;
        };

        Principal.identity().then(function(account) {
            vm.copyuser.user = copyAccount(account);
        });

        function save () {
            vm.isSaving = true;
            if (vm.copyuser.id !== null) {

                Copyuser.getcopyuser().update(vm.copyuser, onSaveSuccess, onSaveError);
            } else {
                Copyuser.getcopyuser().save(vm.copyuser, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('hopefullyApp:copyuserUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


        vm.setAvater = function ($file, copyuser) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        copyuser.avater = base64Data;
                        copyuser.avaterContentType = $file.type;
                    });
                });
            }
        };

    }
})();
