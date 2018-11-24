// Respond to the message
onmessage = function(e) {
  importScripts('population.js');

  console.log('Message received from main script');

  var size = e.data[0];
  var mutationRate = e.data[1];
  var minFitness = e.data[2];
  var target = e.data[3];

  // Initialize population 
  var population = new Population(size, target, mutationRate, minFitness);
  
  var currentGenerationDetails = {};

  while (population.evaluate()) {
    // Current generation details
    currentGenerationDetails.generationCount = population.getGenerationCount;
    currentGenerationDetails.bestFitness = population.getBestFitness;
    currentGenerationDetails.bestPhrase = population.getBestPhrase;
    currentGenerationDetails.individuals = population.getIndividuals;

    console.log('Posting message back to main script');
    postMessage(currentGenerationDetails);

    // Build next generation
    population.buildMatePool();
    population.reproduce();
    population.clearMatePool();
  }

  currentGenerationDetails.generationCount = population.getGenerationCount;
  currentGenerationDetails.bestFitness = population.getBestFitness;
  currentGenerationDetails.bestPhrase = population.getBestPhrase;
  currentGenerationDetails.individuals = population.getIndividuals;

  console.log('Posting message back to main script');
  postMessage(currentGenerationDetails);
} 