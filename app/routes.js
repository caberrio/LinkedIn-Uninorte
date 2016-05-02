var basicAuth = require("basic-auth");

var Users = require("./models/UserSchema");
var Offer = require("./models/OfferSchema");

var auth = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };

    Users.findOne({ Username: user.name, Password: user.pass }, function(err, user) {
        if (err)
            return unauthorized(res);

        if (user)
            return next();

        return unauthorized(res);
    });
};

module.exports = function(app) {
    app.post("/api/authenticate", function(req, res) {
        console.log("Auth request: ");
        console.log(req.body.username);
        console.log(req.body.password);

        Users.findOne({ Username: req.body.username, Password: req.body.password }, "-Password", function(err, user) {
            if (err)
                res.send(err);
            
            if (user)
                res.json({ result: 1, user: user });
            else
                res.json({ result: 0, user: null });
        });
    });

    app.post("/api/register", function(req, res) {
        console.log("Register request: ");
        console.log(req.body);

        // Verificar que el usuario no exista
        Users.where({ Username: req.body.username }).count(function(err, count) {
            if (err) {
                console.log(err);
                res.send(err);
            }

            if (count !== 0) {
                res.json({ result: 0, error: 'User already exists' });
                return;
            }

            var new_user = new Users({
                Name: req.body.name,
                LastName: req.body.lastName,
                Email: req.body.email,
                Telefono: req.body.telephone,
                User: req.body.username,
                Contrasena: req.body.password,
                Codigo: req.body.code,
                Carrera: req.body.career,
                Semestre: req.body.semester,
            });

            new_user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ result: 1 });
            });
        });
    });

    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html');
    });
};
