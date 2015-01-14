Factory.define('message', Messages, {
  createdAt: function() { return new Date(); },
  name: function() { return Fake.user().fullname; },
  message: function() { return Fake.sentence(); }
});

Factory.define('book', Books, {
  createdAt: function() { return new Date(); },
  name: function() { return Fake.sentence(); }
});
