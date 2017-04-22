import * as firebase from 'firebase';

const config = {  
  apiKey: "AIzaSyAfE2OygAWAZaVEf5qenq3iraOFf8N8CkY",
  authDomain: "pisonaltrainer.firebaseapp.com",
  databaseURL: "https://pisonaltrainer.firebaseio.com",
  storageBucket: "pisonaltrainer.appspot.com",
};

const fb = firebase  
  .initializeApp(config)
  .database()
  .ref();

class Firebase{
    addUser(user, cb){
        var newUser = fb.child('users').push(user);
        cb(newUser.key);
    }

    getUser(user, cb, byEmail = true){
        var newUser = fb.child('users').orderByChild(byEmail ? 'email' : 'username').equalTo(user.username).on('value', (res) => {
            var val = res.val();
            if(val){
                var newval = null;
                for(key in val){
                    newval = val[key];
                    newval._id = key;
                }
                val = newval;
                if(val.password != user.password){
                    val = null;
                }
            }
            
            if(!val && byEmail){
                this.getUser(user, cb, false);
            }
            else{
                cb(val);
            }
        });
    }

    addLog(data){
        var userid = data.userid;
        delete data.userid;
        fb.child('users').child(userid).child('logs').push(data);
    }

    getLog(userid, muscleGroup, cb){
        fb.child('users').child(userid).child('logs').orderByChild('muscleGroup').equalTo(muscleGroup).on('value', (res) => {
            var val = res.val();
            ret = [];
            if(val){
                for(key in val){
                    ret.push(val[key]);
                }
            }
            alert(JSON.stringify(ret));
            cb(ret);
        });
    }
}

export default new Firebase();