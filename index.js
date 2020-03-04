const PLUGIN_ID = 'signalk-notify';
const PLUGIN_NAME = 'Signalk notify';
var unsubscribes = [];
module.exports = function(app) {
  var plugin = {};

  plugin.id = PLUGIN_ID;
  plugin.name = PLUGIN_NAME;
  plugin.description = 'A plugin to send notifications when an event occurs';

  plugin.start = function(options, restartPlugin) {
    app.debug('Plugin started');
    plugin.options = options;

    options.notifications.forEach(listen);

    app.setProviderStatus('Running');


  };

  function listen(option) {
    // console.log(JSON.stringify(option, null, 2));
    let _notify = function(event) {
      // console.log(JSON.stringify(event, null, 2));
      if (option.method == 'LOG') {
        console.log(new Date(), option.message);
      } else if (option.method == 'DEBUG') {
        app.debug(option.message);

      } else if (option.method == 'NOTIFICATION') {
        let value = {
          method: ['sound'],
          state: 'alert',
          message: option.message

        };
        if (event.type == 'FALLING') {
          value = null;
        }
        let notification = {
          context: event.value.context,
          updates: [{
            $source: PLUGIN_ID,
            timestamp: event.value.updates[0].timestamp,
            values: [{
              path: `notifications.${event.event}`,
              value: value
            }]
          }]
        };
        app.handleMessage(PLUGIN_ID, notification);
        app.debug(notification);
      }

    };
    app.on(option.event, _notify);
    unsubscribes.push(() => {
      app.removeListener(option.event, _notify);
    });
  }


  plugin.stop = function() {
    // Here we put logic we need when the plugin stops
    app.debug('Plugin stopped');
    unsubscribes.forEach(f => f());
    app.setProviderStatus('Stopped');
  };

  plugin.schema = {
    title: PLUGIN_NAME,
    type: 'object',
    properties: {
      notifications: {
        type: 'array',
        title: 'notifications',
        items: {
          type: 'object',
          properties: {
            event: {
              type: 'string',
              title: 'event'
            },
            message: {
              type: 'string',
              title: 'message'
            },
            method: {
              type: 'string',
              title: 'method',
              enum: ['LOG', 'DEBUG', 'NOTIFICATION'],
              enumNames: ['write to log', 'write to debug ', 'create notification'],
              default: 'LOG'
            }
          }
        }
      }
    }

  };

  return plugin;
};
