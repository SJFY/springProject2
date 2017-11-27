(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CopyuserDeleteController',CopyuserDeleteController);

    CopyuserDeleteController.$inject = ['$uibModalInstance', 'entity', 'Copyuser'];

    function CopyuserDeleteController($uibModalInstance, entity, Copyuser) {
        var vm = this;

        vm.copyuser = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Copyuser.getcopyuser().delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
