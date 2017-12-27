/*
Natural Selection Principles
----------------------------
1. Heredity: the way of passing information from parent to child.

2. Variation: for evolution to be happening, variation in the population is required.

3. Selection: 'survival of the fittest'. Not every member of the population has an equal chance of passing down its genetic information. In computing, the higher the fitness value of a member the higher the chance of passing down its traits.

Genetic Algorithm
-----------------
1. Initialize a population of N elements with random genetic material (We need enough variation)

2. Evaluate the fitness value of each element in the population (fitness function).

3. Build a mating pool.

4. Reproduction
a) Pick 2 parents. The higher the fitness value of an element the more likely the element is to be selected.
b) Create new element with crossover and mutation.
Crossover: Take half genetic information from one parent and half genetic information from the other.
Mutation: Mutate the child's genetic information based on a given probability.
c) Add child to the new population.

5. Replace the old population with the new population and return to Step 2.
*/

// Getting a random integer between two values, inclusive
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Individual class
class Individual {
    // Ctor
    constructor(length) {
        this.fitness = 0;
        this.length = length;
        this.phrase = "";
        for (let i = 0; i < this.length; i++) {
            this.phrase = this.phrase + String.fromCharCode(getRandomIntInclusive(32, 128));
        }
    }
    
    // Getter
    getGenotype() {
        return this.phrase;
    }
    // Getter
    getFitness() {
        return this.fitness;
    }
    // Setter
    setGenotype(phrase) {
        this.phrase = phrase;
    }
    
    
    
    
    
    setFitness(target) { //<----------------------------------------------- change to Fitness
        this.fitness = 0;
        for (let i = 0; i < this.length; i++) {
            if (this.phrase.charAt(i) === target.charAt(i)) {
                this.fitness += 1;
            }
        }
        // Fitness is a percentage
        this.fitness = this.fitness/target.length;
        // Return fitness in order to compare it with the best global fitness
        return this.fitness;
    }
}

// Population class
class Population {
    // Ctor
    constructor(size, target, mutationRate, minFitness) {
        this.target = target;
        this.size = size;
        this.individuals = [];
        this.matePool = [];
        this.mutationRate = mutationRate;
        this.bestFitness = 0;
        this.bestIndividualIndex = 0;
        this.totalGenerations = 0;
        // Stopping criterion
        this.minFitness = minFitness;
    }
    // Methods
    addIndividual(newIndividual) {
        this.individuals.push(newIndividual);
    }
    evaluate() {
        let fitness = 0;
        for (let i = 0; i < this.size; i++) {
            fitness = this.individuals[i].setFitness(this.target);
            // Update best fitness
            if (fitness > this.bestFitness) {
                this.bestFitness = fitness;
                this.bestIndividualIndex = i;
            }
        }
        // Stopping criterion
        if (this.bestFitness > this.minFitness) {
            return true;
        }
        else {
            return false;
        }
    }
    buildMatePool() {
        for (let i = 0; i < this.size; i++) {
            let n = Math.round(this.individuals[i].getFitness() * 100);
            for (let j = 0; j < n; j++) {
                this.matePool.push(this.individuals[i]);
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
                // Be sure you have picked two unique parents
                if (this.matePool[a].phrase === this.matePool[b].phrase) {
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
            // Overwrite the population with the new children
            this.individuals[i] = child;
        }
        
        this.totalGenerations += 1;
    }
    crossover(a, b) {
        let child = new Individual(this.target.length);
        child.setGenotype("");
        let midpoint = getRandomIntInclusive(0, this.target.length);
        
        for (let i = 0; i < this.target.length; i++) {
            if (i < midpoint) {
                child.phrase = child.phrase + this.matePool[a].phrase.charAt(i);
            }
            else {
                child.phrase = child.phrase + this.matePool[b].phrase.charAt(i);
            }
        }
        return child;
    }
    mutation(individual) {
        for (let i = 0; i < this.target.length; i++) {
            // The block inside the conditional statement would be executed 1% of the time.
            if(Math.random() < this.mutationRate) {
                // replace char with a new random character
                individual.phrase = individual.phrase.substr(0, i) + String.fromCharCode(getRandomIntInclusive(32, 128)) + individual.phrase.substr(i + 1);
            }
        }
    }
}

/*
const size = 1000;
const target = "To be, or not to be";
const length = target.length;
const mutationRate = 0.01;
const minFitness = 0.6;
*/

$('form').on( "submit", function (e) {

    var size = $('#populationSize').val();
    var mutationRate = $('#mutationRate').val();
    var minFitness = $('#minFitness').val();
    var target = $('#target').val();
    var length = target.length;
    
    //-------------------------------------------------
    
    // Create a new population 
    var population = new Population(size, target, mutationRate, minFitness);
    
    // Build population
    for (let i = 0; i < size; i++) {
        population.addIndividual(new Individual(length));
    }
    
    // Loop until you find the solution (or meet the criteria)
    while (true) {
        if(population.evaluate()) {
            break;
        }
        else {
            population.buildMatePool();
            population.reproduce();
        }
    }
    
    // Print results
    console.log("Total Generation: " + population.totalGenerations);
    console.log("Best Fitness: " + population.bestFitness);
    let index = population.bestIndividualIndex;
    console.log("Best Phrase: " + population.individuals[index].phrase);
    
    // Any default action normally taken by the implementation will not occur
    e.preventDefault();
    
    // Restore form element's default values
    this.reset();
})