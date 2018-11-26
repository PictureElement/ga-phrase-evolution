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
  
  var generationDetails = [];

  while (population.evaluate()) {
    // Current generation details
    generationDetails.push({generationCount: population.getGenerationCount, bestFitness: population.getBestFitness, bestPhrase: population.getBestPhrase, individuals: population.getIndividuals});
    
    // Build next generation
    population.buildMatePool();
    population.reproduce();
    population.clearMatePool();
  }

  generationDetails.push({generationCount: population.getGenerationCount, bestFitness: population.getBestFitness, bestPhrase: population.getBestPhrase, individuals: population.getIndividuals});

  console.log('Posting message back to main script');
  postMessage(generationDetails);
} 