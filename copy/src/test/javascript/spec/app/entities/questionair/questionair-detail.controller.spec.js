'use strict';

describe('Controller Tests', function() {

    describe('Questionair Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPreviousState, MockQuestionair, MockCourse, MockUser;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPreviousState = jasmine.createSpy('MockPreviousState');
            MockQuestionair = jasmine.createSpy('MockQuestionair');
            MockCourse = jasmine.createSpy('MockCourse');
            MockUser = jasmine.createSpy('MockUser');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity,
                'previousState': MockPreviousState,
                'Questionair': MockQuestionair,
                'Course': MockCourse,
                'User': MockUser
            };
            createController = function() {
                $injector.get('$controller')("QuestionairDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'hopefullyApp:questionairUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
