const express = require('express')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3001

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'presupuesto'
})

const protectedRoute = express.Router();

protectedRoute.use((req, res, next) => {
    const token = req.header('access-token');
    if(token){
        jwt.verify(token, '&Dr3trrg923!', (err, decoded) => {
            if(err){
                return res.json({message: 'Invalid token'})
            }
            else{
                req.decoded = decoded;
                next()
            }
        })
    }
    else{
        res.send({
            message: 'There is no token'
        })
    }
})

function getJWT(userId){
    let payload = {
        userId: userId
    }
    return jwt.sign(payload, process.env['JWT_KEY'], {
        expiresIn: 20160
    })
}

app.post('/register', (req, res) => {
    let email = req.body.email;
    let passwords = req.body.passwords;

    connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }
    })

    connection.query(mysql.format("SELECT * FROM ?? WHERE ?? = ?", ['users', 'email', email]), (err, results, fields) => {
        if(fields.fieldsCount > 0){
            connection.query(mysql.format("INSERT INTO users (??, ??) VALUES (?, ?)", ['email', 'password', email, password]), (err, results, fields) => {
                if(err){
                    res.send(err)
                }
                else{
                    res.send(results)
                }
            })
        }
        else{
            res.send('The email is already registered')
        }
    })

})

app.post('/login', (req, res) => {

    let email = 'test2@test'
    let password = '1234'
    connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }
    })

    connection.query(mysql.format("SELECT * FROM ?? WHERE ?? = ?", ['users', 'email', email]), (err, results, fields) => {
        if(err){
            throw err;
        }
        if(results){
            if (password === results[0].password){
                res.json({
                    status: 'OK',
                    message: 'Authenticated',
                    token: jwt.sign({userId: results.user_id}, '&Dr3trrg923!', {expiresIn: 20160})
                })
            }
            else{
                res.send("The password is not correct")
            }
        }
        else{
            res.send("The user doesn't exists")
        }
    })

})

app.set('trust proxy', function (ip) {
    if (ip === '127.0.0.1:3000') return true; // trusted IPs
    else return false;
  });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })