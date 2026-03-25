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
        "/static/music/i_need_u.mp3",
        "/static/music/butterfly.mp3",
        "/static/music/dna.mp3",
        "/static/music/dynamite.mp3"
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
            audio.play().catch(e => console.log("kliknij ikonę, by włączyć audio"));
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

         // obsługa selekcji
        const selectionSelect = document.querySelector('select[name="selection"]');
        const updateSelection = () => {
            const val = selectionSelect?.value;
            const tournamentDiv = document.getElementById('tournament-params');
            const bestDiv = document.getElementById('best-params');
            if (tournamentDiv) tournamentDiv.classList.toggle('hidden', val !== 'tournament');
            if (bestDiv) bestDiv.classList.toggle('hidden', val !== 'best');
        };

        selectionSelect?.addEventListener('change', updateSelection);

        // obsługa krzyżowania
        const crossoverSelect = document.querySelector('select[name="crossover"]');
        const updateCrossover = () => {
            const val = crossoverSelect?.value;
            const uniformDiv = document.getElementById('uniform-params');
            if (uniformDiv) uniformDiv.classList.toggle('hidden', val !== 'uniform');

        };

        crossoverSelect?.addEventListener('change', updateCrossover);

        // obsługa mutacji
        const mutationSelect = document.querySelector('select[name="mutation"]');
        const updateMutation = () => {
            const val = mutationSelect?.value;
            const bitFlipDiv = document.getElementById('bit-flip-params');
            if (bitFlipDiv) bitFlipDiv.classList.toggle('hidden', val !== 'bit_flip');
        };

        mutationSelect?.addEventListener('change', updateMutation);

        // obsługa strategii elitarnej (pojawianie się pola pod przełącznikiem)
        const eliteToggle = document.getElementById('elite-toggle');
        const eliteParams = document.getElementById('elite-params');
        const updateElite = () => {
            if (eliteParams && eliteToggle) {
                eliteParams.classList.toggle('hidden', !eliteToggle.checked);
            }
        };

        eliteToggle?.addEventListener('change', updateElite);

        // obsługa operatora inwersji (pojawianie się pola pod przełącznikiem)
        const inversionToggle = document.getElementById('inversion-toggle');
        const inversionParams = document.getElementById('inversion-params');
        const updateInversion = () => {
            if (inversionParams && inversionToggle) {

                inversionParams.classList.toggle('hidden', !inversionToggle.checked);
            }
        };

        inversionToggle?.addEventListener('change', updateInversion);

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
            {
                x: history.map(d => d.epoch),
                y: history.map(d => d.bestFitness),
                name: 'Best',
                line: { color: '#3b82f6', width: 4, shape: 'spline' },
                type: 'scatter',
                mode: 'lines'
            },
            {
                x: history.map(d => d.epoch),
                y: history.map(d => d.medianFitness),
                name: 'Median',
                line: { color: '#ec4899', width: 2.5 },
                type: 'scatter',
                mode: 'lines'
            },
            {
                x: history.map(d => d.epoch),
                y: history.map(d => d.worstFitness),
                name: 'Worst',
                line: { color: '#633e6e', width: 1.5, dash: 'dot' },
                type: 'scatter',
                mode: 'lines',
                opacity: 0.6
            }
        ];

        const layout = {
            height: 550,
            dragmode: 'zoom', 
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(255,255,255,0.05)',
            font: { family: 'Poppins, sans-serif', color: '#4b5563', size: 14 },
            margin: { t: 40, r: 30, l: 80, b: 40 },
            hovermode: 'x unified',
            xaxis: {
                gridcolor: 'rgba(0,0,0,0.05)',
                title: { text: 'Epoch', font: { size: 14, weight: 600 }, standoff: 10 },
                zeroline: false,
                automargin: true,
                rangeslider: { 
                    visible: true, 
                    thickness: 0.07, 
                    bgcolor: 'rgba(236, 72, 153, 0.05)',
                    bordercolor: 'rgba(236, 72, 153, 0.2)',
                    borderwidth: 1
                }
            },
            yaxis: {
                gridcolor: 'rgba(0,0,0,0.05)',
                title: { text: 'Fitness value', font: { size: 14, weight: 600 }, standoff: 25 },
                zeroline: false,
                tickformat: '.2f',
                automargin: true
            },
            legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.4 },
            modebar: {
                orientation: 'h',
                bgcolor: 'transparent',
                color: '#ec4899', 
                activecolor: '#db2777'
            }
        };

        const config = {
            responsive: true,
            displaylogo: false,
            locale: 'pl',
            displayModeBar: true,
            modeBarButtonsToRemove: ['select2d', 'lasso2d', 'zoom2d', 'pan2d', 'sendDataToCloud'],
        };

        Plotly.newPlot('fitnessPlot', traces, layout, config);
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
            btnText.innerText = "Calculating...";

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

                // powrót na górę
                window.scrollTo({
                    top: 120,
                    behavior: 'smooth'
                })

                // aktualizacja wykresu
                globalHistory = data.history;
                renderChart(data.history);
                renderTable(data.best_individual);
                document.getElementById('calc-time').innerText = `${data.execution_time || 0}s`;
                document.getElementById('download-csv-btn').disabled = false;

                // konfetti :)
                if (window.confetti) {
                    const duration = 3 * 1000;      // 3 sekundy
                    const animationEnd = Date.now() + duration
                    const colors = ['#f3aad1', '#f3aaf0', '#ffdbf0', '#ffffff'];

                    (function frame() {
                        const timeLeft = animationEnd - Date.now()

                        confetti({
                            particleCount: 3,
                            angle: 60,
                            spread: 85,
                            origin: {x: 0, y: 0.8},
                            colors: colors,
                            zIndex: 9999
                        });

                        confetti({
                            particleCount: 3,
                            angle: 120,
                            spread: 85,
                            origin: {x: 1, y: 0.8},
                            colors: colors,
                            zIndex: 9999
                        });

                        if (timeLeft > 0) {
                            requestAnimationFrame(frame);
                        }
                    }());
                }

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

        // nazwa funkcji + data
        const functionSelect = document.getElementById('function-select');
        const functionName = functionSelect ? functionSelect.value : 'wyniki';
        const now = new Date();
        const dateStr = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}`;

        // parametry
        const formData = new FormData(document.getElementById('configForm'));
        const p = Object.fromEntries(formData.entries());

        // sekcja parametrów jako kom
        let csvContent = `### PARAMETRY URUCHOMIENIA ###\n`;
        csvContent += `Funkcja celu: ${functionName}\n`;
        csvContent += `Wielkość populacji: ${p.populationSize}\n`;
        csvContent += `Liczba epok: ${p.numEpochs}\n`;
        csvContent += `Zakres: [${p.rangeFrom} , ${p.rangeTo}]\n`;
        csvContent += `Precyzja (bity): ${p.precision}\n`;
        csvContent += `Liczba zmiennych: ${p.numVariables}\n`;
        csvContent += `Selekcja: ${p.selection} (param: ${p.tournamentSize || p.bestPercentage})\n`;
        csvContent += `Krzyzowanie: ${p.crossover} (p: ${p.crossoverProb})\n`;
        csvContent += `Mutacja: ${p.mutation} (p: ${p.mutationProb})\n`;
        csvContent += `Strategia elitarna: ${p.eliteStrategy ? 'TAK (rozmiar grupy elitarnej: ' + p.eliteSize + ')' : 'NIE'}\n`;
        csvContent += `Inwersja: ${p.inversion ? 'TAK (% długości ulegający inwersji: ' + p.maxSegmentRatio + ')' : 'NIE'}\n`;
        csvContent += `Czas wykonania: ${document.getElementById('calc-time').innerText}\n`;
        csvContent += `\n`; 

        // wynikowa tabela danych
        csvContent += 'Epoch;Best Fitness;Median Fitness;Worst Fitness\n';
        const rows = globalHistory.map(h => 
            `${h.epoch};${h.bestFitness};${h.medianFitness};${h.worstFitness}`
        ).join('\n');
        
        csvContent += rows;

        // plik csv
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GA_${functionName}_${dateStr}.csv`;
        
        a.click();
        window.URL.revokeObjectURL(url);
    });

    // dynamiczne pola
    setupDynamicInputs(); 

    // fab do scrolla
    const scrollBtn = document.getElementById('scroll-nav-btn');
    const scrollIcon = document.getElementById('scroll-icon');

    const updateScrollButton = () => {
        if (!scrollBtn) return;
        
        const scrollY = window.scrollY;
        const bodyHeight = document.body.offsetHeight;
        const windowHeight = window.innerHeight;

        scrollBtn.classList.remove('opacity-0', 'translate-y-10', 'invisible');
        scrollBtn.classList.add('opacity-100', 'translate-y-0', 'visible');

        // logika zmiany ikony góra/dół
        const isNearBottom = (windowHeight + scrollY) >= bodyHeight - 200;
        const currentIcon = scrollBtn.querySelector('svg, i');
        const targetIconName = isNearBottom ? 'chevron-up' : 'chevron-down';

        if (currentIcon && currentIcon.getAttribute('data-lucide') !== targetIconName) {
            scrollBtn.innerHTML = `<i data-lucide="${targetIconName}" id="scroll-icon" class="w-6 h-6"></i>`;
            if (window.lucide) lucide.createIcons();
        }
    };

    window.addEventListener('scroll', updateScrollButton);

    scrollBtn?.addEventListener('click', () => {
        const scrollY = window.scrollY;
        const bodyHeight = document.body.offsetHeight;
        const windowHeight = window.innerHeight;
        const isNearBottom = (windowHeight + scrollY) >= bodyHeight - 200;

        if (isNearBottom) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: bodyHeight, behavior: 'smooth' });
        }
    });
});