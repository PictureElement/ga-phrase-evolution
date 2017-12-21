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

4. Evolution
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
    constructor (length) {
        this.fitness = 0;
        this.phrase = "";
        this.length = length;
        for (var i = 0; i < length; i++) {
            this.phrase = this.phrase + String.fromCharCode(getRandomIntInclusive(32, 128)); //32-128
        }
    }
    // Getters
    getGenotype() {
        return this.phrase;
    }
    getFitness() {
        return this.fitness;
    }
    // Setters
    setGenotype(phrase) {
        this.phrase = phrase;
    }
    setFitness(target) {
        this.fitness = 0;
        for (var i = 0; i < this.length; i++) {
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
    constructor (size, target) {
        this.target = target;
        this.size = size;
        this.individuals = [];
        for (var i = 0; i < size; i++) {
            this.individuals.push(new Individual(target.length));
        }
    }
    // Method
    draw() {
        console.log("foo");
        for (var i = 0; i < this.size; i++) {
            this.individuals[i].setFitness(this.target);
        }
    }
}

// 1. Create a population of N elements, each with randomly generated genetic material.
var population = new Population(10, "marios");

/*
// Print population (genotypes)
for (var i = 0; i < population.size; i++) {
    console.log(population.individuals[i].getGenotype());
}
*/

// 2. Call the fitness function for each member of the population.
population.draw();

/*
// Print population (fitness values)
for (var i = 0; i < population.size; i++) {
    console.log(population.individuals[i].getFitness());
}
*/

// 3. Build a mating pool.
var matePool = [];

for (var i = 0; i < population.size; i++) {
    var n = Math.round(population.individuals[i].getFitness() * 100);
    for (var j = 0; j < n; j++) {
        matePool.push(population.individuals[i]);
    }
}

// 4. Evolution
