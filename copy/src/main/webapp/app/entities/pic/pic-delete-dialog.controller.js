(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('PicDeleteController',PicDeleteController);

    PicDeleteController.$inject = ['$uibModalInstance', 'entity', 'Pic'];

    function PicDeleteController($uibModalInstance, entity, Pic) {
        var vm = this;

        vm.pic = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Pic.getpic().delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
