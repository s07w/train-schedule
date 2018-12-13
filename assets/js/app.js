// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDlkscqcZ_xjjO5TizfXNgtb2_Lhy0hzMU",
    authDomain: "trainschedule-f588c.firebaseapp.com",
    databaseURL: "https://trainschedule-f588c.firebaseio.com",
    projectId: "trainschedule-f588c",
    storageBucket: "trainschedule-f588c.appspot.com",
    messagingSenderId: "548876654302"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  
  //user input
  $("#addTrainBtn").on("click", function() {
      var trainName = $("#trainName").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = moment($("#time").val().trim(), "HH:mm").format("HH:mm");
      var frequency = $("#frequency").val().trim();
      //create local temp object to hold data
      var newTrain = {
          name: trainName,
          place: destination,
          ftrain: firstTrain,
          frequency: frequency
      }
      database.ref().push(newTrain);
      console.log(newTrain.name);
      //clear text boxes
      $("#trainName").val("");
      $("#destination").val("");
      $("#time").val("");
      $("#frequency").val("");

      return false;
  });

  //event listener for adding trains to firebase and a row in the html 
  database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());

      var trainName = childSnapshot.val().name;
      var destination = childSnapshot.val().place;
      var firstTrain = childSnapshot.val().ftrain;
      var frequency = childSnapshot.val().frequency;

      //first Train pushed back to make sure it comes before current time
      var firstTimeConv = moment(firstTrain, "HH:mm").subtract(1, "years");

      var currentTime = moment().format("HH:mm");
        console.log("Current time: " + currentTime);
      var timeDiff = moment().diff(moment(firstTimeConv), "minutes");
      var timeRemainder = timeDiff % frequency;
      var minToTrain = frequency - timeRemainder;
      var nextTrain = moment().add(minToTrain, "minutes").format("HH:mm");

      $("#trainsTable > tbody").append(
          "<tr>" +
          "<td>" + trainName + "</td>"+
          "<td>" + destination + "</td>" +
          "<td>" + nextTrain + "</td>" +
          "<td>" + frequency + "</td>" + 
          "<td>" + minToTrain + "</td>"+
          "</tr>");

  });
