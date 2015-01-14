Messages = new Mongo.Collection('messages');

Messages.list = function(options) {
  options = _.extend({ sort: { createdAt: -1 }}, options);
  return Messages.find({}, options);
};
