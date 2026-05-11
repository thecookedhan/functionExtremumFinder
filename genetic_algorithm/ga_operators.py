from .classes import Individual
from .classes import Population
import random

# === MUTATION ===
def uniform_mutation(individual: Individual, mutation_rate: float, bounds: list[tuple[float, float]]):
    """
    Randomly change each gene with a given mutation rate to a random value within specified bounds
    """
    for locus in range(0, len(individual)):
        if random.random() < mutation_rate:
            individual.genome[locus] = random.uniform(bounds[0], bounds[1])

def gaussian_mutation(individual: Individual, mutation_rate: float, mutation_scale: float, bounds: list[tuple[float, float]]):
    """
    Randomly change each gene with a given mutation rate by adding a random value from a Gaussian distribution, 
    ensuring that the mutated gene remains within specified bounds
    """
    for locus in range(0, len(individual)):
        if random.random() < mutation_rate:
            mutated_gene = individual.genome[locus] + random.gauss(0, mutation_scale)
            individual.genome[locus] = max(bounds[0], min(mutated_gene, bounds[1]))

# === SELECTION ===
def tournament_selection(population: Population, tournament_size: int) -> Individual: # select the best individual from a random subset of the population based on fitness
    tournament_group = random.sample(population.individuals, tournament_size)
    best_individual = min(tournament_group, key=lambda individual: individual.fitness)

    return best_individual.copy()

def best_selection(population: Population, best_percentage: float) -> Individual: # select a percentage of the best individuals from the population based on fitness
    population.sort(descending = False)
    best_individuals_start_index = int(len(population) * best_percentage)

    return random.choice(population.individuals[:best_individuals_start_index]).copy()

def roulette_selection(population: Population) -> Individual: # select an individual with probability proportional to its fitness
    min_population_fitness = min(individual.fitness for individual in population.individuals)
    shift = abs(min_population_fitness) + 1e-6

    population_fitness_sum = sum([1 / (individual.fitness + shift) for individual in population.individuals])
    random_fitness = random.uniform(0, population_fitness_sum)

    cumulative_fintess_sum = 0
    for individual in population.individuals:
        cumulative_fintess_sum += 1 / (individual.fitness + shift)
        if cumulative_fintess_sum >= random_fitness:
            return individual.copy()

# === CROSSOVER ===
def arithmetic_crossover(parent1: Individual, parent2: Individual, bounds: list[tuple[float, float]]) -> tuple[Individual, Individual]:
    """
    Create two offsprings by combining genes of a parents with alpha weight, where alpha determines a contribution of each parent to an offspring's genome
    """
    alpha = random.random()
    child1_genome = [alpha * gene1 + (1 - alpha) * gene2 for gene1, gene2 in zip(parent1.genome, parent2.genome)]
    child2_genome = [(1 - alpha) * gene1 + alpha * gene2 for gene1, gene2 in zip(parent1.genome, parent2.genome)]
        
    return Individual(child1_genome), Individual(child2_genome)

def average_crossover(parents: list[Individual]) -> Individual:
    """
    Create an offspring by averaging the genes of the parents
    """
    child_genome = [sum(gene) / len(parents) for gene in zip(*[parent.genome for parent in parents])]

    return Individual(child_genome)

def alpha_blend_crossover(parent1: Individual, parent2: Individual, alpha: float, bounds: list[tuple[float, float]]) -> tuple[Individual, Individual]:
    """
    Create two offsprings by combining genes of a parents with alpha weight, where alpha extends 
    a range of possible gene values beyond the defined one by parents' genes
    """ 
    child1_genome = [random.uniform(min(gene1, gene2) - alpha * abs(gene1 - gene2), max(gene1, gene2) + alpha * abs(gene1 - gene2)) for gene1, gene2 in zip(parent1.genome, parent2.genome)]
    child2_genome = [random.uniform(min(gene1, gene2) - alpha * abs(gene1 - gene2), max(gene1, gene2) + alpha * abs(gene1 - gene2)) for gene1, gene2 in zip(parent1.genome, parent2.genome)]

    child1_genome_after_bounds_checking = [max(bounds[0], min(gene, bounds[1])) for gene in child1_genome]
    child2_genome_after_bounds_checking = [max(bounds[0], min(gene, bounds[1])) for gene in child2_genome]

    return Individual(child1_genome_after_bounds_checking), Individual(child2_genome_after_bounds_checking)

def alpha_beta_blend_crossover(parent1: Individual, parent2: Individual, alpha: float, beta: float, bounds: list[tuple[float, float]]) -> tuple[Individual, Individual]:
    """
    Create two offspring by combining genes of a parents with alpha and beta weights, where alpha and beta extend
    a range of possible gene values beyond the defined one by parents' genes
    """
    child1_genome = [random.uniform(min(gene1, gene2) - alpha * abs(gene1 - gene2), max(gene1, gene2) + beta * abs(gene1 - gene2)) for gene1, gene2 in zip(parent1.genome, parent2.genome)]
    child2_genome = [random.uniform(min(gene1, gene2) - alpha * abs(gene1 - gene2), max(gene1, gene2) + beta * abs(gene1 - gene2)) for gene1, gene2 in zip(parent1.genome, parent2.genome)]

    child1_genome_after_bounds_checking = [max(bounds[0], min(gene, bounds[1])) for gene in child1_genome]
    child2_genome_after_bounds_checking = [max(bounds[0], min(gene, bounds[1])) for gene in child2_genome]

    return Individual(child1_genome_after_bounds_checking), Individual(child2_genome_after_bounds_checking)
