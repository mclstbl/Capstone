var Datastore = require('react-native-local-mongodb')
, users = new Datastore({ filename: 'users', autoload: true })
, log = new Datastore({ filename: 'log', autoload: true });

exports.getUser = function(user, cb){
  //{username: 'test', password: 'test'}
  users.findOne({ $and: [
      {$or: [
          {username: user.username},
          {email: user.username}
      ]},
      {'password': user.password}
  ]}, function (err, doc) {
    cb(doc);
  });
}

exports.insertUser = function(user, cb){
  //{username: 'test', email: 'test@test.com', name: 'test',password: 'test'}
  users.insert(user, function (err, doc) {
    cb(doc);
  });
}