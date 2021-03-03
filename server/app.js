const express = require("express");
const cors = require("cors");

const model = require("./model");


const app = express();
const port = 3000;

app.use(express.urlencoded({extended : false}));
app.use(cors());



// BARBER METHODS

//LIST ALL THE BARBERS
app.get("/barbers",function(req,res){
  model.Barber.find().then(function(barbers){
    console.log("Barbers queried from db: ", barbers);
    res.json(barbers);
  });
});

app.post("/barbers", function(req, res){
  //CHECK IF EMAIL IS UNIQUE
  model.Barber.findOne({ email: req.body.email}).then(function(barber){
    // console.log(barber.password);
    if (barber && barber.password == req.body.password){
      // USER EXISTS
      res.status(200).json(barber);

    }
    else if (barber && barber.password != req.body.password){
      //THE EMAIL EXISTS, THEREFORE ACCOUNT CANNOT BE CREATED
      res.sendStatus(409);
    }
    else{
      var barber = new model.Barber({
        email : req.body.email,
        password : req.body.password
      });

      barber.save().then(function(){
        console.log(barber);
        res.status(201).json(barber);
      });
    }
  })
});

// SERVICES METHODS
app.post("/barbers/:userId/services", function(req, res){
  const userId = req.params.userId;
  const newService = new model.Service(req.body);

  model.Barber.findById(userId).then(function(barber){
    newService.barber = barber;
    newService.date = new Date();

    newService.save().then(function(){
      barber.services.push(newService);
      barber.save().then(function(){
        res.sendStatus(201);
      })
    })
  })
})

app.get("/barbers/:userId/services", function(req, res){
  model.Barber.findById(req.params.userId).populate("services").then(function(barber){
    res.json(barber.services);
  })
})





// // SERVICE
//
// //LIST ALL THE SERVICES
// app.get("/services",function(req,res){
//   model.Service.find().then(function(services){
//     console.log("services queried from db: ", services);
//     res.json(services)
//   });
// });
//
// app.post("/services", function(req, res){
//   var currentDate = new Date();
//
//   var service = new model.Service({
//     firstName : req.body.firstName,
//     lastName : req.body.lastName,
//     email : req.body.email,
//     type : req.body.type,
//     phoneNumber : req.body.phoneNumber,
//     price : req.body.price,
//     tip : req.body.tip,
//     date : currentDate
//   });
//
//   service.save().then(function(){
//     res.sendStatus(201);
//   });
//
// });





/////////////////////////////////////////////////////////////

// // BARBER ACCOUNT
// const Barber = mongoose.model('Barber',{
//   firstName : String,
//   lastName : String,
//   // userName : String,
//   email : String,
//   password : String
// });
//
// //LIST ALL THE BARBERS
// app.get("/barbers",function(req,res){
//   Barber.find().then(function(barbers){
//     console.log("barbers queried from db: ", barbers);
//     res.json(barbers)
//   });
// });
//
// app.post("/barbers", function(req, res){
//
//   //CHECK IF EMAIL IS UNIQUE
//   Barber.findOne({ email: req.body.email}).then(function(barber){
//     if (barber){
//       // email alreayd exists in the db
//       res.sendStatus(409);
//     }
//     else{
//       var barber = new Barber({
//         firstName : req.body.firstName,
//         lastName : req.body.lastName,
//         // userName : req.body.userName,
//         email : req.body.email,
//         password : req.body.password
//       });
//
//       barber.save().then(function(){
//         res.sendStatus(201);
//       });
//     }
//   })
//
// });

//////////////////////////////////////////////////






app.listen(port, function(){
  console.log(`app listening at http://localhost:${port}`);
})
