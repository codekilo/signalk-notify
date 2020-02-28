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

    listen(options.event, options.message, app);

    app.setProviderStatus('Running');


  };

  function listen(event, message, eventEmitter) {
    let _notify = function(event) {
      console.log(JSON.stringify(event, null, 2));
      notify(message);
    };
    eventEmitter.on(event, _notify);
    unsubscribes.push(() => {
      eventEmitter.removeListener(event, _notify);
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
      event: {
        type: 'string',
        title: 'event'
      },
      message: {
        type: 'string',
        title: 'message'
      }
    }
  };

  return plugin;
};
