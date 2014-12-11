define([
    '$',
    'plugin'
], function($, Plugin) {
    var element;
    var createPlugin = function() {
        SubPlugin.DEFAULTS = {};

        function SubPlugin(element, options) {
            SubPlugin.__super__.call(this, element, options, SubPlugin.DEFAULTS);
        }

        Plugin.create('subplugin', SubPlugin, {
            _init: function(element, options) {
                this.element = $(element);
            },
            someMethod: function() {
                this._trigger('customEvent');
            },
            someProperty: true
        });
    };

    describe('Plugin interface', function() {
        beforeEach(function() {
            element = $('<div class="subplugin" />');

            createPlugin();
        });

        describe('invoking methods before plugin is initialized', function() {
            it('throws when not initialized', function() {
                assert.throws(function() {
                    element.subplugin('someMethod');
                });
            });
        });

        describe('invoking methods using the plugin interface', function() {
            it('calls customEvent using the someMethod method', function(done) {
                element.subplugin({
                    customEvent: function(e, ui) {
                        done();
                    }
                });

                element.subplugin('someMethod');
            });

            it('throws for method calls that don\'t exist', function() {
                assert.throws(function() {
                    element.subplugin().subplugin('noMethod');
                });
            });

            it('throws when attempting to invoke private methods', function() {
                assert.throws(function() {
                    element.subplugin().subplugin('_init');
                });
            });

            it('throws when attempting to invoke methods that aren\'t functions', function() {
                assert.throws(function() {
                    element.subplugin().subplugin('someProperty');
                });
            });
        });
    });
});