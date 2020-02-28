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

    options.notifications.forEach(option => {
      listen(option.event, option.message);
    });

    app.setProviderStatus('Running');


  };

  function listen(event, message) {
    let _notify = function(event) {
      // console.log(JSON.stringify(event, null, 2));
      notify(message);
    };
    app.on(event, _notify);
    unsubscribes.push(() => {
      app.removeListener(event, _notify);
    });
  }

  function notify(message) {
    console.log(new Date(), message);
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
            }
          }
        }
      }
    }

  };

  return plugin;
};
