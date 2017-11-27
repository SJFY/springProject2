(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('PicDialogController', PicDialogController);

    PicDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'DataUtils', 'entity', 'Pic', 'Course'];

    function PicDialogController ($timeout, $scope, $stateParams, $uibModalInstance, DataUtils, entity, Pic, Course) {
        var vm = this;

        vm.pic = entity;
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.courses = Course.getcourse().query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.pic.id !== null) {
                Pic.getpic().update(vm.pic, onSaveSuccess, onSaveError);
            } else {
                Pic.getpic().save(vm.pic, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('hopefullyApp:picUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


        vm.setImage = function ($file, pic) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        pic.image = base64Data;
                        pic.imageContentType = $file.type;
                    });
                });
            }
        };

    }
})();
