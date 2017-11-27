(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CourseAddPicController', CourseAddPicController);
    CourseAddPicController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'DataUtils', 'entity','Pic', 'Course'];
    function CourseAddPicController($timeout, $scope, $stateParams, $uibModalInstance, DataUtils, entity, Pic, Course) {

        var vm = this;

        vm.pic = {};
        vm.pic.coursepic = entity;
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

        function save () {
            vm.isSaving = true;
            Pic.getpic().save(vm.pic, onSaveSuccess, onSaveError);
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
