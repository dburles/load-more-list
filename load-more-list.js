Contacts = new Mongo.Collection('contacts');

Contacts.helpers({
  fullName: function() {
    return this.name.first + ' ' + this.name.last;
  }
});

Contacts.list1 = function(options) {
  options = _.extend({ sort: { 'name.last': 1 }}, options);
  return Contacts.find({}, options);
};

Contacts.list2 = function(options) {
  options = _.extend({ sort: { 'name.last': -1 }}, options);
  return Contacts.find({}, options);
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

  Template.contactsList1.helpers({
    cursor: function() {
      return Contacts.list1;
    }
  });

  Template.contactsList2.helpers({
    cursor: function() {
      return Contacts.list2;
    }
  });
}

if (Meteor.isServer) {

  Meteor.publish('contactsList1', function(limit) {
    check(limit, Number);
    Counts.publish(this, 'contactsList1', Contacts.list1(), { noReady: true });

    Meteor._sleepForMs(1000);

    return Contacts.list1({ limit: limit });
  });

  Meteor.publish('contactsList2', function(limit) {
    check(limit, Number);
    Counts.publish(this, 'contactsList2', Contacts.list2(), { noReady: true });

    Meteor._sleepForMs(1000);

    return Contacts.list2({ limit: limit });
  });

  Meteor.startup(function() {
    if (Contacts.find().count() === 0) {
      var users = JSON.parse(Assets.getText('users.json')).results;
      _.each(users, function(user) {
        Contacts.insert(user.user);
      });
    }
  });
}
