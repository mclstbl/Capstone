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

exports.insertLog = function(data, cb){
  //{userid: '', muscleGroup: 'Biceps', exerciseType: 'Hammer Curls', date: '', weight: 2, sets: 3, reps: 10}
  log.insert(data, function (err, doc) {
    cb(doc);
  });
}


exports.getLog = function(muscleGroup, userid, cb){
  //{userid: '', muscleGroup: 'Biceps', exerciseType: 'Hammer Curls', date: '', weight: 2, sets: 3, reps: 10}
  log.find({muscleGroup: muscleGroup, userid: userid}, function (err, docs) {
    cb(docs);
  });
}