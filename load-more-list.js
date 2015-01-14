Messages = new Mongo.Collection('messages');
Books = new Mongo.Collection('books');

Factory.define('message', Messages, {
  createdAt: function() { return new Date(); },
  name: function() { return Fake.user().fullname; },
  message: function() { return Fake.sentence(); }
});

Factory.define('book', Books, {
  createdAt: function() { return new Date(); },
  name: function() { return Fake.sentence(); }
});

Messages.list = function(options) {
  options = _.extend({ sort: { createdAt: -1 }}, options);
  return Messages.find({}, options);
};

Books.list = function(options) {
  options = _.extend({ sort: { createdAt: 1 }}, options);
  return Books.find({}, options);
};

if (Meteor.isClient) {
  Template.componentList.created = function() {
    var self = this;
    self.limitBy = 6;
    self.limit = new ReactiveVar(self.limitBy);
    self.autorun(function() {
      self.subscription = Meteor.subscribe(self.data.subscription, self.limit.get());
    });
  };

  Template.componentList.helpers({
    items: function() {
      return this.cursor({ limit: Template.instance().limit.get() });
    },
    showLoadButton: function() {
      return Counts.get(Template.instance().data.subscription) > Template.instance().limit.get();
    },
    loading: function() {
      return Template.instance().subscription &&
        ! Template.instance().subscription.ready();
    }
  });

  Template.componentList.events({
    'click [data-load]': function(event, template) {
      template.limit.set(template.limit.get() + template.limitBy);
    }
  });

  Template.body.helpers({
    messagesListCursor: function() {
      return Messages.list;
    }
  });

  Template.booksList.helpers({
    booksListCursor: function() {
      return Books.list;
    }
  });
}

if (Meteor.isServer) {

  Meteor.publish('messagesList', function(limit) {
    check(limit, Number);
    Counts.publish(this, 'messagesList', Messages.list(), { noReady: true });

    Meteor._sleepForMs(1000);

    return Messages.list({ limit: limit });
  });

  Meteor.publish('booksList', function(limit) {
    check(limit, Number);
    Counts.publish(this, 'booksList', Books.list(), { noReady: true });

    Meteor._sleepForMs(1000);

    return Books.list({ limit: limit });
  });

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
}
