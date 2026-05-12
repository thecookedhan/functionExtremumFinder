from __future__ import annotations
import random

class Individual:
    def __init__(self, genome: list[float], fitness: float | None = None):
        """
        Create new Individual as real number list that represents a solution
        """
        if not genome:
            raise ValueError("Genome cannot be empty")

        self.genome = genome
        self.fitness = fitness


    def evaluate(self, fitness_function) -> None:
        """
        Calculate fitness function value based on a solution list
        """
        self.fitness = fitness_function(self.genome)

    def copy(self) -> Individual:
        """
        Create a deep copy of an individual
        """
        return Individual(self.genome.copy(), self.fitness)

    def __len__(self) -> int:
        """
        Return length of a solution list
        """
        return len(self.genome)
    
class Population:
    def __init__(self, population_size: int, individuals: list[Individual] | None = None):
        """
        Get input population size or create population when list of individuals is given
        """
        if individuals is None:
            self.individuals = []
        else:
            if len(individuals) != population_size:
                raise ValueError("Population size does not match individuals count")
            self.individuals = individuals
        
        if population_size <= 0:
            raise ValueError("Population size must be positive")
        self.population_size = population_size

    def initialize(self, number_of_variables: int, bounds: list[float]) -> None:
        """
        Create new population filled with individuals based on given genome length and bounds
        """
        self.clear()

        for _ in range(self.population_size):
            genome = [random.uniform(bounds[0], bounds[1]) for i in range(number_of_variables)]
            self.add_individual(Individual(genome))

    def evaluate(self, fitness_function) -> None:
        """
        Calculate fitness function value based on a solution list for a whole population
        """
        for individual in self.individuals:
            individual.evaluate(fitness_function)

    def get_best_individual(self) -> Individual: 
        """
        Return the individual with the lowest fitness value (minimization problem)
        """
        return min(self.individuals, key = lambda ind: ind.fitness)
    
    def get_worst_individual(self) -> Individual: 
        """
        Return the individual with the highest fitness value (minimization problem)
        """
        return max(self.individuals, key = lambda ind: ind.fitness)
    
    def get_median_individual(self) -> Individual:
        """
        Return an individual which has an median solution in a population
        """
        sorted_population = sorted(self.individuals, key = lambda ind: ind.fitness)
        return sorted_population[len(sorted_population) // 2]

    def add_individual(self, individual: Individual):
        """
        Add a single new individual to a population
        """
        self.individuals.append(individual)

    def clear(self):
        """
        Clear population by removing all individuals from it
        """
        self.individuals = []

    def sort(self, descending: bool):
        """
        Sort population by fitness value in descending/ascending order
        """
        self.individuals.sort(key = lambda ind: ind.fitness, reverse = descending)

    def __len__(self) -> int:
        """
        Return population length, which is simply a number of individuals in a population
        """
        return len(self.individuals)