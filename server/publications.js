Meteor.publish('messagesList', function(limit) {
  check(limit, Number);
  Counts.publish(this, 'messagesList', Messages.list(), { noReady: true });

  // mimic latency
  Meteor._sleepForMs(1000);

  return Messages.list({ limit: limit });
});

Meteor.publish('booksList', function(limit) {
  check(limit, Number);
  Counts.publish(this, 'booksList', Books.list(), { noReady: true });

  // mimic latency
  Meteor._sleepForMs(1000);

  return Books.list({ limit: limit });
});
