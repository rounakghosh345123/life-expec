import streamlit as st
import pandas as pd
import numpy as np
import joblib

model = joblib.load('life_expectancy_model.pkl')
scaler = joblib.load('life_expectancy_scaler.pkl')
model_features = joblib.load('life_expectancy_features.pkl')

st.set_page_config(page_title="Life Expectancy Predictor", page_icon="🌍")
st.title("🌍 Global Life Expectancy Predictor")
st.write(
    "Predicts a country's life expectancy from health, economic, and education indicators. "
    "Built on real World Bank development data — the same factors global health policy "
    "analysts use to identify where investment has the most impact."
)

st.subheader("Country Indicators")

col1, col2 = st.columns(2)

with col1:
    gdp_per_capita = st.number_input("GDP per Capita (US$)", 200, 150000, 5000)
    health_expenditure = st.slider("Health Expenditure (% of GDP)", 1.0, 20.0, 6.0)
    school_enrollment = st.slider("Primary School Enrollment (% gross)", 40, 150, 95)
    population = st.number_input("Population", 100_000, 1_500_000_000, 10_000_000)

with col2:
    measles_immunization = st.slider("Measles Immunization (% of children)", 20, 100, 85)
    under5_mortality = st.slider("Under-5 Mortality (per 1,000 live births)", 1, 150, 25)
    hiv_prevalence = st.slider("HIV Prevalence (% of population 15-49)", 0.0, 15.0, 0.5)

# Apply the same transformations as training
gdp_log = np.log1p(gdp_per_capita)
population_log = np.log1p(population)

input_features = pd.DataFrame([{
    'GDPPerCapita_log': gdp_log,
    'HealthExpenditurePct': health_expenditure,
    'SchoolEnrollment': school_enrollment,
    'MeaslesImmunization': measles_immunization,
    'Under5Mortality': under5_mortality,
    'HIVPrevalence': hiv_prevalence,
    'Population_log': population_log,
}])[model_features]

scaled_input = scaler.transform(input_features)

if st.button("Predict Life Expectancy"):
    prediction = model.predict(scaled_input)[0]

    st.subheader("Prediction Result")
    st.metric("Predicted Life Expectancy", f"{prediction:.1f} years")

    if prediction >= 75:
        st.success("🟢 High life expectancy profile — strong health/economic indicators.")
    elif prediction >= 65:
        st.info("🟡 Moderate life expectancy profile.")
    else:
        st.warning("🔴 Lower life expectancy profile — indicators suggest health system challenges.")

    with st.expander("See the indicators used"):
        st.write(f"GDP per Capita: ${gdp_per_capita:,.0f}")
        st.write(f"Health Expenditure: {health_expenditure}% of GDP")
        st.write(f"Primary School Enrollment: {school_enrollment}%")
        st.write(f"Measles Immunization: {measles_immunization}%")
        st.write(f"Under-5 Mortality: {under5_mortality} per 1,000 live births")
        st.write(f"HIV Prevalence: {hiv_prevalence}%")
        st.write(f"Population: {population:,.0f}")
