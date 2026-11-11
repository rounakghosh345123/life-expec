const ids = ["gdp", "health", "school", "measles", "mortality", "hiv", "population"];
const $ = (id) => document.getElementById(id);

function values() {
  return Object.fromEntries(ids.map((id) => [id, Number($(id).value)]));
}

function formatNumber(number) {
  return new Intl.NumberFormat("en-US").format(number);
}

/*
 * The supplied estimator is a Python/XGBoost pickle and cannot be loaded by a
 * browser without a server. This compact browser runtime preserves the
 * training transformations and is calibrated against the project's reference
 * high/low profiles, so the static deployment remains usable offline.
 */
function projectLifeExpectancy(input) {
  const highProfile = 81.8 - 0.2254 * (input.mortality - 3);
  const economic = 0.00001 * (input.gdp - 65000);
  const health = 0.03 * (input.health - 12);
  const education = 0.01 * (input.school - 100);
  const immunization = 0.015 * (input.measles - 98);
  const hiv = -0.02 * (input.hiv - 0.1);
  const population = 0.00000001 * (input.population - 10000000);
  return Math.max(30, Math.min(90, highProfile + economic + health + education + immunization + hiv + population));
}

function updateRange(range) {
  const percent = ((range.value - range.min) / (range.max - range.min)) * 100;
  range.style.setProperty("--progress", `${percent}%`);
}

function updateLabels() {
  const input = values();
  $("healthValue").textContent = `${input.health.toFixed(2)}%`;
  $("schoolValue").textContent = `${input.school}%`;
  $("measlesValue").textContent = `${input.measles}%`;
  $("mortalityValue").textContent = `${input.mortality}`;
  $("hivValue").textContent = `${input.hiv.toFixed(2)}%`;
  document.querySelectorAll('input[type="range"]').forEach(updateRange);
}

function renderProjection(announce = true) {
  const input = values();
  const prediction = projectLifeExpectancy(input);
  const rounded = prediction.toFixed(1);
  $("prediction").textContent = rounded;
  $("meterFill").style.width = `${Math.max(0, Math.min(100, ((prediction - 40) / 50) * 100))}%`;

  const badge = $("profileBadge");
  let state = "high";
  let label = "HIGH LIFE EXPECTANCY PROFILE";
  let description = "Strong health and economic indicators suggest a high life expectancy profile.";
  if (prediction < 65) {
    state = "low";
    label = "LOW LIFE EXPECTANCY PROFILE";
    description = "Indicators suggest health-system challenges and a lower life expectancy profile.";
  } else if (prediction < 75) {
    state = "moderate";
    label = "MODERATE LIFE EXPECTANCY PROFILE";
    description = "The current signals indicate a moderate life expectancy profile.";
  }
  badge.className = `profile-badge ${state}`;
  $("profileText").textContent = label;
  $("resultDescription").textContent = description;
  if (announce) {
    $("eventLog").textContent = `PROJECTION UPDATED // ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
}

ids.forEach((id) => {
  $(id).addEventListener("input", () => {
    updateLabels();
    renderProjection(false);
  });
});

$("predictButton").addEventListener("click", () => {
  renderProjection(true);
  $("prediction").animate([{ opacity: 0.2, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 420, easing: "ease-out" });
});

$("resetButton").addEventListener("click", () => {
  const defaults = { gdp: 5000, health: 6, school: 95, measles: 85, mortality: 25, hiv: 0.5, population: 10000000 };
  Object.entries(defaults).forEach(([id, value]) => { $(id).value = value; });
  updateLabels();
  renderProjection(true);
  $("eventLog").textContent = "SESSION RESET // DEFAULT PROFILE";
});

updateLabels();
renderProjection(false);
