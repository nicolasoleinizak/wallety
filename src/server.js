const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config({path:'../.env' })
const jwt = require('jsonwebtoken')
const app = express()
const cors = require('cors')
const { query } = require('express')
const port = 3001

// Creates a pool for avoiding to manage inidividual connections
const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'presupuesto'
  });

// Allow the frontend server to access server throught cors
app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(express.json())

// The protectedRoute middleware is usefurl to authenticate users and authorize (or not) the access to the server
const protectedRoute = express.Router();

protectedRoute.use((req, res, next) => {
    const token = req.header('access-token');
    if(token){
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if(err){
                return res.json({message: 'Invalid token'})
            }
            else{
                req.decoded = decoded;
                next();
            }
        })
    }
    else{
        res.send({
            message: 'There is no token'
        })
    }
})

// Registering a new user
app.post('/register', (req, res) => {

    // Only two fields requested: email and password
    let email = req.body.email;
    let passwords = req.body.passwords;

    // Looks if there is not another register in the database with the same email address (already existing user)
    pool.query(mysql.format("SELECT * FROM ?? WHERE ?? = ?", ['users', 'email', email]), (err, results, fields) => {
        if(fields.fieldsCount > 0){
            connection.query(mysql.format("INSERT INTO users (??, ??) VALUES (?, ?)", ['email', 'password', email, password]), (err, results, fields) => {
                if(err){
                    res.send(err);
                }
                else{
                    res.send(results);
                }
            })
        }
        else{
            res.send('The email is already registered');
        }
    })
})

app.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password ;
    pool.query(mysql.format("SELECT * FROM ?? WHERE ?? = ?", ['users', 'email', email]), (err, results, fields) => {
        if(err){
            throw err;
        }
        // Check if the user (email) exists
        if(results[0]){
            // Check if the password is equal to the password in database
            if (password === results[0].password){
                res.json({
                    status: 'OK',
                    message: 'Authenticated',
                    token: jwt.sign({userId: results[0].id}, process.env.JWT_KEY, {expiresIn: 20160})
                })
            }
            else{
                res.send("The password is not correct");
            }
        }
        else{
            res.send("The user doesn't exists");
        }
    })
})

app.get('/get_records', protectedRoute, (req, res) => {
    let userId = req.decoded.userId;
    // Search a record with an id, also checks if the user id matches
    pool.query(mysql.format("SELECT ??, ??, ??, ??, ?? FROM ?? WHERE ?? = ?", ['id', 'type', 'subject', 'amount', 'date', 'records', 'user_id', userId]), (err, results, fields) => {
        if(err) throw err;
        if(results){
            res.json({
                status: 'HTTP1.0 200 OK',
                message: 'Records are being served',
                data: results
            });
        }
        else{
            res.json({
                status: 'HTTP1.0 204 No Content',
                message: 'There is no records data in database'
            })
        }
    })

})

app.post('/create_record', protectedRoute, (req, res) => {
    let userId = req.decoded.userId
    let record = req.body
    // Insert a record with the corresponding user id
    pool.query(mysql.format("INSERT into ?? (??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)", ['records', 'subject', 'amount', 'date', 'type', 'user_id', record.subject, record.amount, record.date, record.type, userId]), (err, results, fields) => {
        if(err){
            res.json(err)
        }
        else{
            res.json({
                newOrderId: results.insertId
            })
        }
    })
})

app.post('/update_records', protectedRoute, (req, res) => {
    let userId = req.decoded.userId
    let updatedRecords = req.body.data;
    for(let record of updatedRecords){
        // Updates a record that matches on record id and user id
        let sql = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ?";
        let inserts = ['records', 'subject', record.subject, 'date', record.date, 'amount', record.amount, 'id', record.id, 'user_id', userId];
        pool.query(mysql.format(sql, inserts), (err, results, fields) => {
            if(err){
                res.json({
                    status: 'HTTP1.0 500 Internal Server Error',
                    message: 'An error occurred while database accessing'
                })
            }
            else{
                res.json({
                    status: 'HTTP1.0 200 OK',
                    message: 'The data was successfully updated'
                })
            }
        })
    }
})

app.delete('/delete_record', protectedRoute, (req, res) => {
    let userId = req.decoded.userId
    let recordId = req.query.id;
    // Deletes a record that matches on record id and user id
    pool.query(mysql.format("DELETE FROM ?? WHERE ?? = ? AND ?? = ?", ['records', 'id', recordId, 'user_id', userId]), (err, results, fields) => {
        if(err){
            res.json(err)
        }
        else{
            res.json({
                status: 'HTTP1.0 200 OK',
                message: 'The record was successfully deleted'
            })
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })