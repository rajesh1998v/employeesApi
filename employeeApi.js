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

let mysql = require("mysql");



let connData={
    host: "localhost",
    user: "root",
    password: "",
    database: "testDB"
};



app.get("/employees", function(req,res){
    let department = req.query.department;
    let designation = req.query.designation;
    let gender = req.query.gender;
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM employees";
    connection.query(sql, function(err,data){
        if(err) res.send(err)
        else {
            let arr1 = data;
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
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM employees where id=?";
    connection.query(sql,id, function(err,data){
        if(err) res.send(err)
        else res.send(data);
    });
});



app.post("/employees",function(req,res){
    let body = req.body;
    let arr = [body.empCode,body.name,body.department,body.designation,body.salary,body.gender]
    let connection = mysql.createConnection(connData);
    let sql = "INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES (?,?,?,?,?,?)";
    connection.query(sql,arr,function(err,data){
        if(err) res.send(err)
        else{
            let sql2 = "SELECT * FROM employees";
            connection.query(sql2, function(err, result){
            if(err) res.status(404).send(err); 
            else res.send(result);
            });
        };
    })
});


app.put("/employees/:id",function(req,res){
    let id = req.params.id;
    let body = req.body;
    let arr = [body.empCode,body.name,body.department,body.designation,body.salary,body.gender,id]
    let connection = mysql.createConnection(connData);
    let sql = "UPDATE employees SET empCode=?,name=?,department=?,designation=?,salary=?,gender=? WHERE id=?";
    connection.query(sql,arr,function(err,result){
        if(err) res.status(404).send(err); 
        else res.send(result);
    })
});



app.delete("/employees/:id",function(req,res){
    let id = req.params.id;
    let connection = mysql.createConnection(connData);
    let sql1 = "DELETE FROM employees where id=?";
    connection.query(sql1,id,function(err,result){
        if(err) res.status(404).send(err); 
        else res.send(result);
    });
});