# Global Life Expectancy Prediction

An end-to-end machine learning project that estimates a country's life expectancy from health, economic, education, and population indicators sourced from the [World Bank World Development Indicators](https://databank.worldbank.org/source/world-development-indicators).

The project now includes two user-facing dashboards:

| Dashboard | Description | Link |
|---|---|---|
| **Streamlit model dashboard** | Python-backed dashboard using the serialized XGBoost model, scaler, and feature list | [Open Streamlit dashboard](https://life-expectancy-prediction-rvqedwr5wayv4c53czw9cq.streamlit.app/) |
| **Vercel terminal dashboard** | Browser-native futuristic interface built with only HTML, CSS, and JavaScript | [Open Vercel dashboard](https://life-expectancy-prediction-main.vercel.app/) |

## Project Overview

Understanding which development factors influence life expectancy can help researchers, policymakers, and global health organizations identify where health-system investment may have the greatest impact. This project:

- Builds a country-year dataset from official World Bank indicators.
- Cleans missing values and reshapes the original wide-format export.
- Applies log transformations to heavily skewed GDP and population features.
- Compares Linear Regression, Random Forest, and tuned XGBoost models.
- Uses feature importance and residual analysis to support interpretation.
- Provides both a Python application and a static browser application.

The model is an analytical estimate. It is not a medical diagnosis, an official forecast, or a substitute for policy analysis.

## Indicators

The prediction uses seven input indicators:

1. GDP per capita
2. Health expenditure as a percentage of GDP
3. Primary school enrollment
4. Measles immunization coverage
5. Under-5 mortality per 1,000 live births
6. HIV prevalence among people aged 15–49
7. Population

GDP per capita and population are transformed with `log1p` before scaling:

```text
GDPPerCapita_log = log1p(GDP per capita)
Population_log = log1p(Population)
```

## Model Results

| Model | R² | MAE | RMSE |
|---|---:|---:|---:|
| Linear Regression | 0.906 | 1.84 years | 2.49 years |
| Random Forest | 0.982 | 0.64 years | 1.10 years |
| Tuned XGBoost | **0.979** | **0.63 years** | **1.18 years** |

The tuned XGBoost model is used by the Streamlit dashboard. The most influential feature is under-5 mortality, followed by HIV prevalence and log-transformed GDP per capita.

## Dashboards

### 1. Streamlit dashboard

The original dashboard is a Python application that loads:

- `life_expectancy_model.pkl`
- `life_expectancy_scaler.pkl`
- `life_expectancy_features.pkl`

It applies the same feature engineering and preprocessing used during training, sends the values through the serialized model, and displays the predicted life expectancy with a high, moderate, or low profile classification.

**Live link:** [life-expectancy-prediction-rvqedwr5wayv4c53czw9cq.streamlit.app](https://life-expectancy-prediction-rvqedwr5wayv4c53czw9cq.streamlit.app/)

### 2. Vercel terminal dashboard

The new dashboard is a static, browser-native interface designed for fast deployment and a more immersive terminal-style experience. It uses:

- `index.html` for the interface
- `styles.css` for the futuristic responsive design
- `app.js` for live controls, profile classification, meters, and client-side interaction

It does not require Streamlit, Python, React, or a backend server.

Because browsers cannot directly execute the supplied Python/XGBoost pickle, the static dashboard contains a lightweight client-side scoring layer calibrated to the project's reference profiles. The Python-backed Streamlit dashboard remains the authoritative serialized-model implementation.

**Live link:** [life-expectancy-prediction-main.vercel.app](https://life-expectancy-prediction-main.vercel.app/)

## Repository Structure

```text
.
├── index.html                         # Static Vercel dashboard
├── styles.css                         # Dashboard styling
├── app.js                             # Browser interaction and scoring
├── app.py                              # Streamlit dashboard
├── life_expectancy_model.pkl          # Trained XGBoost model
├── life_expectancy_scaler.pkl         # Feature scaler
├── life_expectancy_features.pkl       # Ordered model feature names
├── life_expectancy_project.ipynb      # Data preparation, EDA, and modelling
├── data/worldbank_data.csv            # World Bank source data
├── vercel.json                         # Static Vercel deployment config
├── requirements.txt                    # Python dependencies
└── runtime.txt                         # Python runtime version
```

## Run Locally

### Static dashboard

No installation is required. Open `index.html` directly in a browser:

```bash
start index.html
```

Or serve the folder with any static file server:

```bash
npx serve .
```

### Streamlit dashboard

```bash
conda create -n lifeexp python=3.10 -y
conda activate lifeexp
pip install -r requirements.txt
streamlit run app.py
```

### Notebook

```bash
jupyter notebook life_expectancy_project.ipynb
```

## Data and Analysis

The dataset was assembled from official World Bank DataBank exports rather than a pre-cleaned Kaggle mirror. The notebook covers:

1. World Bank data acquisition
2. Wide-to-long reshaping
3. Missing-value handling using year-specific medians
4. Exploratory data analysis
5. Feature engineering
6. Model comparison and tuning
7. Feature importance analysis
8. Predicted-versus-actual residual analysis

The included visualizations show the life expectancy distribution, feature relationships, correlations, feature importance, and predicted-versus-actual performance.

## Tech Stack

**Machine learning:** Python, pandas, NumPy, scikit-learn, XGBoost, joblib  
**Original dashboard:** Streamlit  
**Static dashboard:** HTML, CSS, vanilla JavaScript  
**Deployment:** Streamlit Community Cloud and Vercel  
**Data source:** World Bank Open Data

## License and Attribution

The data is sourced from the World Bank World Development Indicators. Please review the applicable World Bank data terms before redistributing derived datasets or using the project for production policy decisions.
