const passport = require("passport");

const LocalStrategy = require("passport-local")
const user = {
    id: 1,
    email: "test@gmail.com",
    password: "1234"
}

passport.serializeUser(function (user, done) { // сохраняет user
        console.log("Serialization ", user);
        done(null, user.id);                            //только id?
    }
)

passport.deserializeUser(function (id, done) { // проверяет id
        console.log("Deserialization", id)
        const user1 = (user.id === id) ? user : false; //сравниваем id юзера из database(user) с id который вернул serialize
        done(null, user1);
    }
)

passport.use( //?
    new LocalStrategy({usernameField: 'email'},  function verify(email, password, done) {
        if(email === user.email && password === user.password){
            return done(null, user)
        }else {
            return done(null, false)
        }
    })
)