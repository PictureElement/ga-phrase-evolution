"use strict";

// Getting a random integer between two values, inclusive
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

// Sleep function
function sleep (milliseconds) {
  console.log("sleep");
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

// Individual class
class Individual {
  /*
   * Constructor
   */
  constructor(length) {
    this.fitness = 0;
    this.length = length;
    this.phrase = "";
    for (let i = 0; i < this.length; i++) {
      this.phrase = this.phrase + String.fromCharCode(getRandomIntInclusive(32, 126));
    }
  }
    
  /*
   * Getters
   */ 
  getGenotype() {
    return this.phrase;
  }

  getFitness() {
    return this.fitness;
  }

  /*
   * Setters
   */ 
  setGenotype(phrase) {
    this.phrase = phrase;
  }
  
  /*
   * Methods
   */ 
  fitnessFunct(target) {
    let score = 0;
    for (let i = 0; i < this.length; i++) {
      if (this.phrase.charAt(i) === target.charAt(i)) {
        score += 1;
      }
    }
    // Fitness is a percentage
    this.fitness = score/target.length;
    // Return fitness in order to compare it with the best global fitness
    return this.fitness;
  }
}

// Population class
class Population {
  /*
   * Constuctor
   */
  constructor(size, target, mutationRate, minFitness) {
    this.target = target;
    this.size = size;
    this.individuals = [];
    this.setIndividuals = this.target.length;
    // contains phrases (strings)
    this.matePool = [];
    this.mutationRate = mutationRate;
    this.bestFitness = 0;
    this.bestPhrase = "";
    this.generationCount = 0;
    // Stopping criterion
    this.minFitness = minFitness;
  }
  
  /*
   * Getters
   */
  get getBestFitness() {
    return this.bestFitness;
  }

  get getBestPhrase() {
    return this.bestPhrase;
  }

  get getGenerationCount() {
    return this.generationCount;
  }

  get getIndividuals() {
    return this.individuals;
  }

  /*
   * Setters
   */
  set setIndividuals(length) {
    for (let i = 0; i < this.size; i++) {
      this.individuals.push(new Individual(length));
    }
  }

  /*
  addIndividual(newIndividual) {
    this.individuals.push(newIndividual);
  }
  */

  /*
   * Methods
   */
  clearMatePool () {
    this.matePool = [];
  }
  
  evaluate() {
    let fitness = 0;
    for (let i = 0; i < this.size; i++) {
      fitness = this.individuals[i].fitnessFunct(this.target);
      // Update best fitness and best phrase
      if (fitness > this.bestFitness) {
        this.bestFitness = fitness;
        this.bestPhrase = this.individuals[i].getGenotype();
      }
    }
    // Stopping criterion
    if (this.bestFitness < this.minFitness) {
      // continue
      return true;
    }
    else {
      // stop
      return false;
    }
  }

  buildMatePool() {
    for (let i = 0; i < this.size; i++) {
      let n = Math.round(this.individuals[i].getFitness() * 100);
      for (let j = 0; j < n; j++) {
        this.matePool.push(this.individuals[i].phrase);
      }
    }
  }
  
  reproduce() {
    // Create new generation
    for (let i = 0; i < this.size; i++) {
      // Pick 2 parents
      let a, b, child, midpoint;
      while (true) {
        // Index of parentA
        a = getRandomIntInclusive(0, this.matePool.length - 1);
        // Index of parentB
        b = getRandomIntInclusive(0, this.matePool.length - 1);
        // Be sure you have picked two unique parents (phrases)
        if (this.matePool[a] === this.matePool[b]) {
          continue;
        }
        else {
          break;
        }
      }
      // Crossover
      child = this.crossover(a, b);
      // Mutation
      this.mutation(child);
      // The new children define the population
      this.individuals[i] = child;
    }
    this.generationCount += 1;
  }
  
  crossover(a, b) {
    let child = new Individual(this.target.length);
    child.setGenotype("");
    let midpoint = getRandomIntInclusive(0, this.target.length-1);
    
    for (let i = 0; i < this.target.length; i++) {
      if (i < midpoint) {
        child.phrase = child.phrase + this.matePool[a].charAt(i);
      }
      else {
        child.phrase = child.phrase + this.matePool[b].charAt(i);
      }
    }
    return child;
  }

  mutation(individual) {
    for (let i = 0; i < this.target.length; i++) {
      // The block inside the conditional statement would be executed (mutationRate)% of the time.
      if((Math.random() * 100) < this.mutationRate) {
        // replace char with a new random character
        individual.phrase = individual.phrase.substr(0, i) + String.fromCharCode(getRandomIntInclusive(32, 126)) + individual.phrase.substr(i + 1);
      }
    }
  }

  print() {
    let phrases = [];
    for (let i = 0; i < this.size; i++) {
      phrases.push(this.individuals[i].phrase);
    }
    return phrases;
  }
}