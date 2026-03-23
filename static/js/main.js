// inicjalizacja ikon Lucide przy załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }

    // easter egg hihi
    const playlist = [
        "/static/music/boy_with_luv.mp3",
        "/static/music/mikrokosmos.mp3",
        "/static/music/make_it_right.mp3",
        "/static/music/home.mp3",
        "/static/music/jamais_vu.mp3",
        "/static/music/so_what.mp3",
        "/static/music/zero_oclock.mp3",
        "/static/music/the_truth_untold.mp3",
        "/static/music/love.mp3", 
        "/static/music/euphoria.mp3",
        "/static/music/black_swan.mp3",
        "/static/music/spring_day.mp3",
        "/static/music/save_me.mp3",
        "/static/music/friends.mp3",
        "/static/music/i_need_u.mp3"
    ];
    let currentTrackIndex = 0;
    let globalHistory = []; 

    const audio = document.getElementById('easter-egg-music');
    const eggBtn = document.getElementById('egg-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    const loadTrack = (index) => {
        if (audio) audio.src = playlist[index];
    };

    loadTrack(currentTrackIndex);

    const togglePlay = () => {
        if (!audio) return;
        if (audio.paused) {
            audio.play().catch(e => console.log("Kliknij ikonę, by włączyć audio"));
            eggBtn?.classList.add('animate-bounce');
        } else {
            audio.pause();
            eggBtn?.classList.remove('animate-bounce');
        }
    };

    const changeTrack = (direction) => {
        if (!audio) return;
        currentTrackIndex = (currentTrackIndex + direction + playlist.length) % playlist.length;
        const wasPlaying = !audio.paused;
        loadTrack(currentTrackIndex);
        if (wasPlaying) audio.play();
    };

    eggBtn?.addEventListener('click', togglePlay);
    nextBtn?.addEventListener('click', () => changeTrack(1));
    prevBtn?.addEventListener('click', () => changeTrack(-1));

    if (audio) {
        audio.onended = () => changeTrack(1);
    }

    // obsługa pól dynamicznych
    function setupDynamicInputs() {
        const functionSelect = document.getElementById('function-select');
        const numVarsInput = document.querySelector('input[name="numVariables"]');
        const rangeFromInput = document.querySelector('input[name="rangeFrom"]');
        const rangeToInput = document.querySelector('input[name="rangeTo"]');

        const functionConfigs = {
            'hypersphere': {vars: null, range: [-5.0, 5.0]},
            'hyperellipsoid': {vars: null, range: [-65.536, 65.536]},
            'schwefel': {vars: null, range: [-500, 500]},
            'ackley': {vars: null, range: [-32.768, 32.768]},
            'michalewicz': {vars: null, range: [0, Math.PI]},
            'rastrigin': {vars: null, range: [-5.12, 5.12]},
            'rosenbrock': {vars: null, range: [-2.048, 2.048]},
            'dejong3': {vars: null, range: [-5.12, 5.12]},
            'dejong5': {vars: 2, range: [-65.536, 65.536]},
            'martin': {vars: 2, range: [-20, 20]},
            'griewank': {vars: null, range: [-600, 600]},
            'easom': {vars: 2, range: [-100, 100]},
            'goldstein': {vars: 2, range: [-2, 2]},
            'picheny': {vars: 2, range: [-2, 2]},
            'styblinski': {vars: null, range: [-5, 5]},
            'cormick': {vars: 2, range: [-1.5, 4]},
            'rana': {vars: null, range: [-512, 512]},
            'egg': {vars: null, range: [-512, 512]},
            'keane': {vars: null, range: [0, 10]},
            'schaffer': {vars: 2, range: [-100, 100]},
            'himmel': {vars: 2, range: [-5, 5]},
            'pits': {vars: 2, range: [0, 1]}
        };

        const updateVars = (funcName) => {
            const config = functionConfigs[funcName];
            if (config) {
                if (rangeFromInput) rangeFromInput.value = config.range[0];
                if (rangeToInput) rangeToInput.value = config.range[1];

                if (numVarsInput) {
                    if (config.vars === 2) {
                        numVarsInput.value = 2;
                        numVarsInput.readOnly = true;
                        numVarsInput.classList.add('bg-gray-100', 'cursor-not-allowed', 'opacity-60');
                    } else {
                        numVarsInput.readOnly = false;
                        numVarsInput.classList.remove('bg-gray-100', 'cursor-not-allowed', 'opacity-60');
                    }
                }
            }
        };

        functionSelect?.addEventListener('change', (e) => updateVars(e.target.value));
        if (functionSelect) updateVars(functionSelect.value);

        // selekcja, krzyżowanie, mutacja
        const selEl = document.querySelector('select[name="selection"]');
        const updateSelection = () => {
            const val = selEl?.value;
            document.getElementById('tournament-params')?.classList.toggle('hidden', val !== 'tournament');
            document.getElementById('best-params')?.classList.toggle('hidden', val !== 'best');
        };
        selEl?.addEventListener('change', updateSelection);

        const crossEl = document.querySelector('select[name="crossover"]');
        const updateCrossover = () => {
            document.getElementById('uniform-params')?.classList.toggle('hidden', crossEl?.value !== 'uniform');
        };
        crossEl?.addEventListener('change', updateCrossover);

        const mutEl = document.querySelector('select[name="mutation"]');
        const updateMutation = () => {
            document.getElementById('bit-flip-params')?.classList.toggle('hidden', mutEl?.value !== 'bit_flip');
        };
        mutEl?.addEventListener('change', updateMutation);

        // elita i inwersja
        const eliteToggle = document.getElementById('elite-toggle');
        const updateElite = () => document.getElementById('elite-params')?.classList.toggle('hidden', !eliteToggle?.checked);
        eliteToggle?.addEventListener('change', updateElite);

        const invToggle = document.getElementById('inversion-toggle');
        const updateInversion = () => document.getElementById('inversion-params')?.classList.toggle('hidden', !invToggle?.checked);
        invToggle?.addEventListener('change', updateInversion);

        // wywołania początkowe
        updateSelection(); updateCrossover(); updateMutation(); updateElite(); updateInversion();
    }

    // renderowanie wykresu
    function renderChart(history) {
        const placeholder = document.getElementById('chart-placeholder');
        const plotDiv = document.getElementById('fitnessPlot');
        if (placeholder) placeholder.style.display = 'none';
        if (plotDiv) plotDiv.classList.remove('hidden');

        const traces = [
            { x: history.map(d => d.epoch), y: history.map(d => d.bestFitness), name: 'Najlepsze', line: { color: '#3b82f6', width: 4 }, type: 'scatter', mode: 'lines' },
            { x: history.map(d => d.epoch), y: history.map(d => d.averageFitness), name: 'Średnie', line: { color: '#ec4899', width: 2.5 }, type: 'scatter', mode: 'lines' }
        ];

        const layout = {
            height: 480, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(255,255,255,0.05)',
            margin: { t: 30, r: 30, l: 60, b: 60 }, hovermode: 'x unified',
            xaxis: { title: 'Epoka' }, yaxis: { title: 'Przystosowanie', tickformat: '.4f' }
        };

        Plotly.newPlot('fitnessPlot', traces, layout, { responsive: true, displaylogo: false });
    }

    // renderowanie tabeli wyników
    function renderTable(individual) {
        const section = document.getElementById('results-section');
        const body = document.getElementById('results-table-body');
        const fitnessVal = document.getElementById('final-fitness');

        if (!section || !body) return;
        section.classList.remove('hidden');
        body.innerHTML = '';
        fitnessVal.innerText = individual.final_fitness?.toFixed(8) || "0.000000";

        individual.variables.forEach((v, idx) => {
            const row = document.createElement('tr');
            row.className = "border-b border-white/10 hover:bg-white/5 transition-colors";
            row.innerHTML = `
                <td class="p-4 font-semibold text-gray-700 w-20">x${idx + 1}</td>
                <td class="p-4"><div class="bg-slate-900/5 p-3 rounded-xl font-mono text-blue-600 text-sm break-all">${v.binary}</div></td>
                <td class="p-4 text-right font-mono text-gray-800 font-bold w-32">${v.real.toFixed(6)}</td>
            `;
            body.appendChild(row);
        });
    }

    // obsługa formularza
    const configForm = document.getElementById('configForm');
    if (configForm) {
        configForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const btnText = document.getElementById('btnText');
            
            btn.disabled = true;
            const originalText = btnText.innerText;
            btnText.innerText = "Obliczanie...";

            const formData = new FormData(e.target);
            const raw = Object.fromEntries(formData.entries());
            
            const payload = {
                "objective_function": raw.objectiveFunction,
                "main_arguments": {
                    "population_size": parseInt(raw.populationSize),
                    "number_of_generations": parseInt(raw.numEpochs),
                    "bounds": [parseFloat(raw.rangeFrom), parseFloat(raw.rangeTo)],
                    "bits_per_variable": parseInt(raw.precision),
                    "number_of_variables": parseInt(raw.numVariables),
                    "elitism_size": formData.has('eliteStrategy') ? parseInt(raw.eliteSize || 2) : 0,
                    "inversion_probability": formData.has('inversion') ? 0.1 : 0.0,
                    "max_segment_ratio": parseFloat(raw.maxSegmentRatio || 0.2)
                },
                "selection_arguments": {
                    "selection_method": raw.selection,
                    "tournament_size": parseInt(raw.tournamentSize || 3),
                    "best_percentage": parseFloat(raw.bestPercentage || 0.1)
                },
                "mutation_arguments": {
                    "mutation_method": raw.mutation,
                    "mutation_probability": parseFloat(raw.mutationProb || 0.05),
                    "bit_mutation_rate": parseFloat(raw.bitMutationProb || 0.01)
                },
                "crossover_method": raw.crossover,
                "crossover_probability": parseFloat(raw.crossoverProb || 0.8),
                "uniform_crossover_rate": parseFloat(raw.geneExchangeProb || 0.5)
            };

            try {
                const res = await fetch('/run_algorithm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data.error || "Błąd serwera");

                globalHistory = data.history;
                renderChart(data.history);
                renderTable(data.best_individual);
                document.getElementById('calc-time').innerText = `${data.execution_time || 0}s`;
                document.getElementById('download-csv-btn').disabled = false;
            } catch (err) {
                alert(`Błąd: ${err.message}`);
            } finally {
                btn.disabled = false;
                btnText.innerText = originalText;
            }
        });
    }

    // eksport do csv
    document.getElementById('download-csv-btn')?.addEventListener('click', () => {
        if (globalHistory.length === 0) return;

        // nazwa funkcji
        const functionSelect = document.getElementById('function-select');
        const functionName = functionSelect ? functionSelect.value : 'wyniki';

        // data
        const now = new Date();
        const dateStr = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}`;

        const headers = 'Epoch,Best Fitness,Average Fitness,Worst Fitness\n';
        const rows = globalHistory.map(h => `${h.epoch},${h.bestFitness},${h.averageFitness},${h.worstFitness}`).join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${functionName}_${dateStr}.csv`;
        
        a.click();
        window.URL.revokeObjectURL(url);
    });

    // dynamiczne pola
    setupDynamicInputs(); 
});