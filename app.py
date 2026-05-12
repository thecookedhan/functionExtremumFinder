from flask import Flask, render_template, request, jsonify
import time
import traceback
from genetic_algorithm.ga_core import GeneticAlgorithm
import benchmark_functions as bf

app = Flask(__name__)

FUNCTIONS_MAP = {
    "michalewicz": bf.Michalewicz,
    "ackley": bf.Ackley,
    "rastrigin": bf.Rastrigin,
    "griewank": bf.Griewank,
    "rana": bf.Rana,
    "egg": bf.EggHolder,
    "schaffer": bf.Schaffer2,
    "hypersphere": bf.Hypersphere,
    "hyperellipsoid": bf.Hyperellipsoid,
    "schwefel": bf.Schwefel,
    "rosenbrock": bf.Rosenbrock,
    "styblinski": bf.StyblinskiTang,
    "keane": bf.Keane,
    "dejong3": bf.DeJong3,
    "dejong5": bf.DeJong5,
    "martin": bf.MartinGaddy,
    "easom": bf.Easom,
    "goldstein": bf.GoldsteinAndPrice,
    "picheny": bf.PichenyGoldsteinAndPrice,
    "cormick": bf.McCormick,
    "himmel": bf.Himmelblau,
    "pits": bf.PitsAndHoles
}

# trasy
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run_algorithm', methods=['POST'])
def run_algorithm():
    params = request.json
    start_time = time.perf_counter()

    try:
        main_args = params.get('main_arguments', {})
        sel_args = params.get('selection_arguments', {})
        cross_args = params.get('crossover_arguments', {})
        mut_args = params.get('mutation_arguments', {})
        
        num_vars = int(main_args.get('number_of_variables') or 2)
        bounds = main_args.get('bounds', [0, 3.1415])
        pop_size = int(main_args.get('population_size', 100))
        epochs = int(main_args.get('number_of_generations', 50))
        elitism_size = int(main_args.get('elitism_size', 0))

        # Metody
        selection = sel_args.get('selection_method', 'roulette')
        crossover = cross_args.get('method', 'arithmetic')
        mutation = mut_args.get('method', 'uniform')
        
        # Prawdopodobieństwa
        cross_prob = float(cross_args.get('probability', 0.8))
        mut_prob = float(mut_args.get('individual_probability', 0.05))

        # Krzyżowanie
        alpha = float(cross_args.get('alpha', 0.5))
        beta = float(cross_args.get('beta', 0.5))

        # Mutacja
        gene_mut_prob = float(mut_args.get('gene_probability', 0.01))
        sigma = float(mut_args.get('sigma', 0.1))

        # Funkcja celu
        selected_fun_name = params.get("objective_function", "michalewicz")
        fun_class = FUNCTIONS_MAP.get(selected_fun_name, bf.Michalewicz)

        fixed_2d = ["dejong5", "martin", "easom", "goldstein", "picheny",
                    "cormick", "schaffer", "himmel", "pits"]

        if selected_fun_name in fixed_2d:
            fitness_instance = fun_class()
        else:
            fitness_instance = fun_class(n_dimensions=num_vars)

        def fitness_wrapper(x):
            return fitness_instance(x)

        ga = GeneticAlgorithm(
            population_size=pop_size,
            number_of_generations=epochs,
            fitness_function=fitness_wrapper,
            bounds=bounds,
            number_of_variables=num_vars,
            selection_method=selection,
            tournament_size=int(sel_args.get('tournament_size', 3)),
            best_percentage=float(sel_args.get('best_percentage', 0.1)),
            mutation_method=mutation,
            mutation_probability=mut_prob,
            uniform_mutation_rate=gene_mut_prob,
            gaussian_mutation_rate=0,
            gaussian_mutation_scale=0,
            crossover_method=crossover,
            crossover_probability=cross_prob,
            alpha_weight_for_blend_crossover=alpha,
            beta_weight_for_blend_crossover=beta,
            elitism_size=elitism_size   
        )

        ga.run()
        
        variables_to_front = []
        for i in range(len(ga.best_individual.genome)):
            variables_to_front.append({
                "index": i + 1,
                "real": ga.best_individual.genome[i],
            })

        history_to_front = []
        for i in range(len(ga.best_fitness_history)):
            history_to_front.append({
                "epoch": i,
                "bestFitness": ga.best_fitness_history[i],
                "medianFitness": ga.median_fitness_history[i],
                "worstFitness": ga.worst_fitness_history[i]
            })

        return jsonify({
            "success": True,
            "execution_time": round(time.perf_counter() - start_time, 4),
            "history": history_to_front,
            "best_individual": {
                "final_fitness": ga.best_individual.fitness,
                "variables": variables_to_front
            }
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)