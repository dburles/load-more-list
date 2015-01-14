Meteor.startup(function() {
  if (Messages.find().count() === 0) {
    _.times(100, function() {
      Factory.create('message');
    });
  }
  if (Books.find().count() === 0) {
    _.times(50, function() {
      Factory.create('book');
    });
  }
});
