Mobify Plugin Factory
======

A generic plugin factory method for creating Mobify plugins.

[![Bower version](https://badge.fury.io/bo/plugin.svg)](http://badge.fury.io/bo/plugin)
[![Circle CI](https://circleci.com/gh/mobify/plugin/tree/master.png?style=shield&circle-token=9347fa0140425cd2d9098cfcf58f3dfd54ccdca5)](https://circleci.com/gh/mobify/plugin/tree/master)

## Requirements

* [Zepto](http://zeptojs.com/)

## Installation

The plugin factory can be installed using bower:

```
bower install plugin
```

## Usage with Require.js

To use with require.js, after installing through bower you merely have to reference the plugin factory in your require config file:

```config.js

{
    'paths': {
        'plugin': 'bower_components/plugin/dist/plugin.min',
        'myPlugin': 'plugins/myPlugin'
    }
}

```

And then require the plugin factory in as needed:

```
define(
    ['$', 'plugin'],
    function($, Plugin) {
        // create plugin
    }
);
```

## Usage

The plugin factory requires a few things to be defined in your plugin prior to calling the plugin factory function.

1. Your plugin's constructor, calling `__super__`
2. A `DEFAULTS` static property on your plugin's constructor
3. A `VERSION` static property on your plugin's constructor


## Creating your plugin


Let's look at an example. In this example, we're going to create a `button` plugin. To do so, we will use the following code:

```
define(
	[
		'$',
		'plugin'
	],
	function($, Plugin) {
		function Button(element, options) {
			Button.__super__.call(this, element, options, Button.DEFAULTS);
		}
		
		Button.VERSION = '0.0.1';
		
		Button.DEFAULTS = {
			cssClass = 'button'
		};
		
		Plugin.create('button', Button, {
			_init: function(element) {
			}
		});
	}
)
```

First, we declare a `Button` constructor, and VERSION and DEFAULTS properties. We then invoke the static `Plugin.create` function. Through prototypal inheritance, this function extends the `Button` prototype with the `Plugin` prototype. Additionally, it creates our Zepto plugin interface. 

To create a button instance, you merely need to use:

```
$('<button></button>').button();
```

## The Plugin factory method

Extends a plugin using the `Plugin` prototype.

| Parameter&nbsp;name | Description |
|----------------|-------------|
| **name** | The name of the plugin, in lowercase. |
| **ctor** | The constructor of the plugin we want to extend. | 
| **prototype** | Additional methods we want to extend onto our plugin's prototype. The prototype must declare an _init function, which is used for plugin construction. |

See the example above for usage.

