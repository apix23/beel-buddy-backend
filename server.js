const express = require('express');
const cors = require('cors')
const app = express();
const formidable = require('express-formidable');

app.use(cors());

const {Pool} = require('pg');

const pool = new Pool({
    user:'krmjfrotzrajhy',
    host:'ec2-54-146-142-58.compute-1.amazonaws.com',
    database:'dc38re1f04hbsi',
    password:'aca0cb54deabcae595f5fe90cf86b2922b7f35b5bd39ff5192c7383deb4689c2',
    port: 5432
})

app.use(formidable())
app.use(express.static("public"));

app.get('/get-table',(req,res)=>{
    const query = `select b.*, p."name" as matchName from buddies b 
    left join matches m on m.buddyid = b.id 
    left join patients p on m.patient_id = p.id
    where b.enabled = 1 
    
    union 
    
    select p.*, b."name" as matchName from patients p 
    left join matches m on m.patient_id = p.id 
    left join buddies b on m.buddyid = b.id 
    where p.enabled = 1 
    
    order by joined_at desc;`;
    
    console.log("entro al get");
    pool
    .query(query)
    .then((result) => {res.json(result.rows); console.log(result.rows)})
    .catch((e) => console.error(e));
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
    .then(()=> res.json(result.rows))
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




app.listen(9000,function () {
    console.log('Server running in port 9000');
})