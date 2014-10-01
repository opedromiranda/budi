describe('bdCamera Directive', function() {
    'use strict';

    var $globalCompile,
        $rootScope,
        WebRTC,
        webcamController,
        element;

    beforeEach(function(){
        module('Budi');
        module('WebRTC');
        module('Budi.templates');
    });

    beforeEach(inject(function ($injector, $compile, $controller, $templateCache) {
        $globalCompile = $compile;
        $rootScope = $injector.get('$rootScope');

        webcamController = function() {
            return $controller('WebcamController', {
                scope : $rootScope
            })
        };
    }));

    it('should use the attribute webcam to set the id of video element', function() {
        element = $globalCompile('<bd-camera webcam="dummyCamera"/>')($rootScope);
        $rootScope.$digest();
        expect(element.find('video')[0].id).toEqual('dummyCamera');
    });

});