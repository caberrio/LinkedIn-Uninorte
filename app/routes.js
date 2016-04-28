var basicAuth = require("basic-auth");

var Users = require("./models/UsuarioSchema");
var Coffee = require("./models/OfertaSchema");

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
                LastName:req.body.lastname,
                Email:req.body.email,
                Telefono:Number,
                User:req.body.username,
                Contrasena:req.body.password,
                Codigo:req.body.codigo,
                Carrera:req.body.carrera,
                Semestre:req.body.semestre,
            });

            new_user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ result: 1 });
            });
        });
    });

    /*app.get("/api/coffees", function(req, res) {
        Coffee.find({}, function(err, coffees) {
            if (err)
                res.send(err);
            res.json(coffees);
        });
    });*/

   /* app.post("/api/pay", auth, function(req, res) {
        console.log("Payment request");
        console.log(req.body);

        var condition = { Names: [], Filters: [] };
        req.body.items.forEach(function(item) {
            condition.Names.push(item.Name);
            condition.Filters.push({ Name: item.Name, 'Sizes.Name': item.Size })
        });

        Coffee.aggregate().match({ 
            Name: { 
                $in: condition.Names
            },
        }).unwind("Sizes").match({
            $or: condition.Filters
        }).exec(function(err, coffees) {
            if (err)
                res.send(err);

            if (!coffees) {
                // No se encontraron cafés, la orden es inválida
                res.send({ result: 0, error: "Orden invalida" });
                return;
            }

            var price = 0;
            var flattened = {};

            coffees.forEach(function(coffee) {
                flattened[coffee.Name + coffee.Sizes.Name] = coffee;
            });

            req.body.items.forEach(function(item) {
                var val = flattened[item.Name + item.Size].Sizes.Price * item.Amount;
                flattened[item.Name + item.Size].Amount = item.Amount;
                console.log(item.Name + " costs " + flattened[item.Name + item.Size].Sizes.Price + " * " + item.Amount + " = " + val);
                price += val;
            });

            console.log("Total Price: " + price);
            console.log(coffees);

            var user = basicAuth(req);
            console.log("User: " + user.name);

            Users.findOne({ Username: user.name, Password: user.pass }, "-Password", function(err, dbUser) {
                if (err)
                    res.send(err);
                
                if (dbUser) {
                    var save_order = function() {
                        var obj = {
                            User: dbUser._id,
                            Pago: parseInt(req.body.method),
                            Latitude: req.body.coords.latitude,
                            Longitude: req.body.coords.longitude,
                            Items: []
                        };

                        for (var key in flattened) {
                            if (!flattened.hasOwnProperty(key))
                                continue;

                            var it = flattened[key];
                            obj.Items.push({
                                Coffee: it._id,
                                Amount: it.Amount,
                                Size: it.Sizes.Name,
                                Price: it.Amount * it.Sizes.Price
                            });
                        };

                        var new_order = new Order(obj);
                        new_order.save(function(err) {
                            console.log("Order saved");
                            console.log(new_order);
                        });
                    };

                    // Pay with points
                    if (req.body.method == "0") {
                        if (dbUser.Points < price) {
                            res.send({ result: 0, error: "Not enough points", user: dbUser });
                            return;
                        }

                        dbUser.Points -= price;

                        dbUser.save(function(err) {
                            if (err)
                                res.send(err);
                            save_order();
                            res.send({ result: 1, user: dbUser });
                        });
                    } else if (req.body.method == "1") { // Pay with credit card
                        // Award points
                        dbUser.Points += price / 10;
                        dbUser.save(function(err) {
                            if (err)
                                res.send(err);
                            save_order();
                            res.send({ result: 1, user: dbUser });
                        });
                    } else {
                        res.send({ result: 0, error: "Invalid payment method", user: dbUser });
                        return;
                    }
                } else {
                    res.send(401);
                }
            });
        });
    });*/

    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html');
    });
};