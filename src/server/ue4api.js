// ==============================================
//
// Project Name:
//
// Created by: Lightnet
//
// ==============================================
//import { promiseTimeout } from './timeout-promise';
var promiseTimeout = require('./timeout-promise').promiseTimeout;

var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const util = require('util');



//https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function genRandomString(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
}

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function sha512(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
}

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
}
//saltHashPassword('MYPASSWORD');
//saltHashPassword('MYPASSWORD');


router.get('/',function(req,res){
    res.json({'message' : 'ue4 Successfull'});
});

router.post('/login',function(req,res){
    console.log("checking ue4 login...");
    let username = "";
    let password = "";
    console.log(req.params) // unknown
    console.log(req.query) // ue4 varest
    console.log(req.body) // axios

    if(req.query.username != null){
        username = req.query.username;
        password = req.query.password;
    }

    if(req.body.username != null){
        username = req.body.username;
        password = req.body.password;
    }

    if(res.locals.gun != null){
        console.log("gun found!");
        console.log(username + ' : ' + password);
        //sha256('abc').then(hash => console.log(hash));
    }

    //console.log(res.locals.gun);
    console.log("username:"+ username);
    //console.log(req.params)
    //console.log(req.query.username)
    res.json({'message' : 'ue4 Successfull'});
});



/*
function promiseTimeout(ms, promise){
    let cleared = false;

    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
        console.log("time out!!!");
        reject('Timed out in '+ ms + 'ms.')
        //reject('false')
      }, ms)
    })

    promise
    .then(function(res){
        // If already cleared, the response is too late, we must not do anything
        if (! cleared) {
            clearTimeout(timer);
            resolve(res);
        }    
    })
    .catch(function(err){
        if (! cleared) {
            clearTimeout(timer);
            reject(err);
        }    
    });
  
    // Returns a race between our timeout and the passed in promise
    return Promise.race([
      promise,
      timeout
    ])
}
*/

/*
export const promiseTimeout = function(ms, promise){

    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
        reject('Timed out in '+ ms + 'ms.')
      }, ms)
    })
  
    // Returns a race between our timeout and the passed in promise
    return Promise.race([
      promise,
      timeout
    ])
}
*/

function doSomething(){
    return new Promise((resolve, reject) => {
      /* ...  */
    })
}

async function checkuserexist(gun,userdata){
    let lusers = gun.get('users');
    let bfound = false;

    //let userdatas = await lusers.map().once().then();
    //console.log(userdatas);
    //console.log(lusers.map().once())
    
    let p1 = new Promise((resolve, reject) => {
        console.log('List: ')
        lusers.map().once(function(data, key){
            //console.log("Item:", data);
            //console.log("key:", key);
            console.log('data.username: '+data.username)
            if(data.username == userdata.username){
                console.log("found! user");
                resolve('true'); // fulfilled
                return;
            }
        });
    });
    //compare 2 result which is done
    let promiserace = promiseTimeout(2000,p1);

    return promiserace.then((res) => {
        console.log("promise");
        console.log(res);
        return true;
    }).catch(error => {
        // Deal with error
        console.log("error");
        return false;
    });
}


router.post('/register',async function(req,res){
    console.log("checking ue4 register...");
    let username = "";
    let password = "";
    //console.log(req.query) // ue4 varest
    //console.log(req.body) // axios

    if(req.query.username != null){
        username = req.query.username;
        password = req.query.password;
    }

    if(req.body.username != null){
        username = req.body.username;
        password = req.body.password;
    }

    let messagedata = {
        message : 'ue4 Successfull',
        //id:'',
        //session:'',
    }


    if(res.locals.gun != null){
        let gun = res.locals.gun;
        
        let bfound = await checkuserexist(gun,{username:username,password:password});
        console.log("bfound:"+bfound);
        if(bfound == false){
            //if not found is add to database
            console.log("add users");
            
            let lusers = gun.get('users');

            var salt = genRandomString(16);
            var usersaltdata = sha512(username, salt);
            var idsalt = usersaltdata.passwordHash;

            var passwordData = sha512(password, salt);
            //console.log(passwordData);

            lusers.set({
                salt:salt,
                idsalt:idsalt,
                username:username,
                passwordhash:passwordData.passwordHash
            });
            
            messagedata.message = "Added!";
        }else{
            messagedata.message = "Exist!";

        }

        //lusers.map().once(function(data, key){
            //console.log("Item:", data);
        //});


        //console.log("gun found!");
        //sha256('abc').then(hash => console.log(hash));

        //var salt = genRandomString(16); /** Gives us salt of length 16 */
        //var passwordData = sha512(password, salt);
        //console.log('UserPassword = '+password);
        //console.log('Passwordhash = '+passwordData.passwordHash);
        //console.log('nSalt = '+passwordData.salt);




        //messagedata.id = "0000";
    }

    //console.log("username:"+ username + " : "  + password);
    //console.log(req.params)
    //console.log(req.query.username)
    res.json(messagedata);
});

/*
router.post('/character',function(req,res){
    res.json({'message' : 'ue4 character'});
});

router.post('/inventory',function(req,res){
    res.json({'message' : 'ue4 inventory'});
});

router.post('/equips',function(req,res){
    res.json({'message' : 'ue4 equips'});
});

router.post('/shop',function(req,res){
    res.json({'message' : 'ue4 shop'});
});

router.post('/skills',function(req,res){
    res.json({'message' : 'ue4 spawn'});
});

router.post('/spawn',function(req,res){
    res.json({'message' : 'ue4 spawn'});
});
*/

module.exports = router;