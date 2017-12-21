/*
Natural Selection Principles
----------------------------
1. Heredity: the way of passing information from parent to child.

2. Variation: for evolution to be happening, variation in the population is required.

3. Selection: 'survival of the fittest'. Not every member of the population has an equal chance of passing down its genetic information. In computing, the higher the fitness value of a member the higher the chance of passing down its traits.

Genetic Algorithm
-----------------
1. Initialize a population of N elements with random genetic material (We need enough variation)

2. Evaluate the fitness value of each element in the population (fitness function) and build a mating pool.
Example:
target: "aligator"
population: 3
element #1: "aliharit" - fitness value = 7 (70% selection probability)
element #2: "gfghjkuf" - fitness value = 1 (10% selection probability)
element #3: "hostgato" - fitness value = 4 (40% selection probability)

3. Evolution
a) Pick 2 parents. The higher the fitness value of an element the more likely the element is to be selected.
b) Create new element with crossover and mutation.
Crossover: Take half genetic information from one parent and half genetic information from the other:
alih|arit host|gato -> crossover -> alihgato (fitness value = 7)
Mutation: Mutate the child's genetic information based on a given probability:
alihgato -> mutate -> blihgato
c) Add child to the new population.

4. Replace the old population with the new population and return to Step 2.
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
        this.phrase = "";
        this.length = length;
        for (var i = 0; i < length; i++) {
            this.phrase = this.phrase + String.fromCharCode(getRandomIntInclusive(32, 128));
        }
    }
    // Getter
    get genotype() {
        return this.phrase;
    }
}

// GA class
class Population {
    constructor (size) {
        this.size = size;
        this.individuals = new Array();
        for (var i = 0; i < size; i++) {
            this.individuals[i] = new Individual(6);
        }
    }
    // Getter
    get population() {
        for (var i = 0; i < this.size; i++) {
            console.log(this.individuals[i].genotype);
        }
    }
}

// 1. Create a population of N elements, each with randomly generated genetic material
var population = new Population(100);
population.population;