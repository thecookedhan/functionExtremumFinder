from .classes import Population
from .ga_operators import *
import random

class GeneticAlgorithm:
    def __init__(self, population_size: int, number_of_generations: int, fitness_function, bounds: list[float], number_of_variables: int, 
                 selection_method: str = "tournament", tournament_size: int = 3, best_percentage: float = 0.05, mutation_method: str = "uniform", 
                 mutation_probability: float = 0.2, uniform_mutation_rate: float = 0.01, gaussian_mutation_rate: float = 0.1, gaussian_mutation_scale: float = 1.0, crossover_method: str = "arithmetic", 
                 crossover_probability: float = 0.75, alpha_weight_for_blend_crossover: float = 0.1, beta_weight_for_blend_crossover: float = 0.1, elitism_size: int = 0):
        """ 
        Initialize genetic algorithm parameters, operators and population
        """
        self.population_size = population_size
        self.number_of_generations = number_of_generations

        self.fitness_function = fitness_function
        self.bounds = bounds
        self.number_of_variables = number_of_variables

        self.selection_method = selection_method
        self.tournament_size = tournament_size

        self.mutation_method = mutation_method
        self.mutation_probability = mutation_probability
        self.uniform_mutation_rate = uniform_mutation_rate
        self.gaussian_mutation_rate = gaussian_mutation_rate
        self.gaussian_mutation_scale = gaussian_mutation_scale

        self.crossover_method = crossover_method
        self.crossover_probability = crossover_probability
        self.alpha_weight_for_blend_crossover = alpha_weight_for_blend_crossover
        self.beta_weight_for_blend_crossover = beta_weight_for_blend_crossover

        self.best_percentage = best_percentage
        self.elitism_size = elitism_size

        self.population = Population(population_size)

        self.best_individual = None
        self.worst_individual = None
        self.median_individual = None

        self.best_fitness_history = []
        self.worst_fitness_history = []
        self.median_fitness_history = []
        self.epochs = []

    def initialize_population(self):
        """
        Create initial population with random genomes
        """
        self.population.initialize(self.number_of_variables, self.bounds)

    def evaluate_population(self):
        """
        Compute fitness function value for every individual in the population
        """
        self.population.evaluate(self.fitness_function)

    def select_parents(self): 
        """
        Select two individuals from the population using the chosen selection method
        """
        if self.selection_method == "tournament":
            parent1 = tournament_selection(self.population, self.tournament_size)
            parent2 = tournament_selection(self.population, self.tournament_size)

        elif self.selection_method == "roulette":
            parent1 = roulette_selection(self.population)
            parent2 = roulette_selection(self.population)

        elif self.selection_method == "best":
            parent1 = best_selection(self.population, self.best_percentage)
            parent2 = best_selection(self.population, self.best_percentage)

        else:
            raise ValueError("Unknown selection method")

        return parent1, parent2

    def crossover(self, parent1: Individual, parent2: Individual):
        """
        Generate new individuals using the selected crossover operator
        """
        if random.random() > self.crossover_probability:
            return parent1.copy(), parent2.copy()
    
        if self.crossover_method == "arithmetic":
            child1, child2 = arithmetic_crossover(parent1, parent2)

        elif self.crossover_method == "average":
            child = average_crossover([parent1, parent2])
            return child, child.copy()

        elif self.crossover_method == "alpha_blend":
            child1, child2 = alpha_blend_crossover(parent1, parent2, self.alpha_weight_for_blend_crossover, self.bounds)

        elif self.crossover_method == "alpha_beta_blend":
            child1, child2 = alpha_beta_blend_crossover(parent1, parent2, self.alpha_weight_for_blend_crossover, self.beta_weight_for_blend_crossover, self.bounds)

        elif self.crossover_method == "linear":
            child1, child2 = linear_crossover(parent1, parent2, self.bounds, self.fitness_function)

        else:
            raise ValueError("Unknown crossover method")
        
        return child1, child2

    def mutate(self, individual: Individual): 
        """
        Apply selected mutation operator to a single individual
        """
        if random.random() > self.mutation_probability:
            return
    
        if self.mutation_method == "uniform":
            uniform_mutation(individual, self.uniform_mutation_rate, self.bounds)

        elif self.mutation_method == "gaussian":
            gaussian_mutation(individual, self.gaussian_mutation_rate, self.gaussian_mutation_scale, self.bounds)

        else:
            raise ValueError("Unknown mutation method")

    def create_new_population(self):
        """
        Generate a new population using selection, crossover and mutation
        """
        new_population = Population(self.population_size)

        if self.elitism_size > 0:
            elites = sorted(self.population.individuals, key=lambda ind: ind.fitness)[:self.elitism_size]

            for elite in elites:
                new_population.add_individual(elite.copy())

        while len(new_population) < self.population_size:
            parent1, parent2 = self.select_parents()
            child1, child2 = self.crossover(parent1, parent2)

            self.mutate(child1)
            self.mutate(child2)

            new_population.add_individual(child1)

            if len(new_population) < self.population_size:
                new_population.add_individual(child2)

        self.population = new_population

    def run(self): 
        """
        Execute the genetic algorithm for the specified number of generations
        """
        self.initialize_population()
        self.evaluate_population()

        self.update_best_solution()
        self.update_worst_solution()
        self.update_median_solution()

        self.epochs.append(0)

        for generation in range(1, self.number_of_generations + 1):
            self.create_new_population()
            self.evaluate_population()

            self.update_best_solution()
            self.update_worst_solution()
            self.update_median_solution()

            self.epochs.append(generation)

    def update_best_solution(self): 
        """
        Track and save fitness value of the best individual found so far in the population
        """
        best_in_generation = self.population.get_best_individual()

        if self.best_individual is None:
            self.best_individual = best_in_generation.copy()

        elif best_in_generation.fitness < self.best_individual.fitness:
            self.best_individual = best_in_generation.copy()

        self.best_fitness_history.append(self.best_individual.fitness)

    def update_worst_solution(self): 
        """
        Track and save fitness value of the worst individual found so far in the population
        """
        worst_in_generation = self.population.get_worst_individual()

        if self.worst_individual is None:
            self.worst_individual = worst_in_generation.copy()

        elif worst_in_generation.fitness < self.worst_individual.fitness:
            self.worst_individual = worst_in_generation.copy()
        
        self.worst_fitness_history.append(self.worst_individual.fitness)

    def update_median_solution(self): 
        """
        Track and save fitness value of the median individual found so far in the population
        """
        median_in_generation = self.population.get_median_individual()

        if self.median_individual is None:
            self.median_individual = median_in_generation.copy()

        elif median_in_generation.fitness < self.median_individual.fitness:
            self.median_individual = median_in_generation.copy()
        
        self.median_fitness_history.append(self.median_individual.fitness)
