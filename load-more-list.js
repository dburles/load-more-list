Feed = new Mongo.Collection('feed');

Factory.define('feed', Feed, {
  createdAt: function() { return new Date(); },
  name: function() { return Fake.user().fullname; },
  message: function() { return Fake.sentence(); }
});

Feed.list1 = function(options) {
  options = _.extend({ sort: { createdAt: -1 }}, options);
  return Feed.find({}, options);
};

Feed.list2 = function(options) {
  options = _.extend({ sort: { createdAt: 1 }}, options);
  return Feed.find({}, options);
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

  Template.feedList1.helpers({
    cursor: function() {
      return Feed.list1;
    }
  });

  Template.feedList2.helpers({
    cursor: function() {
      return Feed.list2;
    }
  });
}

if (Meteor.isServer) {

  Meteor.publish('feedList1', function(limit) {
    check(limit, Number);
    Counts.publish(this, 'feedList1', Feed.list1(), { noReady: true });

    Meteor._sleepForMs(1000);

    return Feed.list1({ limit: limit });
  });

  Meteor.publish('feedList2', function(limit) {
    check(limit, Number);
    Counts.publish(this, 'feedList2', Feed.list2(), { noReady: true });

    Meteor._sleepForMs(1000);

    return Feed.list2({ limit: limit });
  });

  Meteor.startup(function() {
    if (Feed.find().count() === 0) {
      _.times(100, function() {
        Factory.create('feed');
      });
    }
  });
}
