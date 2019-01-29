// User input
var size;
var mutationRate;
var minFitness;
var target;
var animationDelay;

// DOM elements
var $myForm = $('#my-form');
var $btnSubmit = $('#btn-submit');
var $totalGenerationsHTML = $('#total-generations');
var $bestPhraseHTML = $('#best-phrase');
var $bestFitnessHTML = $('#best-fitness');
var $processingHTML = $('#processing');
var $loadWrapHTML = $('#load-wrap > div');
var $l11 = $('.l-11');
var $l12 = $('.l-12');
var $l13 = $('.l-13');

// Web worker
var myWorker;

// Timer ids created by calls to setTimeout()
var timeouts = [];

// Show or Hide loading animation
function loadingAnimation(cond) {
  if (cond === true) {
    // Show loading animation
    $loadWrapHTML.addClass("load-6");
    $l11.show();
    $l12.show();
    $l13.show();
  } else {
    // Hide loading animation
    $loadWrapHTML.removeClass("load-6");
    $l11.hide();
    $l12.hide();
    $l13.hide();
  }
}

// Reset
function reset() {
  
  // Change button style
  $btnSubmit.html("Start").removeClass("btn-danger").addClass("btn-primary");
  
  // Restore form element's default values
  $myForm[0].reset();

  // Clear output
  $totalGenerationsHTML.empty();
  $bestFitnessHTML.empty();
  $bestPhraseHTML.empty();
  $processingHTML.empty();
  
  // Exit
  return;
}

// Cancel
function cancel() {
  // Change button style
  $btnSubmit.html("Reset").removeClass("btn-warning").addClass("btn-danger");

  // Hide loading animation
  loadingAnimation(false);
  
  // Terminate worker
  myWorker.terminate();

  // Clear timeouts
  for (let i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }

  // Reset timer array
  timeouts = [];
  
  // Exit
  return;
}

$myForm.on("submit", function(e) {
  // Any default action normally taken by the implementation will not occur
  e.preventDefault();
  switch ($btnSubmit.text()) {
    case "Start":
      // Change button style
      $btnSubmit.html("Cancel").removeClass("btn-primary").addClass("btn-warning");

      // Get parameters
      size = Number($('#population-size').val());
      mutationRate = Number($('#mutation-rate').val());
      minFitness = Number($('#min-fitness').val());
      target = $('#target').val();
      animationDelay = Number($('#animation-delay').val());

      // Create a new worker (URI relative to the current document URI)
      myWorker = new Worker('js/worker.js');

      // Post message to the worker
      myWorker.postMessage([size, mutationRate, minFitness, target]);
      console.log('Message posted to worker');
      
      // Show loading animation
      loadingAnimation(true);

      // Respond to the message sent back from the worker
      myWorker.onmessage = function(e) {
        console.log('Message received from worker script');

        // Terminate worker
        myWorker.terminate();
        
        var totalGenerations = e.data.length;
        var currentGeneration = 0;
        var timeoutID;

        function updateDOM(element, index) {
          // Call setTimeout and store the timer ID
          timeouts.push(setTimeout(function() {
            currentGeneration ++;
            $processingHTML.prepend("Generation " + currentGeneration + ": " + element.bestPhrase + "\n");
            $bestFitnessHTML.empty().append(element.bestFitness);
            $bestPhraseHTML.empty().append(element.bestPhrase);
            $totalGenerationsHTML.empty().append(element.generationCount);
            if (currentGeneration === totalGenerations) {
              // Hide loading animation
              loadingAnimation(false);
              
              // Change button style
              $btnSubmit.html("Reset").removeClass("btn-warning").addClass("btn-danger");
            }
          }, animationDelay * index));
        }

        // Update DOM
        e.data.forEach(function(element, index) {
          updateDOM(element, index);
        });
      }
      break;   
    case "Reset":
      reset();
      break;
    case "Cancel":
      cancel();
      break;
  }
});