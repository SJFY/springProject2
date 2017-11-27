(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('comment', {
            parent: 'entity',
            url: '/comment',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Comments'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/comment/comments.html',
                    controller: 'CommentController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('comment-detail', {
            parent: 'comment',
            url: '/comment/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Comment'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/comment/comment-detail.html',
                    controller: 'CommentDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Comment', function($stateParams, Comment) {
                    return Comment.getcomment().get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'comment',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('comment-detail.edit', {
            parent: 'comment-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/comment/comment-dialog.html',
                    controller: 'CommentDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Comment', function(Comment) {
                            return Comment.getcomment().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('comment.new', {
            parent: 'comment',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/comment/comment-dialog.html',
                    controller: 'CommentDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                rating: null,
                                review: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('comment', null, { reload: 'comment' });
                }, function() {
                    $state.go('comment');
                });
            }]
        })
            .state('comment.newuc', {
                parent: 'comment',
                url: '/{id}/{cid}/new',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/comment/comment-adduc.html',
                        controller: 'CommentAddController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Copyuser', function(Copyuser) {
                                return Copyuser.getcopyuser().get({id : $stateParams.id}).$promise;
                            }],
                            entityc: ['Course', function(Course) {
                                return Course.getcourse().get({id : $stateParams.cid}).$promise;
                            }]
                        }
                    }).result.then(function() {
                        $state.go('comment', null, { reload: 'comment' });
                    }, function() {
                        $state.go('comment');
                    });
                }]
            })
        .state('comment.edit', {
            parent: 'comment',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/comment/comment-dialog.html',
                    controller: 'CommentDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Comment', function(Comment) {
                            return Comment.getcomment().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('comment', null, { reload: 'comment' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('comment.delete', {
            parent: 'comment',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/comment/comment-delete-dialog.html',
                    controller: 'CommentDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Comment', function(Comment) {
                            return Comment.getcomment().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('comment', null, { reload: 'comment' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
