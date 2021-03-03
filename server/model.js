const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://jandir_17:PtiOpPuiU8jdjXMs@cluster0.vqspd.mongodb.net/serviceVille?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

// SERVICE MODEL DB
const serviceSchema = mongoose.Schema({
  firstName : String,
  lastName : String,
  email : String,
  // type : String,
  phoneNumber: String,
  price : String,
  date : Date,
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber'
  }
});

const Service = mongoose.model('Service', serviceSchema)

// BARBER(USER) ACCOUNT MODEL DB
const barberSchema = mongoose.Schema({
  email : String,
  password : String,
  services : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }]
});

const Barber = mongoose.model('Barber', barberSchema);


// EXPORTING SO IT CAN BE USED
module.exports = {
  Service : Service,
  Barber : Barber
}
