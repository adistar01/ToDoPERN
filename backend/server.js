const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('./db');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


// GET all todos
app.get("/todos/:email", async(req, res)=>{

    // const userEmail = req.body.email;
    
    const { email } = req.params;
    // console.log(email);

    try{
        const todos = await pool.query(`SELECT * FROM todos WHERE user_email=$1`, [email]);
        // console.log(todos);
        return res.json(todos.rows);
    }catch(err){
        res.json({
            "error": "Not"
        })
        console.log(err);
    }
})


// Create a new todo
app.post("/todos", async(req, res)=>{
    const { user_email, title, progress, date} = req.body;
    console.log( user_email, title, progress, date );
    const id = uuidv4();
    try{
        const newToDo = await pool.query('INSERT INTO todos(id, user_email, title, progress, date) VALUES ($1, $2, $3, $4, $5)', [id, user_email, title, progress, date])
        res.json(newToDo);
    }catch(err){
        res.json({
            "error": "Not"
        })
        console.log(err);
    }
})


// Edit a todo
app.put("/todos/:id", async(req, res)=>{
    const { id } = req.params;
    const {user_email, title, progress, date} = req.body;
    try{
        const editToDo = await pool.query('UPDATE todos SET user_email = $1, title = $2, progress=$3, date=$4 WHERE id=$5', [user_email, title, progress, date, id]);
        res.json(editToDo);
    }catch(err){
        res.json({
            "error": "Not"
        })
        console.log(err);
    }
})


// Delete a todo
app.delete("/todos/:id", async(req, res)=>{
    const { id } = req.params;
    try{
        const deleteToDo = await pool.query('DELETE FROM todos WHERE id=$1;', [id]);
        res.json(deleteToDo);
    }catch(err){
        res.json({
            "error": "Not"
        })
        console.log(err);
    }
})


// Signup
app.post('/signup', async(req, res)=>{
    const {email, password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    try{
        const signUp = await pool.query('INSERT INTO users (email, hashed_password) VALUES ($1, $2);', [email, hashedPassword]);
        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'});
        res.json({
            email,
            token
        })
    }catch(e){
        res.json({
            "error": e.detail
        })
        console.log(e);
    }
})


// LogIn
app.post('/login', async(req, res)=>{
    const {email, password} = req.body;
    try{
        const users = await pool.query('SELECT * FROM users WHERE email = $1;', [email]);
        if(!users.rows.length){
            return res.json({
                "error": "User does not exist!"
            })
        }
        const success = await bcrypt.compare(password, users.rows[0].hashed_password);
        const token = jwt.sign({email}, 'secret', {expiresIn: "1hr"})
        if(success){
            return res.json({
                'email': users.rows[0].email, token
            })
        }else{
            res.json({
                "error": "Login failed"
            })
        }
    }catch(e){
        res.json({
            "error": e
        })
        console.log(e);
    }
})



PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})