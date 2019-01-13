angular.module('app', ['chart.js'])
  .controller('mainController', mainController);

mainController.$inject = ['$scope','$window','$interval'];

function mainController($scope,$window,$interval){

  var clientId = 0;
  var flagForStopCountTime = false;
  var waitingTime = 0;
  //var stop = $interval(endTimeFunc, 1000);
  var stop;

  $scope.client = {
      beenServed:0,
      notBeenServed:0
  }

  $scope.dataForChartServingTime = [];
  $scope.listOfWaitingTime = [];
  $scope.listOfClients = [];
  $scope.listOfCoffees = [];
  $scope.dataListOfCoffees = [];

  $scope.howManyClientsInSim = 0;
  $scope.howManyClientsBeenServedSoFar = 0;
  $scope.howManyClientsNotBeenServedSoFar = 0;
  $scope.howManyClientsNotBeenServedSoFar = 0;
  $scope.howManyCoffeesBeenServedSoFar = 0;
  $scope.howManyCoffeesNotBeenServedSoFar = 0;

  $scope.seconds = 0;
  $scope.endTime = 0;
  $scope.setTimeOfSim = null;
  //$scope.listOfServingTime = []; to delete

  $scope.numberOfAllCoffees = 0;

  $scope.meanForAllCoffeeBeenServed = 0;
  $scope.meanForWaitingTime = 0;
  $scope.meanForServingTime = 0;

  $scope.medianForAllCoffeeBeenServed = 0;
  $scope.medianForWaitingTime = 0;
  $scope.medianForServingTime = 0;

  $scope.rangeForAllCoffeeBeenServed = 0;
  $scope.rangeForWaitingTime = 0;
  $scope.rangeForServingTime = 0;

  $scope.modeForAllCoffeeBeenServed = 0;
  $scope.modeForWaitingTime = 0;
  $scope.modeForServingTime = 0;

  $scope.standardDeviationForAllCoffeeBeenServed = 0;
  $scope.standardDeviationForWaitingTime = 0;
  $scope.standardDeviationForServingTime = 0;

  function endTimeFunc(){
    $scope.seconds++;
    if(flagForStopCountTime === true && $scope.listOfClients.length < 1){
      $interval.cancel(stop);
      $scope.endTime = $scope.seconds;
    }

    if(flagForStopCountTime === true && $scope.seconds > $scope.setTimeOfSim){
      $interval.cancel(stop);
      $interval.cancel($scope.interval);
      $scope.endTime = $scope.seconds;
      stats();
    }
  }


  $scope.initClients = function (howManyClients){
    stop = $interval(endTimeFunc, 1000);
    $scope.howManyClientsInSim = howManyClients;
    $scope.howManyClientsNotBeenServedSoFar = howManyClients;

    for(var i=0;i<howManyClients;i++){
      $scope.listOfClients.push(i);
      $scope.labelsClientId.push(i);

      var randomValue = getRandomInteger(1,8);
      $scope.listOfCoffees.push(randomValue);
      $scope.numberOfAllCoffees = $scope.numberOfAllCoffees + randomValue;
    }
    console.log("listOfCoffees ", $scope.listOfCoffees);
  }

  var stats = function(){
    $scope.meanForAllCoffeeBeenServed = mean($scope.dataListOfCoffees);
    $scope.meanForWaitingTime = mean($scope.listOfWaitingTime);
    $scope.meanForServingTime = mean($scope.dataForChartServingTime);

    $scope.medianForAllCoffeeBeenServed = median($scope.dataListOfCoffees);
    $scope.medianForWaitingTime = median($scope.listOfWaitingTime);
    $scope.medianForServingTime = median($scope.dataForChartServingTime);

    $scope.rangeForAllCoffeeBeenServed = range($scope.dataListOfCoffees);
    $scope.rangeForWaitingTime = range($scope.listOfWaitingTime);
    $scope.rangeForServingTime = range($scope.dataForChartServingTime);

    $scope.modeForAllCoffeeBeenServed = mode($scope.dataListOfCoffees);
    $scope.modeForWaitingTime = mode($scope.listOfWaitingTime);
    $scope.modeForServingTime = mode($scope.dataForChartServingTime);

    $scope.standardDeviationForAllCoffeeBeenServed = standardDeviation($scope.dataListOfCoffees);
    $scope.standardDeviationForWaitingTime = standardDeviation($scope.listOfWaitingTime);
    $scope.standardDeviationForServingTime = standardDeviation($scope.dataForChartServingTime);
  }

  $scope.deleteClient = function (){
    flagForStopCountTime = true;
    $scope.randomTime = getRandomInteger(2000,2500);

    $scope.interval = $interval( function(){
        $scope.randomTime = getRandomInteger(2000,4500);
        $scope.dataForChartServingTime.push($scope.randomTime);
        console.log(clientId,"-> Client been served in: " + $scope.randomTime + " milliseconds");
        waitingTime = waitingTime + $scope.randomTime;

        $scope.listOfWaitingTime.push(waitingTime);
        $scope.listOfClients.shift();

        $scope.howManyCoffeesBeenServedSoFar = $scope.howManyCoffeesBeenServedSoFar + $scope.listOfCoffees[0];
        $scope.dataListOfCoffees.push($scope.listOfCoffees[0]);
        $scope.listOfCoffees.shift();

        clientId++;
        $scope.howManyClientsBeenServedSoFar++;
        $scope.howManyClientsNotBeenServedSoFar--;
        $scope.howManyCoffeesNotBeenServedSoFar = $scope.numberOfAllCoffees - $scope.howManyCoffeesBeenServedSoFar;

        if($scope.listOfClients.length < 1){
          $interval.cancel($scope.interval);
          stats();
        }

    }, $scope.randomTime);
  }

  $scope.stopSim = function() {
    if (angular.isDefined($scope.interval)) {
      $interval.cancel($scope.interval);
      stats();
    }
  };

  var getRandomInteger = function (min, max){
    return Math.floor(Math.random() * (max - min)) + min;
  }

  $scope.seriesServingTimeChart = ['Series A'];
  $scope.labelsClientId = [];

  $scope.optionsServingTimeChart = {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'milliseconds'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'client id'
        }
      }]
    }
  };

  $scope.seriesWaitingTimeChart = ['Series A'];

  $scope.optionsWaitingTimeChart = {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'milliseconds'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'client id'
        }
      }]
    }
  };

  $scope.seriesNumberOfCoffeesChart = ['Series A'];

  $scope.optionsNumberOfCoffeesChart = {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'number of coffees'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'client id'
        }
      }]
    }
  };

var mean = function(numbers){
  var total = 0, i;
  for (i = 0; i < numbers.length; i += 1) {
    total += numbers[i];
  }
  return total / numbers.length;
}

var median = function (numbers) {
  var median = 0, numsLen = numbers.length;
  numbers.sort();

  if (
    numsLen % 2 === 0
  ) {
    median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
  } else {
    median = numbers[(numsLen - 1) / 2];
  }
  return median;
}

var range = function (numbers) {
  numbers.sort();
  return [numbers[0], numbers[numbers.length - 1]];
}

var mode = function (numbers) {
  var modes = [], count = [], i, number, maxIndex = 0;

  for (i = 0; i < numbers.length; i += 1) {
    number = numbers[i];
    count[number] = (count[number] || 0) + 1;
    if (count[number] > maxIndex) {
      maxIndex = count[number];
    }
  }

  for (i in count)
    if (count.hasOwnProperty(i)) {
      if (count[i] === maxIndex) {
        modes.push(Number(i));
      }
    }

  return modes;
}

  var standardDeviation = function(values){
    var avg = mean(values);

    var squareDiffs = values.map(function(value){
      var diff = value - avg;
      var sqrDiff = diff * diff;
      return sqrDiff;
    });

    var avgSquareDiff = mean(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
  }
}
