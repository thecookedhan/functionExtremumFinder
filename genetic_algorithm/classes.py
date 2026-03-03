class Individual:
    def __init__(self, genome: list[int], fitness = None):
        if not genome:
            raise ValueError("Genome cannot be empty")

        self.genome = genome
        self.fitness = fitness

    def decode(self, bounds):
        decimal_genome = int(''.join(map(str, self.genome)), 2)
        scaled_decimal_genome = bounds[0] + (decimal_genome / (2**len(self) - 1) * (bounds[1] - bounds[0]))
        return scaled_decimal_genome

    def evaluate(self, fitness_function, bounds):
        decoded_genome = self.decode(bounds)
        self.fitness = fitness_function(decoded_genome)

    def copy(self):
        return Individual(self.genome.copy(), self.fitness)

    def __len__(self):
        return len(self.genome)

    def __repr__(self):
        return f'Individual(genome = {self.genome}, fitness = {self.fitness})'
    
class Population:
    def __init__(self, individuals: list[Individual], generation: int):
        self.individuals = individuals
        self.generation = generation

    def evaluate(fitness_function):
        pass

    def get_best():
        pass

    def get_worst():
        pass

    def sort(descdending=True):
        pass

    def add(individual: Individual):
        pass

    def extend(individuals: list[Individual]):
        pass

    def size(self):
        return len(self.individuals)