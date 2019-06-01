var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    res.json({'message' : 'ue4 Successfull'});
});


router.post('/login',function(req,res){
    console.log("checking ue4 login...");
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

    if(res.locals.gun != null){
        console.log("gun found!");

    }

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

    if(res.locals.gun != null){
        console.log("gun found!");

    }

    console.log("username:"+ username);
    //console.log(req.params)
    //console.log(req.query.username)
    res.json({'message' : 'ue4 Successfull'});
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