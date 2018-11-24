/*
Natural Selection Principles
----------------------------
1. Heredity: the way of passing information from parent to child.

2. Variation: for evolution to be happening, variation in the population is 
required.

3. Selection: 'survival of the fittest'. Not every member of the population has 
an equal chance of passing down its genetic information. In computing, the 
higher the fitness value of a member the higher the chance of passing down its 
traits.

Genetic Algorithm
-----------------
1. Initialize a population of N elements with random genetic material (We need 
enough variation)

2. Evaluate the fitness value of each element in the population (fitness 
function).

3. Build a mating pool.

4. Reproduction
a) Pick 2 parents. The higher the fitness value of an element the more likely 
the element is to be selected.
b) Create new element with crossover and mutation.
Crossover: Take half genetic information from one parent and half genetic 
information from the other.
Mutation: Mutate the child's genetic information based on a given probability.
c) Add child to the new population.

5. Replace the old population with the new population and return to Step 2.
*/

$('#form-input').on( "submit", function (e) {

  // Restore form element's default values
  //this.reset();

  // Any default action normally taken by the implementation will not occur
  e.preventDefault();
  // number type
  var size = Number($('#population-size').val());
  // number type
  var mutationRate = Number($('#mutation-rate').val());
  // number type
  var minFitness = Number($('#min-fitness').val());
  // string type
  var target = $('#target').val();

  // DOM elements
  var $totalGenerationsHTML = $('#total-generations');
  var $bestPhraseHTML = $('#best-phrase');
  var $bestFitnessHTML = $('#best-fitness');
  var $processingHTML = $('#processing');
    
  // Create a new worker. URI relative to the current document URI
  var myWorker = new Worker('/js/worker.js'); 

  // Post message to the worker
  myWorker.postMessage([size, mutationRate, minFitness, target]);
  console.log('Message posted to worker');

  // Respond to the message sent back from the worker
  myWorker.onmessage = function(e) {
    console.log(e.data);
  }
});