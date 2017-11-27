(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('QuestionairDeleteController',QuestionairDeleteController);

    QuestionairDeleteController.$inject = ['$uibModalInstance', 'entity', 'Questionair'];

    function QuestionairDeleteController($uibModalInstance, entity, Questionair) {
        var vm = this;

        vm.questionair = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Questionair.getque().delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
