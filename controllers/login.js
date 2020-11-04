var express = require('express');
var router = express.Router();

/// --- Code CONTROLLERs
router.use(function timeLog (req, res, next) {
    console.log('\n\t Login controller - Time: ', Date.now());
    next();
})

router.get('/login', loginPage);
function loginPage(req, res) {
    if (session.user) {
        res.redirect('/');
    } else {
        if (req.query.username && req.query.username.trim() != "") {
            accsubmit = {
                username : req.query.username.trim(),
                password : req.query.password.trim()
            };
            session.user = accsubmit;
            res.redirect('/');
            console.log(accsubmit);
        } else {
            res.render("pages/login", {title: "ATN-Shop LOGIN page", configHeader: configHeader , currpage: "Login"  });
        }
        console.log("\t login ", req.session);
    }
}
module.exports = router;