const express = require('express')
const session = require('express-session')

const FileStore = require('session-file-store')(session)
const passport = require('passport')

const app = express()
const port = 3001

app.use(express.json()) // to recognize the incoming Request Object as a JSON Object.
app.use(express.urlencoded({extended: false})) //to recognize the incoming Request Object as strings or arrays


app.use(
    session({
        secret: 'awfwagt',
        store: new FileStore(),
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        },
        resave: false,
        saveUninitialized: false
    })
)


require('./passportConfig') // подключение конфига

app.use(passport.initialize()) //подключаемся к сессии
app.use(passport.session()) //сохраняем пользоватеся


app.get('/', (req, res) => {
    res.send('Hello World!')
})


//сюда отправляем email и password для аунтификации
app.post('/login', (req, res, next) => {
    passport.authenticate("local", function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send('Enter correct email and password');
        }
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/admin');
        })
    })(req, res, next); //?
})


const auth = (req, res, next) => { //auth для входа на строницу
    if (req.isAuthenticated()) {
        next()
    } else {
        return res.redirect('/');
    }
}


app.get('/admin', auth, (req, res) => {
    res.send('Admin Page')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
