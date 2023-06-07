let express = require("express") ;
let app = express();
app.use(express.json ());
app.use( function (req, res, next) {
res.header("Access-Control-Allow-Origin","*");
res.header( "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD");
res. header( "Access-Control-Allow-Headers", "Origin, x-Requested-With, Content-Type, Accept");
next();
});
var port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}!`));




const { Client } = require("pg");
const client = new Client({
    user: "postgres",
    password: "Rajesh8789kum@r",
    database: "postgres",
    port: 5432,
    host: "db.jycbwqbmmkcavrwqiqzi.supabase.co",
    ssl: { rejectUnauthorized: false },
});
client.connect(function (res, error) {
    console.log(`Connected!!!`);
});



app.get("/employees", function(req,res){
    let department = req.query.department;
    let designation = req.query.designation;
    let gender = req.query.gender;
    let sql = "SELECT * FROM employees";
    client.query(sql, function(err,data){
        if(err) res.send(err)
        else {
            let arr1 = data.rows;
            if(department) arr1 = arr1.filter(e1=>e1.department===department);
            if(designation) arr1 = arr1.filter(e1=>e1.designation===designation);
            if(gender) arr1 = arr1.filter(e1=>e1.gender===gender);
            res.send(arr1);
        }
    });
});



app.get("/employees/:id",function(req,res){
    let id = req.params.id;
    console.log(id);
    let sql = "SELECT * FROM employees where id=$1";
    client.query(sql,[id], function(err,data){
        console.log(data);
        if(err) res.status(400).send(err);
        else res.send(data.rows);
    });
});


app.post("/employees",function(req,res){
    let body = req.body;
    var values = Object.values(req.body);
    let sql = "INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES ($1,$2,$3,$4,$5,$6)";
    client.query(sql,values,function(err,data){
        if(err) res.send(err)
        else{
            res.send(`insertion successful`);
        };
    })
});


app.put("/employees/:id",function(req,res){
    let id = req.params.id;
    var values = Object.values(req.body);
    values.push(id);    
    let sql = "UPDATE employees SET empCode=$1,name=$2,department=$3,designation=$4,salary=$5,gender=$6 WHERE id=$7";
    client.query(sql,values,function(err,result){
        if(err) res.status(404).send(err); 
        else res.send(`updation successful`);
    })
});



app.delete("/employees/:id",function(req,res){
    let id = req.params.id;
    let sql1 = "DELETE FROM employees where id=$1";
    client.query(sql1,[id],function(err,result){
        if(err) res.status(404).send(err); 
        else res.send(`${result.rowCount} delete successful`);
    });
});