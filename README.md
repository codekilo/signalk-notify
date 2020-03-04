# SignalK notification plugin

This package is designed to send a notification when an event occurs on the server

## Installation

To install this package clone it from git and run npm link.

```
git clone https://github.com/codekilo/signalk-notify.git
cd signalk-notify
sudo npm link
```

Then go to the SignalK configuration directory (probably `~/.signalk`)  and link the module again:

```
$ cd .signalk 
$ npm link signalk-notify
```

## configuration

for each notification the following values are required:

#### event
The name of the event to subscribe to

#### message 
The message to send with the notification

#### method
How to notify the user, has the following possible values

- Write to log
    + writes the message and time to stdout
- Write to debug
    + writes the message to the debug log
- create notification 
    + creates a signalk notification


## use

