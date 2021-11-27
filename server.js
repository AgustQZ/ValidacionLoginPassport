const express = require('express');
//libreria de autenticacion de usuarios
const passport = require('passport');
//para guardar datos en el navegador
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportLocal = require('passport-local').Strategy;

const app = express();

//para leer los datos enviados del formulario
app.use(express.urlencoded({extended: true}));
//usar paquetes para que express pueda usar sesiones
app.use(cookieParser('mi mas grande secreto'));
app.use(session({
    secret: 'mi mas grande secreto',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
//instancia del objeto strategy para enviar el resultado del proceso de autenticacion
passport.use(new passportLocal(function (username, password, done){
    if(username === "admininicial" && password === "admin123456")
    //crear el objeto de no haber errores
    return done (null, {id: 1, name: "Agus"});

    done(null, false);
}));
//serializar el usuario para guardarlo
passport.serializeUser(function(user, done){
    done(null, user.id);
});
//deserializar el usuario guardado
passport.deserializeUser(function(id,done){
    //retornar el objeto
    done(null, {id: 1, name: "Agus"})
})

//definir motor de vistas
app.set('view engine', 'ejs');


// solo se ingresa si se inicio sesion
//middleware isAuthenticated
app.get("/",(req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
} , (req, res) => {
    // mostrar si se inicio sesion
    res.render('sucursales')
});

// login
app.get("/login", (req, res) => {
    //mostrar formulario de login
    //por defecto express busca los ejs en views
    res.render("login");
});

// nueva vista para recibir credenciales e iniciar sesion--middleware
app.post("/login", passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/login"
}));

app.listen(3555, ()=> console.log("Escuchando por el localhost:3555"));