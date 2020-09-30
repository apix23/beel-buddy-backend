const express = require('express');
const cors = require('cors')
const app = express();
const formidable = require('express-formidable');
const PORT = process.env.PORT || 9000;

app.use(cors());

const {Pool} = require('pg');

const pool = new Pool({
    user:'migracode',
    host:'localhost',
    database:'buddies_app',
    password:'occlaptop1',
    port: 5432
})

app.use(formidable())
app.use(express.static("public"));

app.get('/get-table',(req,res)=>{
    const query = `select b.*, p."name" as matchName, m.enabled as matchEnabled from buddies b 
    left join matches m on m.buddyid = b.id 
    left join patients p on m.patient_id = p.id
    where b.enabled = 1  
        
    union 
    
    select  p.*, b."name" as matchName, m.enabled as matchEnabled from patients p 
    left join matches m on m.patient_id = p.id 
    left join buddies b on m.buddyid = b.id 
    where p.enabled = 1 
    
    order by joined_at desc;`;
    
    console.log("entro al get");
    pool
    .query(query)
    .then((result) => {res.json(result.rows)})
    .catch((e) => console.error(e));
})


app.get('/test-page', function (req, res) {
    const query = "SELECT * FROM  buddies"

    pool
    .query(query)
    .then((result) => {res.json(result.rows)})
    .catch((e) => console.error(e));
    
})

app.post('/get-login-info',function (req,res) {
    const email = req.fields.email;
    const password = req.fields.password;

    const query = "SELECT * FROM administrators a where a.email = $1"

    res.set('Content-Type', 'text/html');

    pool
    .query(query,[email])
    .then((result) => {

        console.log(result.rows);
        if (email === result.rows[0].email) {
            console.log("entre en el primer if, email son iguales");
            if (password === result.rows[0].password) {
                console.log("la contraseña es la adecuada")
                res.send({email: "right", password: "right"});
            }
            else{
                console.log("la contraseña es invalida")
                res.send({email: "right", password: "wrong"})
            }
        }
        else{
            console.log("El email tiene un problema");
            res.send({email: "wrong", password: "wrong"})
        }
    })
    .catch((e) => {
        res.send({email:"wrong",  source: "catch"})
    })

})



app.post('/create-user',function (req,res) {
    const name = req.fields.name;
    const dateofbirth = req.fields.birthDate;
    const email = req.fields.email;
    const hometown = req.fields.hometown;
    const hobbiesandinterests = req.fields.hobbies;
    const im_a_buddy = req.fields.im_a_buddy;
    const enabled = 1;

    const joined_at = new Date();
    let query;

    if(im_a_buddy){
        query = "INSERT INTO buddies (name,dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy,joined_at, enabled) VALUES ($1, $2, $3 ,$4, $5, $6,$7,$8 )"
    } else{
        query ="INSERT INTO patients (name,dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy,joined_at, enabled) VALUES ($1, $2, $3 ,$4, $5, $6,$7,$8 )"
    }
    
    pool
    .query(query,[name,dateofbirth,email,hometown,hobbiesandinterests,im_a_buddy,joined_at,enabled])
    .then(()=> res.json("User added succesfully"))
    .catch((e) => console.log(e))
})

app.put('/disable-user', (req, res) => {
    console.log("Disabling an user");
    
    const isBuddy = req.fields.isBuddy;
    const id = req.fields.id;

    let query = "";
    
    isBuddy === 0? query = "UPDATE patients SET enabled=0 WHERE id=$1" : query = "UPDATE buddies SET enabled=0 WHERE id=$1";

    pool
    .query(query,[id])
    .then( console.log("disabling user done"))
    .catch((e) => console.log(e));

    res.send("Done");
})

app.post('/create-match', (req, res) => {
    console.log("Creating a new match");

    let buddyId = 0, patientId = 0;

    if(req.fields.isBuddy_u1) {
        buddyId = req.fields.id_u1;
        patientId = req.fields.id_u2;
    } else {
        buddyId = req.fields.id_u2;
        patientId = req.fields.id_u1;
    }

    const creationDate = new Date();

    const query = "INSERT INTO matches (patient_id, buddyid, admin_id, start_date_of_match, enabled) VALUES ($1, $2, 1, $3, 1)";

    pool
    .query(query,[patientId, buddyId, creationDate])
    .then(()=> res.json(result.rows))
    .catch((e) => console.log(e))
    
})

app.put('/update-match', (req, res) => {
    console.log("Updating a match", req.fields);

    let buddy_id = 0, patient_id = 0;

    if(req.fields.current_isBuddy) {
        console.log("Inside the if");
        //Giving values if the current user is a buddy
        buddy_id = req.fields.current_id;
        patient_id = req.fields.match_id;
    } else {
        console.log("Inside the else");
        //Giving values if the current user is a patient
        buddy_id = req.fields.match_id;
        patient_id = req.fields.current_id;
    }

    console.log("After the if, patient_id is", patient_id, "and buddy_id is ", buddy_id);

    const currentId = req.fields.current_id;
    const currentIsBuddy = req.fields.current_isBuddy;

    const creationDate = new Date();

    //Query to disable the existent match
    let query = "";
    currentIsBuddy == 1? query = "UPDATE matches set enabled=0 where buddyid=$1" : query = "UPDATE matches set enabled=0 where patient_id=$1";
    console.log("the query 1 would be: ", query, currentId);
    
    //Query to create the new match for the user
    const query2 = "INSERT INTO matches (patient_id, buddyid, admin_id, start_date_of_match, enabled) VALUES ($1, $2, 1, $3, 1)";

    pool
    .query(query, [currentId])
    .then(result => {console.log("disabling the match")})
    .catch((e) => console.log(e))

    pool
    .query(query2,[patient_id, buddy_id, creationDate])
    .then(result => {console.log("inserting the new match")})
    .catch((e) => console.log(e))
    
})




app.listen(PORT,function () {
    console.log(`Server running in port ${PORT}`);
})
