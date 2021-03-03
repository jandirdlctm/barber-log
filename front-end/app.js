//CREATING THE BARBER ACCOUNT ON THE SERVER
function createBarberAccountOnServer(barber) {
  var barberData = "firstName=" + encodeURIComponent(barber.firstName);
  barberData += "&lastName=" + encodeURIComponent(barber.lastName);
  barberData += "&userName=" + encodeURIComponent(barber.userName);
  barberData += "&email=" + encodeURIComponent(barber.email);
  barberData += "&password=" + encodeURIComponent(barber.password);

  return fetch("http://localhost:3000/barbers", {
    method: "POST",
    body: barberData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function createNewBarberAccountOnServer(barber) {
  var barberData = "email=" + encodeURIComponent(barber.email);
  barberData += "&password=" + encodeURIComponent(barber.password);

  return fetch("http://localhost:3000/barbers", {
    method: "POST",
    body: barberData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function createServiceOnServer(service){
  var serviceData= "firstName=" + encodeURIComponent(service.firstName);
  serviceData += "&lastName=" + encodeURIComponent(service.lastName);
  serviceData += "&email=" + encodeURIComponent(service.email);
  serviceData += "&phoneNumber" + encodeURIComponent(service.phoneNumber);
  serviceData += "&price=" + encodeURIComponent(service.price);

  return fetch(`http://localhost:3000/barbers/${service.barberId}/services`,{
    method: "POST",
    body: serviceData,
    headers:{
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })

}

function getServicesFromServer(barberId){
  return fetch(`http://localhost:3000/barbers/${barberId}/services`);
}



var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    // UISTATE
    showHomeContent: true,
    showAddServiceContent: false,
    showShowAllContent: false,
    showTotalContent: false,
    // LOGIN AND REGISTER MODE
    logInMode: true,
    registerMode: false,
    //REGISTER
    // REGISTER INPUTS
    firstNameInput: "",
    lastNameInput: "",
    // userNameInput: "",
    emailInput: "",
    passwordInput: "",

    // registerSuccess?
    registerSuccess: false,
    registerInputErrorsMode: false,
    registerSuccessMessage: "",

    // REGISTER ERROR
    registerInputErrors: [],

    // LOGIN
    // LOGIN INPUTS
    logInEmailInput: "",
    logInPasswordInput: "",
    //LOGIN ERROS
    logInInputErrorsMode: false,
    logInInputErrors: [],
    // AUTHENTICATION
    authenticated: false,
    // SERVICES///////////////
    serviceFirstNameInput: "",
    serviceLastNameInput: "",
    serviceEmailInput: "",
    servicePhoneNumberInput: "",
    serviceTypeSelectedInput: null,
    // servicePrice: null,
    barberId: null,
    servicesTypes : [
      {text: "Fade", value: 25},
      {text: "Taper", value: 20},
      {text: "Normal Haircut", value: 15},
      {text: "Shave", value: 10},
      {text: "Beard Trim", value: 15}
    ],
    //SERVICES INPUT ERRORS
    addServiceInputErrorsMode: false,
    addServiceInputErrors: [],

    //SHOW SERVICES
    servicesArray: []


  },
  methods: {
    contentHome: function() {
      console.log("contenthome clicked");
      this.showHomeContent = true;
      this.showAddServiceContent = false;
      this.showShowAllContent = false;
      this.showTotalContent = false;
    },
    contentAddService: function() {
      console.log("contentAddService clicked");

      if (!this.authenticated){
        alert("Please sign in");
        return;
      }

      this.showHomeContent = false;
      this.showAddServiceContent = true;
      this.showShowAllContent = false;
      this.showTotalContent = false;
    },
    // content show all methods
    loadServices: function(){
      getServicesFromServer(this.barberId).then((response)=>{
        response.json().then((data)=>{
          console.log("Services loaded from servers",data);
          this.servicesArray = data;
        })
      })
    },
    contentShowAll: function() {
      if (!this.authenticated){
        alert("Please sign in");
        return;
      }
      this.showHomeContent = false;
      this.showAddServiceContent = false;
      this.showShowAllContent = true;
      this.showTotalContent = false;

      //LOAD ALL THE SERVICES FOR THE PARTICULAR Barber
      this.loadServices();

    },
    contentTotal: function() {
      if (!this.authenticated){
        alert("Please sign in");
        return;
      }
      this.showHomeContent = false;
      this.showAddServiceContent = false;
      this.showShowAllContent = false;
      this.showTotalContent = true;

    },
    // SESSION state
    signOut: function(){
      this.authenticated = false;
      this.contentHome();
    },
    // LOGIN AND REGISTER MODE CHANGE
    logInModeOn: function() {
      this.logInMode = true;
      this.registerMode = false;
    },
    registerModeOn: function() {
      this.registerInputErrorsMode = false;
      this.registerSuccess = false;
      this.logInMode = false;
      this.registerMode = true;
      //CLEARING ALL INPUTS
      this.firstNameInput = "";
      this.lastNameInput = "";
      // this.userNameInput = "";
      this.emailInput = "";
      this.passwordInput = "";
    },
    // LOGIN AND REGISTER METHODS
    // REGISTER BARBER

    validateRegisterBarberInputs: function() {
      this.registerInputErrors = [];

      if (this.firstNameInput.length == 0) {
        this.registerInputErrors.push("Please enter Name")
      }
      if (this.lastNameInput.length == 0) {
        this.registerInputErrors.push("Please enter Last Name")
      }
      // if (this.userNameInput.length == 0){
      //   this.registerInputErrors.push("Please enter User Name")
      // }
      if (this.emailInput.length == 0) {
        this.registerInputErrors.push("Please enter Email")
      }
      if (this.passwordInput.length == 0) {
        this.registerInputErrors.push("Please enter Password");
      }

      return this.registerInputErrors == 0;

    },

    registerBarber: function() {

      // VALIDATION
      var valid = this.validateRegisterBarberInputs();
      if (!valid) {
        this.registerInputErrorsMode = true;
        return;
      }

      //CREATING THE BARBER OBJECT
      var newBarber = {
        firstName: this.firstNameInput,
        lastName: this.lastNameInput,
        // userName : this.userNameInput,
        email: this.emailInput,
        password: this.passwordInput
      }
      //SENDING THE REQUEST TO THE API
      createBarberAccountOnServer(newBarber).then((response) => {
        if (response.status == 201) {
          this.registerSuccess = true;
          this.registerSuccessMessage = "Your account has been created succesfully, please log in."
          this.firstNameInput = "";
          this.lastNameInput = "";
          // this.userNameInput = "";
          this.emailInput = "";
          this.passwordInput = "";
        } else if (response.status == 409) {
          this.registerSuccess = true;
          this.registerSuccessMessage = "The email entered already exists";
          this.emailInput = "";
        } else {
          this.registerSuccess = true;
          this.registerSuccessMessage = "Error ocurred when creating account";
        }
      })
    },
    // LOGIN METHODS
    validateLogin: function() {
      this.logInInputErrors = [];
      if (this.logInEmailInput.length == 0) {
        this.logInInputErrors.push("Please enter an email");
      }
      if (this.logInPasswordInput.length == 0) {
        this.logInInputErrors.push("Please enter a password");
      }
      return this.logInInputErrors == 0;
    },
    logInBarber: function() {
      //VALIDATING THE LOGIN INPUTS
      var valid = this.validateLogin();
      if (!valid) {
        this.logInInputErrorsMode = true;
        return;
      }
      //CREATING THE BARBER OBJECT
      var newBarber = {
        email: this.logInEmailInput,
        password: this.logInPasswordInput
      }
      //SENDING THE REQUEST TO THE API
      createNewBarberAccountOnServer(newBarber).then((response) => {

        if (response.status == 201) {
          this.logInEmailInput = "";
          this.logInPasswordInput = "";
          this.authenticated = true;
          response.json().then((data)=>{
            console.log(data);
            this.barberId = data._id
          });
          this.contentAddService();
        }
        else if( response.status == 200){
          console.log(response.body);
          //LOG INTO THE USERS ACCOUNT
          this.authenticated = true;
          response.json().then((data)=>{
            console.log(data);
            this.barberId = data._id
          });
          this.contentAddService();
        }
        else if (response.status == 409) {
          // this.registerSuccess = true;
          // this.registerSuccessMessage = "The email entered already exists";
          this.logInEmailInput = "";
          this.logInPasswordInput = "";
          alert("Email already exists");
        } else {
          // this.registerSuccess = true;
          // this.registerSuccessMessage = "Error ocurred when creating account";
          console.log("Error loging in");
        }
      })


    },

    // ADD SERVICE methods
    validateAddService: function() {
      this.addServiceInputErrors = [];
      console.log(this.serviceFirstNameInput.length);
      if (this.serviceFirstNameInput.length == 0) {
        this.addServiceInputErrors.push("Please enter client's first name");
      }
      if (this.serviceLastNameInput.length == 0) {
        this.addServiceInputErrors.push("Please enter clients last name");
      }
      if (this.serviceEmailInput.length == 0) {
        this.addServiceInputErrors.push("Please enter clients Email");
      }
      if (this.servicePhoneNumberInput.length == 0) {
        this.addServiceInputErrors.push("Please enter clients phone number");
      }
      if (this.serviceTypeSelectedInput == null){
        this.addServiceInputErrors.push("Please select type of service");
      }
      return this.addServiceInputErrors == 0;
    },

    addServiceSubmitButtonAction: function() {
      var valid = this.validateAddService();
      console.log(this.addServiceInputErrors);
      if (!valid) {
        this.addServiceInputErrorsMode = true;
        return;
      }

      //create the service
      var newService = {
        barberId: this.barberId,
        firstName: this.serviceFirstNameInput,
        lastName: this.serviceLastNameInput,
        email: this.serviceEmailInput,
        phoneNumber: this.servicePhoneNumberInput,
        price: this.serviceTypeSelectedInput
      }

      createServiceOnServer(newService).then((response)=>{
        console.log(response);
      })

      this.serviceFirstNameInput = "";
      this.serviceLastNameInput = "";
      this.serviceEmailInput = "";
      this.servicePhoneNumberInput = "";
      this.serviceTypeSelectedInput = null;



    }
  }
})
