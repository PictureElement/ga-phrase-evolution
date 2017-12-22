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
    // Setter
    setFitness(target) {
        this.fitness = 0;
        for (let i = 0; i < this.length; i++) {
            if (this.phrase.charAt(i) === target.charAt(i)) {
                this.fitness += 1;
            }
        }
        // Fitness is a percentage
        this.fitness = this.fitness/target.length;
    }
}

// Population class
class Population {
    // Ctor
    constructor (size, target, mutationRate) {
        this.target = target;
        this.size = size;
        this.individuals = [];
        this.matePool = [];
        this.mutationRate = mutationRate;
    }
    // Methods
    addIndividual(newIndividual) {
        this.individuals.push(newIndividual);
    }
    evaluate() {
        for (let i = 0; i < this.size; i++) {
            this.individuals[i].setFitness(this.target);
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

var population = new Population(1000, "marios", 0.01);

// Build population
for (let i = 0; i < 1000; i++) {
    population.addIndividual(new Individual(6));
}

// Loop until you find the solution
population.evaluate();
population.buildMatePool();
population.reproduce();