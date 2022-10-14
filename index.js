const express = require("express");
const app = express();
const port = 3000;
const CC = require("currency-converter-lt");


const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const request = require("request");

var serviceAccount = require("./key.json");
const { response } = require("express");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.get("/signinsubmit", (req, res) => {
  const email = req.query.email;
  const password = req.query.pwd;

  db.collection("users")
    .where("email", "==", email)
    .where("password", "==", password)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        //query my database with all the users only when login is succefull
        res.render("result")
      }
      else{
        res.render("signup")
      }
    })
  });
       

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/signupsubmit", (req, res) => {
  const first_name = req.query.firstname;
  const last_name = req.query.lastname;
  const email = req.query.username;
  const password = req.query.password;

  //Adding new data to collection
  db.collection("users")
    .add({
      name: first_name + " "+ last_name,
      email: email,
      password: password,
    })
    .then(() => {
      res.render("signin");
    });
});

app.get("/rsubmit",function(req,res){
  
  /*const input1 = req.query.input1;
  request('https://api.weatherapi.com/v1/forecast.json?key=88cf4abebf3043bd8f663248223005&q='+input1+'&days=7',function(error,response,body){
if ("error" in JSON.parse(body)){
    if(JSON.parse(body).error.code.toString().length>0){
        console(JSON.parse(body).error.message);
    }

}
else{
    let data = JSON.parse(body);
    const d = "The current temperature of city "+data.location.name+" is "+data.current.temp_f;
console.log(typeof d);
res.render('output',{d:d});

}*/

const input1 = req.query.input1;
const input2 = req.query.input2;
const input3 = req.query.input3;
let a = parseInt(input1);


let fromCurrency = input2; // US Dollars
let toCurrency = input3; // Indian Ruppee

let amountToConvert = a;

let currencyConverter = new CC(
	{
		from: fromCurrency,
		to: toCurrency,
		amount: amountToConvert
	}
);

currencyConverter.convert().then((response)=>{
  

const d = amountToConvert + " " + fromCurrency + " is equal to " + 
response + " " + toCurrency;

res.render('output',{d:d});
});  

});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});