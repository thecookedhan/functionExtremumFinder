# Genetic Function Optimizer

Interaktywna aplikacja webowa do znajdowania ekstremów funkcji matematycznych z wykorzystaniem algorytmu genetycznego. Projekt pozwala konfigurować parametry ewolucji, uruchamiać obliczenia dla wybranych funkcji testowych oraz analizować wyniki na wykresach i w tabeli końcowych wartości zmiennych.

## Wymagania
- Python 3.10 lub nowszy
- ```pip```

## Instalacja i konfiguracja

### 1. Klonowanie repozytorium
```
git clone https://github.com/thecookedhan/functionExtremumFinder.git
cd functionExtremumFinder
```
### 2. Tworzenie środowiska wirtualnego (zalecane)
Dzięki temu zależności projektu nie będą kolidować z innymi bibliotekami w systemie:
```
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/MacOS
python3 -m venv venv
source venv/bin/activate
```
### 3.  Instalacja wymaganych zależności
```
pip install -r requirements.txt
```

## Uruchamianie
Aby uruchomić aplikację, należy wykonać poniższą komendę w głównym folderze:
```
python app.py
```

## Stack technologiczny

| GDZIE | CO |
| :--- | :--- |
| **Backend** | ![Python](https://img.shields.io/badge/python-3670A0.svg?style=for-the-badge&logo=python&logoColor=ffdd54) ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) |
| **Style** | ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white) |
| **Wizualizacja danych** | ![Plotly](https://img.shields.io/badge/Plotly-%233F4F75.svg?style=for-the-badge&logo=plotly&logoColor=white) |
| **Ikonki** | ![Lucide](https://img.shields.io/badge/Lucide-Icons-orange?style=for-the-badge&logo=lucide) |

## Porównanie wyników v1.0.0 do v2.0.0

W wersji `v2.0.0` algorytm został przebudowany z reprezentacji binarnej na reprezentację rzeczywistą. Dzięki temu osobniki przechowują bezpośrednio wartości zmiennych, bez konieczności kodowania ich jako ciągów bitów i późniejszego dekodowania. Zmiana **uprościła konfigurację** aplikacji, **skróciła czas** obliczeń i **poprawiła dokładność** wyników dla większości testowanych funkcji.

W związku ze zmianą reprezentacji wartości zmiennych w algorytmie pojawiły się nowe operatory dopasowane do optymalizacji ciągłej, między innymi mutacja równomierna, mutacja Gaussa oraz krzyżowania arytmetyczne, mieszające, uśredniające i liniowe.

| Funkcja | Typ algorytmu genetycznego | Czas wykonania [s] | Wartość funkcji celu | Wartości zmiennych |
| :--- | :--- | :--- | :--- | :--- |
| sphere      | binarny     | 0.108     | 3.70 × 10⁻⁷     | (0.0002, -0.0006) |
| sphere      | rzeczywisty | 0.083     | 2.02 × 10⁻¹¹    | (0.0000, 0.0000) |
| rastrigin   | binarny     | 0.109     | 5.38 × 10⁻⁶     | (-0.0002, 0.0000) |
| rastrigin   | rzeczywisty | 0.086     | 4.39 × 10⁻⁸     | (0.0000, 0.0000) |
| ackley      | binarny     | 0.113     | 1.18 × 10⁻³     | (-0.0004, -0.0001) |
| ackley      | rzeczywisty | 0.090     | 2.07 × 10⁻⁹     | (0.0000, 0.0000) |
| rosenbrock  | binarny     | 0.110     | 2.35 × 10⁻⁴     | (0.985, 0.970) |
| rosenbrock  | rzeczywisty | 0.085     | 8.08 × 10⁻¹²    | (1.000, 1.000) |
| michalewicz | binarny     | 0.107     | -1.801          | (2.203, 1.571) |
| michalewicz | rzeczywisty | 0.087     | -1.800          | (2.198, 1.576) |


## Demo

Poniżej zamieszczono przykładowe wynik działania aplikacji po uruchomieniu algorytmu w wersji `v1.0.0` oraz `v2.0.0`. W najnowszej wersji panel użytkownika został dostosowany pod algorytm rzeczywisty, tabela wyników pokazuje końcowe wartości zmiennych wprost, a tło aplikacji zostało odświeżone.

### Przykładowy wynik działania v1.0.0
<img alt="application example run for v1.0.0" src="https://github.com/user-attachments/assets/81e004c3-c4cb-4e83-82af-5b3ca9b19313" />

### Przykładowy wynik działania v2.0.0

<img alt="application example run for v2.0.0" src="run_example.png" />


