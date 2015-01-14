Template.componentList.created = function() {
  var self = this;
  self.limitBy = this.data.limitBy || 6;
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
