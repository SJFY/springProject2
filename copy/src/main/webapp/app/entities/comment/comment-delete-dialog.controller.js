(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CommentDeleteController',CommentDeleteController);

    CommentDeleteController.$inject = ['$uibModalInstance', 'entity', 'Comment'];

    function CommentDeleteController($uibModalInstance, entity, Comment) {
        var vm = this;

        vm.comment = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Comment.getcomment().delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
