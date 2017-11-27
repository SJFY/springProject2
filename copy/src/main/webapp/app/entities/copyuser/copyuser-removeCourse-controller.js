(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CopyuserRemoveCController', CopyuserRemoveCController);

    CopyuserRemoveCController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', '$q', 'DataUtils', 'entity', 'newc', 'Copyuser', 'User', 'Course', 'Principal'];

    function CopyuserRemoveCController ($timeout, $scope, $stateParams, $uibModalInstance, $q, DataUtils, entity, newc, Copyuser, User, Course, Principal) {
        var vm = this;

        vm.copyuser = entity;
        vm.tmp = newc;
        //vm.index = vm.copyuser.courses.indexOf(newc);
       // vm.copyuser.courses.push(newc);
        for (var i = 0; i < vm.copyuser.courses.length; i ++) {
            if (vm.copyuser.courses[i].id === newc.id) {
                vm.index = i;
                vm.copyuser.courses.splice(vm.index,1);
            }
        }
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;

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
