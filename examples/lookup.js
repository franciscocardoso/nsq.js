
/**
 * Module dependencies.
 */

var nsq = require('..');

// subscribe

var reader = nsq.reader({
  nsqlookupd: ['0.0.0.0:4161'],
  maxInFlight: 100,
  topic: 'events',
  channel: 'ingestion'
});

reader.on('message', function(msg){
  console.log(msg);
  setTimeout(function(){
    msg.finish();
  }, 200);
});

reader.on('error', function(err){
  console.error('reader error: %s', err.stack);
});

// publish

var writer = nsq.writer({ host: '0.0.0.0', port: 4150 });

setInterval(function(){
  writer.publish('events', 'some message here', function(err){
    if (err) console.error('writer error: %s', err.stack);
  });
}, 1000);

process.on('uncaughtException', function(err){
  console.error('Uncaught: %s', err.stack);
  process.exit(1);
});