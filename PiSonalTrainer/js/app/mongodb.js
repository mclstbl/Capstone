var Datastore = require('react-native-local-mongodb')
, config = new Datastore({ filename: 'config', autoload: true });
// , users = new Datastore({ filename: 'users', autoload: true })
// , log = new Datastore({ filename: 'log', autoload: true });


import Firebase from './firebase';

exports.getConfigByKey = function(key, cb){
  config.find({}, function (err, docs) {
    var ret = null;
    if(docs.length > 0){
      config_doc = docs[0];
      ret = config_doc[key];
    }
    cb(ret);
  });
}

exports.setConfigByKey = function(key, val){
  config.find({}, function (err, docs) {
    if(docs.length > 0){
      config_doc = docs[0];
      config_doc[key] = val;
      config.update({ _id: config_doc._id }, config_doc, {}, function () {
      });
    }
    else{
      var data = {};
      data[key] = val
      config.insert(data, function (err, doc) {
      });
    }
  });
}

exports.getUser = function(user, cb){
  //{username: 'test', password: 'test'}
  Firebase.getUser(user, (res)=>{
    cb(res);
  });
  // users.findOne({ $and: [
  //     {$or: [
  //         {username: user.username},
  //         {email: user.username}
  //     ]},
  //     {'password': user.password}
  // ]}, function (err, doc) {
  //   cb(doc);
  // });
}

exports.insertUser = function(user, cb){
  Firebase.addUser(user, (key) => {
    cb(key);
  });
  //{username: 'test', email: 'test@test.com', name: 'test',password: 'test'}
  // users.insert(user, function (err, doc) {
  //   cb(doc);
  // });
}

exports.insertLog = function(data, cb){
  // alert(JSON.stringify(data));
  Firebase.addLog(data);
  //{userid: '', muscleGroup: 'Biceps', exerciseType: 'Hammer Curls', date: '', weight: 2, sets: 3, reps: 10}
  // log.insert(data, function (err, doc) {
  //   cb(doc);
  // });
}


exports.getLog = function(muscleGroup, userid, cb){
  //{userid: '', muscleGroup: 'Biceps', exerciseType: 'Hammer Curls', date: '', weight: 2, sets: 3, reps: 10}
  Firebase.getLog(userid, muscleGroup, cb);
  // log.find({muscleGroup: muscleGroup, userid: userid}, function (err, docs) {
  //   cb(docs);
  // });
}