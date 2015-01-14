Books = new Mongo.Collection('books');

Books.list = function(options) {
  options = _.extend({ sort: { name: 1 }}, options);
  return Books.find({}, options);
};
