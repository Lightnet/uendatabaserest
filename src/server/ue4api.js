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


router.post('/register',function(req,res){
    console.log("checking ue4 register...");
    let username = "";
    let password = "";
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

    let messagedata = {
        message : 'ue4 Successfull',
        id:'',
        session:'',
    }

    if(res.locals.gun != null){
        let gun = res.locals.gun;
        //let lusers = gun.get('users');

        //lusers.map().once(function(data, key){
            //console.log("Item:", data);
        //});

        //console.log("gun found!");
        //sha256('abc').then(hash => console.log(hash));

        var salt = genRandomString(16); /** Gives us salt of length 16 */
        var passwordData = sha512(password, salt);
        console.log('UserPassword = '+password);
        console.log('Passwordhash = '+passwordData.passwordHash);
        console.log('nSalt = '+passwordData.salt);
        messagedata.id = "0000";
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