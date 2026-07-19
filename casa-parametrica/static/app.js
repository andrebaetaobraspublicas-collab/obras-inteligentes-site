"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const decimal = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

const states = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

let currentStep = 0;
let currentRequest = null;
let currentResult = null;
let currentSimulationId = null;
let scenarioSummaries = [];
let toastTimer = null;
let priceBaseTimer = null;
let priceBaseSequence = 0;
let programCompatibilityTimer = null;
let programCompatibilitySequence = 0;
let currentProgramCompatibility = null;
let openingTransitionTimer = null;

const sampleRequest = {
  name: "Casa térrea de 180 m²",
  location: { state: "SP", city: "Campinas", neighborhood: "", price_base_id: null },
  terrain: {
    land_area: 360,
    slope: "leve",
    soil: "desconhecido",
    access: "facil",
    soil_report: false,
    demolition_area: 0,
    retaining_wall_area: 0,
    rock: false
  },
  building: {
    built_area: 180,
    floors: 1,
    basement_area: 0,
    balconies_area: 20,
    double_height_area: 0,
    garage_spaces: 2,
    garage_covered: true,
    complexity: "regular"
  },
  program: { bedrooms: 3, suites: 1, bathrooms: 3, half_baths: 1, gourmet_area: true },
  construction: {
    system: "alvenaria_concreto",
    roof: "embutido_termoacustica",
    finish: "superior",
    flooring: "porcelanato_medio",
    windows: "aluminio_medio"
  },
  extras: {
    pool: true,
    pool_area: 18,
    landscaping_area: 80,
    solar: false,
    automation: false,
    air_conditioned_rooms: 4,
    elevator: false,
    ev_charger: false,
    rainwater_reuse: false
  },
  costs: {
    include_designs: true,
    include_indirects: true,
    include_contingency: true,
    other_investment_costs: 0,
    other_investment_description: ""
  }
};

const labelMaps = {
  kinds: {
    direct: "Direto",
    specific: "Específico",
    designs: "Projetos",
    indirect: "Indireto/BDI",
    contingency: "Contingência",
    owner: "Proprietário"
  },
  confidence: { alta: "Alta", média: "Média", baixa: "Baixa" },
  scope: { municipal: "Municipal", state: "Estadual", global: "Global" }
};

document.addEventListener("DOMContentLoaded", () => {
  bindOpeningScreen();
  populateStateSelectors();
  bindNavigation();
  bindWizard();
  bindEstimateActions();
  bindScenarioActions();
  bindAdminActions();
  bindPriceBaseActions();
  bindProgramCompatibility();
  applyRequestToForm(sampleRequest);
  showStep(0);
  togglePoolArea();
  toggleAdminPriceBaseScope();
  checkHealth();
});

function bindOpeningScreen() {
  const opening = $("#openingScreen");
  const splash = $("#openingSplash");
  const ready = $("#openingReady");
  const application = $("#applicationRoot");
  const agreement = $("#legalAgreement");
  const accept = $("#acceptLegalButton");
  const start = $("#startApplicationButton");
  const skip = $("#skipOpeningAnimation");
  const reopen = $("#openIntroButton");
  if (!opening || !application) return;

  const sessionStarted = (() => {
    try { return window.sessionStorage.getItem("casa-parametrica-started") === "1"; }
    catch { return false; }
  })();

  const setAgreementState = () => {
    const accepted = Boolean(agreement?.checked);
    if (accept) {
      accept.disabled = !accepted;
      accept.textContent = accepted ? "Concordo e quero continuar →" : "Marque a caixa para continuar";
    }
  };

  const showReady = (fromReopen = false) => {
    window.clearTimeout(openingTransitionTimer);
    splash?.classList.add("hidden");
    splash?.classList.remove("is-exiting");
    ready?.classList.remove("hidden");
    skip?.classList.add("hidden");
    if (start) start.textContent = fromReopen ? "Voltar ao sistema →" : "Iniciar nova estimativa →";
    window.setTimeout(() => start?.focus(), 60);
  };

  const enterApplication = (animated = true) => {
    try { window.sessionStorage.setItem("casa-parametrica-started", "1"); } catch { /* sessão indisponível */ }
    window.clearTimeout(openingTransitionTimer);
    const finish = () => {
      opening.classList.add("hidden");
      opening.classList.remove("is-leaving", "is-reduced");
      document.body.classList.remove("opening-active");
      application.setAttribute("aria-hidden", "false");
      $("#view-estimate h1")?.focus?.({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: animated ? "smooth" : "auto" });
    };
    if (!animated) {
      finish();
      return;
    }
    opening.classList.add("is-leaving");
    openingTransitionTimer = window.setTimeout(finish, 500);
  };

  const showOpening = (readyOnly = false) => {
    window.clearTimeout(openingTransitionTimer);
    opening.classList.remove("hidden", "is-leaving");
    document.body.classList.add("opening-active");
    application.setAttribute("aria-hidden", "true");
    if (readyOnly) {
      opening.classList.add("is-reduced");
      showReady(true);
    } else {
      opening.classList.remove("is-reduced");
      ready?.classList.add("hidden");
      splash?.classList.remove("hidden", "is-exiting");
      skip?.classList.remove("hidden");
      if (agreement) agreement.checked = false;
      setAgreementState();
      window.setTimeout(() => agreement?.focus(), 4200);
    }
  };

  agreement?.addEventListener("change", setAgreementState);
  accept?.addEventListener("click", () => {
    if (!agreement?.checked) return;
    splash?.classList.add("is-exiting");
    openingTransitionTimer = window.setTimeout(() => showReady(false), 430);
  });
  start?.addEventListener("click", () => enterApplication(true));
  skip?.addEventListener("click", () => {
    opening.classList.add("is-reduced");
    skip.classList.add("hidden");
    agreement?.focus();
  });
  reopen?.addEventListener("click", () => showOpening(true));

  setAgreementState();
  if (sessionStarted) enterApplication(false);
  else showOpening(false);
}

function populateStateSelectors() {
  ["#priceBaseState", "#baseFilterState"].forEach((selector) => {
    const element = $(selector);
    if (!element) return;
    const previous = element.value || "SP";
    element.innerHTML = states.map((state) => `<option value="${state}">${state}</option>`).join("");
    element.value = states.includes(previous) ? previous : "SP";
  });
}

function bindNavigation() {
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });
}

function switchView(viewName) {
  $$(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewName));
  $$(".view").forEach((view) => view.classList.remove("active"));
  $(`#view-${viewName}`).classList.add("active");
  if (viewName === "scenarios") loadScenarios();
  if (viewName === "admin") loadAdminData();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindWizard() {
  $("#nextButton").addEventListener("click", () => {
    if (!validateStep(currentStep)) return;
    showStep(Math.min(4, currentStep + 1));
  });
  $("#previousButton").addEventListener("click", () => showStep(Math.max(0, currentStep - 1)));
  $("#estimatorForm").addEventListener("submit", calculateEstimate);
  $("#pool").addEventListener("change", togglePoolArea);
  $$("input, select", $("#estimatorForm")).forEach((element) => {
    element.addEventListener("input", () => {
      element.classList.remove("invalid");
      $("#validationMessage").textContent = "";
      if (isProgramCompatibilityField(element)) scheduleProgramCompatibility();
    });
    element.addEventListener("change", () => {
      if (isProgramCompatibilityField(element)) scheduleProgramCompatibility(0);
    });
  });
}

function bindEstimateActions() {
  $("#loadSampleButton").addEventListener("click", () => {
    applyRequestToForm(sampleRequest);
    currentSimulationId = null;
    currentRequest = null;
    currentResult = null;
    $("#resultPanel").classList.add("hidden");
    showStep(0);
    toast("Exemplo preenchido e base de preços atualizada.", "success");
  });
  $("#resetButton").addEventListener("click", () => {
    $("#estimatorForm").reset();
    currentSimulationId = null;
    currentRequest = null;
    currentResult = null;
    $("#resultPanel").classList.add("hidden");
    showStep(0);
    togglePoolArea();
    schedulePriceBaseRefresh();
    scheduleProgramCompatibility(0);
    toast("Formulário restaurado para os valores iniciais.");
  });
  $("#saveButton").addEventListener("click", saveCurrentScenario);
  $("#pdfButton").addEventListener("click", generateCurrentPdf);
}

function bindScenarioActions() {
  $("#refreshScenariosButton").addEventListener("click", loadScenarios);
  $("#scenariosBody").addEventListener("click", handleScenarioTableAction);
  $("#compareButton").addEventListener("click", compareSelectedScenarios);
}

function bindAdminActions() {
  $("#loadParametersButton").addEventListener("click", () => loadParameters());
  $("#saveParametersButton").addEventListener("click", saveParameters);
  $("#createPriceBaseButton").addEventListener("click", createPriceBase);
  $("#loadPriceBasesButton").addEventListener("click", () => loadPriceBaseHistory());
  $("#loadParameterHistoryButton").addEventListener("click", () => loadParameterHistory());
  $("#priceBaseScope").addEventListener("change", toggleAdminPriceBaseScope);
  $("#priceBasesBody").addEventListener("click", handlePriceBaseHistoryAction);
  $("#parameterHistoryBody").addEventListener("click", handleParameterHistoryAction);
}

function bindPriceBaseActions() {
  $("#state").addEventListener("change", () => schedulePriceBaseRefresh(0));
  $("#city").addEventListener("input", () => schedulePriceBaseRefresh(450));
  $("#priceBaseId").addEventListener("change", updatePriceBaseStatus);
}

function bindProgramCompatibility() {
  $("#applyRecommendedAreaButton")?.addEventListener("click", () => {
    if (!currentProgramCompatibility) return;
    const target = Math.ceil(Number(currentProgramCompatibility.recommended_min || 0));
    if (!target) return;
    $("#builtArea").value = target;
    $("#builtArea").dispatchEvent(new Event("input", { bubbles: true }));
    toast(`Área principal ajustada para ${integer.format(target)} m², início da faixa recomendada.`, "success");
  });
}

function isProgramCompatibilityField(element) {
  return [
    "builtArea", "floors", "complexity", "bedrooms", "suites",
    "bathrooms", "halfBaths", "gourmetArea"
  ].includes(element?.id);
}

function collectProgramCompatibilityRequest() {
  return {
    built_area: num("#builtArea"),
    floors: num("#floors"),
    complexity: $("#complexity").value,
    program: {
      bedrooms: num("#bedrooms"),
      suites: num("#suites"),
      bathrooms: num("#bathrooms"),
      half_baths: num("#halfBaths"),
      gourmet_area: $("#gourmetArea").checked
    }
  };
}

function scheduleProgramCompatibility(delay = 260) {
  window.clearTimeout(programCompatibilityTimer);
  programCompatibilityTimer = window.setTimeout(refreshProgramCompatibility, delay);
}

async function refreshProgramCompatibility() {
  const payload = collectProgramCompatibilityRequest();
  const card = $("#programCompatibilityCard");
  if (!card) return;
  if (payload.built_area <= 20) {
    renderProgramCompatibilityPlaceholder("Informe uma área principal maior que 20 m² para executar a verificação.");
    return;
  }
  if (payload.program.suites > payload.program.bedrooms) {
    renderProgramCompatibilityPlaceholder("Revise o programa: o número de suítes não pode superar o número de quartos.", "incompatible");
    return;
  }

  const sequence = ++programCompatibilitySequence;
  card.classList.add("is-loading");
  $("#programFitStatus").textContent = "Analisando";
  try {
    const result = await api("/api/program-compatibility", { method: "POST", body: payload });
    if (sequence !== programCompatibilitySequence) return;
    renderProgramCompatibilityCard(result);
  } catch (error) {
    if (sequence !== programCompatibilitySequence) return;
    renderProgramCompatibilityPlaceholder(`Não foi possível verificar a compatibilidade: ${error.message}`, "incompatible");
  }
}

function renderProgramCompatibilityPlaceholder(message, status = "loading") {
  currentProgramCompatibility = null;
  const card = $("#programCompatibilityCard");
  if (!card) return;
  card.dataset.status = status;
  card.classList.remove("is-loading");
  $("#programFitStatus").textContent = status === "incompatible" ? "Revisar dados" : "Aguardando";
  $("#programFitMessage").textContent = message;
  ["#programFitMainArea", "#programFitMinimum", "#programFitRecommended", "#programFitScore"].forEach((selector) => { $(selector).textContent = "—"; });
  $("#programFitSuggestions").innerHTML = "";
  $("#programFitDisclaimer").textContent = "Faixa orientativa; não substitui estudo arquitetônico.";
  $("#applyRecommendedAreaButton").classList.add("hidden");
  $("#programFitRange").style.cssText = "left:48%;width:29%";
  $("#programFitMarker").style.left = "0%";
  $("#programFitScaleMax").textContent = "— m²";
}

function renderProgramCompatibilityCard(result) {
  currentProgramCompatibility = result;
  const card = $("#programCompatibilityCard");
  card.dataset.status = result.status;
  card.classList.remove("is-loading");
  $("#programFitStatus").textContent = result.label;
  $("#programFitMessage").textContent = result.message;
  $("#programFitMainArea").textContent = `${decimal.format(result.main_area)} m²`;
  $("#programFitMinimum").textContent = `${decimal.format(result.minimum_area)} m²`;
  $("#programFitRecommended").textContent = `${decimal.format(result.recommended_min)}–${decimal.format(result.recommended_max)} m²`;
  $("#programFitScore").textContent = `${integer.format(result.score)}/100`;
  $("#programFitSuggestions").innerHTML = (result.suggestions || []).slice(0, 3).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  $("#programFitDisclaimer").textContent = result.disclaimer;

  const apply = $("#applyRecommendedAreaButton");
  const canApply = ["incompatible", "tight"].includes(result.status);
  apply.classList.toggle("hidden", !canApply);
  apply.textContent = `Usar ${integer.format(Math.ceil(result.recommended_min))} m²`;

  const scaleMax = Math.max(50, Number(result.recommended_max) * 1.35, Number(result.main_area) * 1.12);
  const rangeLeft = Math.max(0, Math.min(97, Number(result.recommended_min) / scaleMax * 100));
  const rangeRight = Math.max(rangeLeft + 1, Math.min(100, Number(result.recommended_max) / scaleMax * 100));
  const markerLeft = Math.max(1, Math.min(99, Number(result.main_area) / scaleMax * 100));
  $("#programFitRange").style.left = `${rangeLeft.toFixed(1)}%`;
  $("#programFitRange").style.width = `${Math.max(2, rangeRight - rangeLeft).toFixed(1)}%`;
  $("#programFitMarker").style.left = `${markerLeft.toFixed(1)}%`;
  $("#programFitScaleMax").textContent = `${integer.format(Math.ceil(scaleMax / 10) * 10)} m²`;
}

function renderProgramCompatibilityResult(result) {
  const panel = $("#programCompatibilityResult");
  if (!panel) return;
  if (!result) {
    panel.dataset.status = "loading";
    $("#resultProgramFitStatus").textContent = "Indisponível";
    $("#resultProgramFitMessage").textContent = "Este cenário foi salvo antes da inclusão da análise de compatibilidade.";
    ["#resultProgramMainArea", "#resultProgramMinimum", "#resultProgramRecommended", "#resultProgramScore"].forEach((selector) => { $(selector).textContent = "—"; });
    $("#resultProgramSuggestions").innerHTML = "<li>Recalcule o cenário para gerar a análise atualizada.</li>";
    $("#resultProgramDisclaimer").textContent = "";
    $("#resultProgramComponents").innerHTML = '<tr><td colspan="3">Sem memória paramétrica disponível.</td></tr>';
    return;
  }
  panel.dataset.status = result.status;
  $("#resultProgramFitStatus").textContent = result.label;
  $("#resultProgramFitMessage").textContent = result.message;
  $("#resultProgramMainArea").textContent = `${decimal.format(result.main_area)} m²`;
  $("#resultProgramMinimum").textContent = `${decimal.format(result.minimum_area)} m²`;
  $("#resultProgramRecommended").textContent = `${decimal.format(result.recommended_min)}–${decimal.format(result.recommended_max)} m²`;
  $("#resultProgramScore").textContent = `${integer.format(result.score)}/100`;
  $("#resultProgramSuggestions").innerHTML = (result.suggestions || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>Sem recomendações adicionais.</li>";
  $("#resultProgramDisclaimer").textContent = `${result.disclaimer} Método: ${result.method_version}.`;
  $("#resultProgramComponents").innerHTML = (result.components || []).map((item) => `<tr><td>${escapeHtml(item.label)}</td><td>${decimal.format(item.area)} m²</td><td>${escapeHtml(item.basis)}</td></tr>`).join("") || '<tr><td colspan="3">Sem componentes disponíveis.</td></tr>';
}

function showStep(step) {
  currentStep = step;
  $$(".wizard-step").forEach((section) => section.classList.toggle("active", Number(section.dataset.step) === step));
  $$('[data-step-indicator]').forEach((item) => {
    const index = Number(item.dataset.stepIndicator);
    item.classList.toggle("active", index === step);
    item.classList.toggle("completed", index < step);
  });
  $("#previousButton").disabled = step === 0;
  $("#nextButton").classList.toggle("hidden", step === 4);
  $("#calculateButton").classList.toggle("hidden", step !== 4);
  $("#validationMessage").textContent = "";
  if (step === 2) scheduleProgramCompatibility(0);
}

function validateStep(step) {
  clearInvalid();
  const errors = [];
  const mark = (id, message) => {
    const element = $(id);
    if (element) element.classList.add("invalid");
    errors.push(message);
  };

  if (step === 0 && !$("#name").value.trim()) mark("#name", "Informe um nome para a estimativa.");
  if (step === 1 && num("#landArea") <= 30) mark("#landArea", "A área do terreno deve ser maior que 30 m².");
  if (step === 2) {
    const builtArea = num("#builtArea");
    if (builtArea <= 20) mark("#builtArea", "A área principal deve ser maior que 20 m².");
    if (num("#suites") > num("#bedrooms")) mark("#suites", "O número de suítes não pode superar o número de quartos.");
    if (num("#doubleHeightArea") > builtArea) mark("#doubleHeightArea", "O pé-direito duplo não pode superar a área principal.");
    if (num("#basementArea") > builtArea * 1.5) mark("#basementArea", "Revise a área de subsolo informada.");
  }
  if (step === 4) {
    if ($("#pool").checked && num("#poolArea") <= 0) mark("#poolArea", "Informe a área da piscina.");
    if (num("#otherInvestmentCosts") > 0 && !$("#otherInvestmentDescription").value.trim()) {
      mark("#otherInvestmentDescription", "Descreva a verba adicional do investimento.");
    }
  }

  $("#validationMessage").textContent = errors[0] || "";
  if (errors.length) toast(errors[0], "error");
  return errors.length === 0;
}

function validateAllSteps() {
  for (let step = 0; step <= 4; step += 1) {
    if (!validateStep(step)) {
      showStep(step);
      return false;
    }
  }
  return true;
}

function clearInvalid() {
  $$(".invalid").forEach((element) => element.classList.remove("invalid"));
}

function togglePoolArea() {
  const enabled = $("#pool").checked;
  $("#poolAreaField").classList.toggle("hidden", !enabled);
  $("#poolArea").disabled = !enabled;
}

function toggleAdminPriceBaseScope() {
  const municipal = $("#priceBaseScope").value === "municipal";
  $("#priceBaseCityField").classList.toggle("hidden", !municipal);
  $("#priceBaseCity").disabled = !municipal;
}

function num(selector) {
  const value = Number($(selector).value);
  return Number.isFinite(value) ? value : 0;
}

function collectRequest() {
  return {
    name: $("#name").value.trim(),
    location: {
      state: $("#state").value,
      city: $("#city").value.trim(),
      neighborhood: $("#neighborhood").value.trim(),
      price_base_id: $("#priceBaseId").value || null
    },
    terrain: {
      land_area: num("#landArea"),
      slope: $("#slope").value,
      soil: $("#soil").value,
      access: $("#access").value,
      soil_report: $("#soilReport").checked,
      demolition_area: num("#demolitionArea"),
      retaining_wall_area: num("#retainingWallArea"),
      rock: $("#rock").checked
    },
    building: {
      built_area: num("#builtArea"),
      floors: num("#floors"),
      basement_area: num("#basementArea"),
      balconies_area: num("#balconiesArea"),
      double_height_area: num("#doubleHeightArea"),
      garage_spaces: num("#garageSpaces"),
      garage_covered: $("#garageCovered").checked,
      complexity: $("#complexity").value
    },
    program: {
      bedrooms: num("#bedrooms"),
      suites: num("#suites"),
      bathrooms: num("#bathrooms"),
      half_baths: num("#halfBaths"),
      gourmet_area: $("#gourmetArea").checked
    },
    construction: {
      system: $("#system").value,
      roof: $("#roof").value,
      finish: $("#finish").value,
      flooring: $("#flooring").value,
      windows: $("#windows").value
    },
    extras: {
      pool: $("#pool").checked,
      pool_area: $("#pool").checked ? num("#poolArea") : 0,
      landscaping_area: num("#landscapingArea"),
      solar: $("#solar").checked,
      automation: $("#automation").checked,
      air_conditioned_rooms: num("#airConditionedRooms"),
      elevator: $("#elevator").checked,
      ev_charger: $("#evCharger").checked,
      rainwater_reuse: $("#rainwaterReuse").checked
    },
    costs: {
      include_designs: $("#includeDesigns").checked,
      include_indirects: $("#includeIndirects").checked,
      include_contingency: $("#includeContingency").checked,
      other_investment_costs: num("#otherInvestmentCosts"),
      other_investment_description: $("#otherInvestmentDescription").value.trim()
    }
  };
}

function applyRequestToForm(data) {
  const setValue = (selector, value) => { if ($(selector) && value !== undefined && value !== null) $(selector).value = value; };
  const setChecked = (selector, value) => { if ($(selector)) $(selector).checked = Boolean(value); };

  setValue("#name", data.name);
  setValue("#state", data.location?.state);
  setValue("#city", data.location?.city ?? "");
  setValue("#neighborhood", data.location?.neighborhood ?? "");
  $("#priceBaseId").dataset.pendingValue = data.location?.price_base_id || "";

  setValue("#landArea", data.terrain?.land_area);
  setValue("#slope", data.terrain?.slope);
  setValue("#soil", data.terrain?.soil);
  setValue("#access", data.terrain?.access);
  setChecked("#soilReport", data.terrain?.soil_report);
  setValue("#demolitionArea", data.terrain?.demolition_area);
  setValue("#retainingWallArea", data.terrain?.retaining_wall_area);
  setChecked("#rock", data.terrain?.rock);

  setValue("#builtArea", data.building?.built_area);
  setValue("#floors", data.building?.floors);
  setValue("#basementArea", data.building?.basement_area);
  setValue("#balconiesArea", data.building?.balconies_area);
  setValue("#doubleHeightArea", data.building?.double_height_area);
  setValue("#garageSpaces", data.building?.garage_spaces);
  setChecked("#garageCovered", data.building?.garage_covered);
  setValue("#complexity", data.building?.complexity);

  setValue("#bedrooms", data.program?.bedrooms);
  setValue("#suites", data.program?.suites);
  setValue("#bathrooms", data.program?.bathrooms);
  setValue("#halfBaths", data.program?.half_baths);
  setChecked("#gourmetArea", data.program?.gourmet_area);

  setValue("#system", data.construction?.system);
  setValue("#roof", data.construction?.roof);
  setValue("#finish", data.construction?.finish);
  setValue("#flooring", data.construction?.flooring);
  setValue("#windows", data.construction?.windows);

  setChecked("#pool", data.extras?.pool);
  setValue("#poolArea", data.extras?.pool_area);
  setValue("#landscapingArea", data.extras?.landscaping_area);
  setChecked("#solar", data.extras?.solar);
  setChecked("#automation", data.extras?.automation);
  setValue("#airConditionedRooms", data.extras?.air_conditioned_rooms);
  setChecked("#elevator", data.extras?.elevator);
  setChecked("#evCharger", data.extras?.ev_charger);
  setChecked("#rainwaterReuse", data.extras?.rainwater_reuse);

  setChecked("#includeDesigns", data.costs?.include_designs ?? true);
  setChecked("#includeIndirects", data.costs?.include_indirects ?? true);
  setChecked("#includeContingency", data.costs?.include_contingency ?? true);
  setValue("#otherInvestmentCosts", data.costs?.other_investment_costs ?? 0);
  setValue("#otherInvestmentDescription", data.costs?.other_investment_description ?? "");
  togglePoolArea();
  schedulePriceBaseRefresh(0);
  scheduleProgramCompatibility(0);
}

function schedulePriceBaseRefresh(delay = 300) {
  window.clearTimeout(priceBaseTimer);
  priceBaseTimer = window.setTimeout(() => refreshPriceBasesForLocation(), delay);
}

async function refreshPriceBasesForLocation() {
  const sequence = ++priceBaseSequence;
  const state = $("#state").value;
  const city = $("#city").value.trim();
  const select = $("#priceBaseId");
  const preferred = select.dataset.pendingValue ?? select.value;
  $("#priceBaseStatus").textContent = "Consultando bases versionadas...";
  try {
    const params = new URLSearchParams({ state, city, include_state: "true", limit: "100" });
    const records = await api(`/api/price-bases?${params.toString()}`);
    if (sequence !== priceBaseSequence) return;
    const options = ['<option value="">Automática - versão ativa mais específica</option>'];
    records.forEach((record) => {
      const local = record.scope === "municipal" ? record.city : record.state;
      const active = record.is_active ? " · ativa" : " · histórica";
      options.push(`<option value="${escapeHtml(record.id)}">${escapeHtml(labelMaps.scope[record.scope] || record.scope)} · ${escapeHtml(local)} · ${escapeHtml(record.date_base)} · ${escapeHtml(money(record.base_cost_m2))}/m²${active}</option>`);
    });
    select.innerHTML = options.join("");
    if (preferred && [...select.options].some((option) => option.value === preferred)) select.value = preferred;
    else select.value = "";
    delete select.dataset.pendingValue;
    await updatePriceBaseStatus();
  } catch (error) {
    if (sequence !== priceBaseSequence) return;
    select.innerHTML = '<option value="">Automática - fallback do motor</option>';
    $("#priceBaseStatus").textContent = `Não foi possível consultar as bases: ${error.message}`;
  }
}

async function updatePriceBaseStatus() {
  const state = $("#state").value;
  const city = $("#city").value.trim();
  const priceBaseId = $("#priceBaseId").value;
  const params = new URLSearchParams({ state, city });
  if (priceBaseId) params.set("price_base_id", priceBaseId);
  try {
    const resolved = await api(`/api/price-bases/resolve?${params.toString()}`);
    const scope = labelMaps.scope[resolved.scope] || resolved.scope;
    const location = resolved.scope === "municipal" ? resolved.city : resolved.state;
    const mode = resolved.selected_manually ? "Versão escolhida" : "Seleção automática";
    $("#priceBaseStatus").textContent = `${mode}: ${scope} · ${location || "nacional"} · ${resolved.date_base} · ${money(resolved.base_cost_m2)}/m² · ${resolved.version}`;
  } catch (error) {
    $("#priceBaseStatus").textContent = error.message;
  }
}

async function calculateEstimate(event) {
  event.preventDefault();
  if (!validateAllSteps()) return;
  const request = collectRequest();
  setLoading(true);
  try {
    const result = await api("/api/estimate", { method: "POST", body: request });
    currentRequest = request;
    currentResult = result;
    renderResult(request, result);
    toast("Estimativa calculada com quantitativos, compatibilidade do programa e base versionada.", "success");
  } catch (error) {
    toast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

function renderResult(request, result) {
  const technicalCost = Number(result.technical_cost ?? result.direct_cost ?? 0);
  const investmentTotal = Number(result.investment_total ?? result.probable_total ?? 0);
  const investmentMinimum = Number(result.investment_minimum ?? result.minimum_total ?? 0);
  const investmentMaximum = Number(result.investment_maximum ?? result.maximum_total ?? 0);
  const technicalPerM2 = Number(result.technical_cost_per_main_m2 ?? (technicalCost / Math.max(1, result.main_area)));
  const investmentPerM2 = Number(result.investment_cost_per_main_m2 ?? result.cost_per_main_m2 ?? 0);
  const priceBase = result.price_base || {
    scope: "global", version: result.parameter_version, date_base: result.date_base,
    base_cost_m2: result.base_cost_m2, source: "Cenário legado"
  };

  $("#resultTitle").textContent = request.name;
  $("#resultMeta").textContent = `${request.location.city || "Município não informado"} - ${request.location.state} · base ${priceBase.version} · parâmetros ${result.parameter_version}`;
  $("#technicalCost").textContent = money(technicalCost);
  $("#investmentTotal").textContent = money(investmentTotal);
  $("#minimumTotal").textContent = money(investmentMinimum);
  $("#maximumTotal").textContent = money(investmentMaximum);
  $("#technicalCostPerM2").textContent = `${money(technicalPerM2)} por m² principal`;
  $("#investmentCostPerM2").textContent = `${money(investmentPerM2)} por m² principal`;
  $("#priceBaseMetric").textContent = `${labelMaps.scope[priceBase.scope] || priceBase.scope} · ${priceBase.date_base}`;
  $("#baseCostM2").textContent = `${money(priceBase.base_cost_m2 ?? result.base_cost_m2)}/m²`;
  $("#equivalentArea").textContent = `${decimal.format(result.equivalent_area)} m²-eq`;
  $("#duration").textContent = `${result.estimated_duration_months[0]} a ${result.estimated_duration_months[1]} meses`;
  $("#confidence").textContent = labelMaps.confidence[result.confidence] || result.confidence;
  $("#completeness").textContent = `${result.completeness_score}%`;
  $("#uncertainty").textContent = `± ${decimal.format(result.uncertainty_percent)}%`;
  $("#contingency").textContent = `${decimal.format(result.contingency_percent)}%`;
  $("#technicalBreakdownTotal").textContent = money(technicalCost);
  $("#investmentBreakdownTotal").textContent = money(investmentTotal);
  $("#formulaSummary").textContent = result.formula_summary;
  renderProgramCompatibilityResult(result.program_compatibility);

  const technicalLines = (result.breakdown || []).filter((item) => ["direct", "specific"].includes(item.kind));
  $("#technicalBreakdownBody").innerHTML = technicalLines.map((item) => {
    const percentage = technicalCost ? (item.amount / technicalCost) * 100 : 0;
    const quantity = item.quantity !== null && item.quantity !== undefined
      ? `${formatNumber(item.quantity)} ${escapeHtml(item.unit || "")}`.trim()
      : "-";
    const unitCost = item.unit_cost !== null && item.unit_cost !== undefined
      ? `${money(item.unit_cost)}${item.unit ? `/${escapeHtml(item.unit)}` : ""}`
      : "-";
    return `<tr title="${escapeHtml(item.basis || "")}"><td>${escapeHtml(item.category)}<br><span class="type-pill">${escapeHtml(labelMaps.kinds[item.kind] || item.kind)}</span></td><td>${quantity}</td><td>${unitCost}</td><td>${money(item.amount)}</td><td>${decimal.format(percentage)}%</td></tr>`;
  }).join("");

  const investmentRows = result.investment_breakdown || legacyInvestmentBreakdown(result);
  $("#investmentBody").innerHTML = investmentRows.map((item) => `<tr><td>${escapeHtml(item.category)}<br><small>${escapeHtml(item.note || "")}</small></td><td>${item.included ? "Sim" : "Não"}</td><td>${money(item.amount)}</td></tr>`).join("");

  $("#quantitiesBody").innerHTML = (result.quantities || []).map((item) => `<tr><td>${escapeHtml(item.category)}</td><td>${escapeHtml(item.label)}</td><td><strong>${formatNumber(item.quantity)} ${escapeHtml(item.unit)}</strong></td><td><span class="confidence-pill ${escapeHtml(item.confidence)}">${escapeHtml(labelMaps.confidence[item.confidence] || item.confidence)}</span></td><td>${escapeHtml(item.basis)}</td></tr>`).join("") || '<tr><td colspan="5">Cenário legado sem quantitativos intermediários.</td></tr>';

  const sensitivity = result.sensitivity || [];
  const maxImpact = Math.max(1, ...sensitivity.map((item) => item.impact));
  $("#sensitivityList").innerHTML = sensitivity.map((item) => {
    const width = Math.max(3, (item.impact / maxImpact) * 100);
    const sign = item.direction === "decrease" ? "-" : "+";
    return `<div class="impact-item ${item.direction === "decrease" ? "decrease" : ""}"><div class="impact-label"><span>${escapeHtml(item.label)}</span><strong>${sign}${money(item.impact)}</strong></div><div class="impact-track"><div class="impact-bar" style="width:${width.toFixed(1)}%"></div></div></div>`;
  }).join("");

  renderMessageList("#warningsList", result.warnings);
  renderMessageList("#recommendationsList", result.recommendations);
  renderMessageList("#assumptionsList", result.assumptions);

  $("#factorsBody").innerHTML = (result.factors || []).map((item) => {
    const impact = Number(item.impact || 0);
    return `<tr><td>${escapeHtml(item.label)}</td><td>${Number(item.value).toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}×</td><td>${signedMoney(impact)}</td></tr>`;
  }).join("");

  $("#resultPanel").classList.remove("hidden");
  setTimeout(() => $("#resultPanel").scrollIntoView({ behavior: "smooth", block: "start" }), 50);
}

function legacyInvestmentBreakdown(result) {
  return [
    { category: "Custo técnico da execução", amount: result.direct_cost || 0, included: true, note: "Cenário salvo em versão anterior." },
    { category: "Projetos e aprovações", amount: result.designs_cost || 0, included: Boolean(result.designs_cost), note: "" },
    { category: "Administração, indiretos e BDI", amount: result.indirect_cost || 0, included: Boolean(result.indirect_cost), note: "" },
    { category: "Contingência", amount: result.contingency_cost || 0, included: Boolean(result.contingency_cost), note: "" }
  ];
}

function renderMessageList(selector, items) {
  $(selector).innerHTML = (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>Nenhum item identificado.</li>";
}

async function saveCurrentScenario() {
  if (!currentRequest || !currentResult) {
    toast("Calcule uma estimativa antes de salvar.", "error");
    return;
  }
  setLoading(true);
  try {
    const url = currentSimulationId ? `/api/simulations/${currentSimulationId}` : "/api/simulations";
    const method = currentSimulationId ? "PUT" : "POST";
    const wasExisting = Boolean(currentSimulationId);
    const record = await api(url, { method, body: currentRequest });
    currentSimulationId = record.id;
    currentResult = record.result;
    toast(wasExisting ? "Cenário atualizado." : "Cenário criado.", "success");
  } catch (error) {
    toast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function generateCurrentPdf() {
  if (!currentRequest) {
    toast("Calcule uma estimativa antes de gerar o relatório.", "error");
    return;
  }
  setLoading(true);
  try {
    const response = await fetch("/api/report.pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentRequest)
    });
    if (!response.ok) throw new Error(await responseError(response));
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug(currentRequest.name)}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast("Relatório PDF gerado.", "success");
  } catch (error) {
    toast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function loadScenarios() {
  setLoading(true);
  try {
    scenarioSummaries = await api("/api/simulations");
    renderScenarioTable();
    populateCompareSelects();
  } catch (error) {
    toast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

function renderScenarioTable() {
  const body = $("#scenariosBody");
  $("#emptyScenarios").classList.toggle("hidden", scenarioSummaries.length > 0);
  body.innerHTML = scenarioSummaries.map((item) => {
    const locality = [item.city, item.state].filter(Boolean).join(" - ");
    const investment = item.investment_total || item.probable_total;
    return `<tr>
      <td><strong>${escapeHtml(item.name)}</strong><br><small>${money(item.minimum_total)} a ${money(item.maximum_total)}</small></td>
      <td>${escapeHtml(locality || "-")}</td>
      <td>${decimal.format(item.built_area)} m²</td>
      <td>${money(item.technical_cost || 0)}</td>
      <td><strong>${money(investment)}</strong></td>
      <td><small>${escapeHtml(item.price_base_version || "-")}</small></td>
      <td>${formatDate(item.updated_at)}</td>
      <td><div class="scenario-actions">
        <button class="button small secondary" data-action="open" data-id="${item.id}">Abrir</button>
        <button class="button small secondary" data-action="duplicate" data-id="${item.id}">Duplicar</button>
        <button class="button small secondary" data-action="pdf" data-id="${item.id}">PDF</button>
        <button class="button small danger" data-action="delete" data-id="${item.id}">Excluir</button>
      </div></td>
    </tr>`;
  }).join("");
}

function populateCompareSelects() {
  const options = `<option value="">Selecione</option>` + scenarioSummaries.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join("");
  $("#compareA").innerHTML = options;
  $("#compareB").innerHTML = options;
  if (scenarioSummaries.length >= 2) {
    $("#compareA").value = scenarioSummaries[0].id;
    $("#compareB").value = scenarioSummaries[1].id;
  }
}

async function handleScenarioTableAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "pdf") {
    setLoading(true);
    try {
      const record = await api(`/api/simulations/${id}`);
      const response = await fetch("/api/report.pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record.input)
      });
      if (!response.ok) throw new Error(await responseError(response));
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug(record.name)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast("Relatório gerado.", "success");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
    return;
  }
  if (action === "delete") {
    if (!window.confirm("Excluir este cenário?")) return;
    setLoading(true);
    try {
      await api(`/api/simulations/${id}`, { method: "DELETE" });
      toast("Cenário excluído.", "success");
      await loadScenarios();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
    return;
  }
  setLoading(true);
  try {
    if (action === "duplicate") {
      await api(`/api/simulations/${id}/duplicate`, { method: "POST" });
      toast("Cenário duplicado.", "success");
      await loadScenarios();
    } else if (action === "open") {
      const record = await api(`/api/simulations/${id}`);
      currentSimulationId = record.id;
      currentRequest = record.input;
      currentResult = record.result;
      applyRequestToForm(record.input);
      renderResult(record.input, record.result);
      switchView("estimate");
      showStep(4);
    }
  } catch (error) {
    toast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function compareSelectedScenarios() {
  const idA = $("#compareA").value;
  const idB = $("#compareB").value;
  if (!idA || !idB || idA === idB) {
    toast("Selecione dois cenários diferentes.", "error");
    return;
  }
  setLoading(true);
  try {
    const [a, b] = await Promise.all([api(`/api/simulations/${idA}`), api(`/api/simulations/${idB}`)]);
    renderComparison(a, b);
  } catch (error) {
    toast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

function renderComparison(a, b) {
  const aInvestment = Number(a.result.investment_total ?? a.result.probable_total ?? 0);
  const bInvestment = Number(b.result.investment_total ?? b.result.probable_total ?? 0);
  const aTechnical = Number(a.result.technical_cost ?? a.result.direct_cost ?? 0);
  const bTechnical = Number(b.result.technical_cost ?? b.result.direct_cost ?? 0);
  const difference = bInvestment - aInvestment;
  const percent = aInvestment ? (difference / aInvestment) * 100 : 0;
  const areaDifference = b.result.main_area - a.result.main_area;
  const panel = $("#comparisonResult");
  const metrics = [
    ["Custo técnico", money(aTechnical), money(bTechnical), signedMoney(bTechnical - aTechnical)],
    ["Investimento total", money(aInvestment), money(bInvestment), signedMoney(difference)],
    ["Acréscimos ao técnico", money(aInvestment - aTechnical), money(bInvestment - bTechnical), signedMoney((bInvestment - bTechnical) - (aInvestment - aTechnical))],
    ["Faixa mínima", money(a.result.investment_minimum ?? a.result.minimum_total), money(b.result.investment_minimum ?? b.result.minimum_total), signedMoney((b.result.investment_minimum ?? b.result.minimum_total) - (a.result.investment_minimum ?? a.result.minimum_total))],
    ["Faixa máxima", money(a.result.investment_maximum ?? a.result.maximum_total), money(b.result.investment_maximum ?? b.result.maximum_total), signedMoney((b.result.investment_maximum ?? b.result.maximum_total) - (a.result.investment_maximum ?? a.result.maximum_total))],
    ["Área principal", `${decimal.format(a.result.main_area)} m²`, `${decimal.format(b.result.main_area)} m²`, `${areaDifference >= 0 ? "+" : ""}${decimal.format(areaDifference)} m²`],
    ["Custo técnico/m²", money(a.result.technical_cost_per_main_m2 ?? aTechnical / a.result.main_area), money(b.result.technical_cost_per_main_m2 ?? bTechnical / b.result.main_area), signedMoney((b.result.technical_cost_per_main_m2 ?? bTechnical / b.result.main_area) - (a.result.technical_cost_per_main_m2 ?? aTechnical / a.result.main_area))],
    ["Prazo", `${a.result.estimated_duration_months[0]}-${a.result.estimated_duration_months[1]} meses`, `${b.result.estimated_duration_months[0]}-${b.result.estimated_duration_months[1]} meses`, "-"],
    ["Base de preços", a.result.price_base?.version || a.result.parameter_version, b.result.price_base?.version || b.result.parameter_version, "-"]
  ];
  panel.innerHTML = `
    <div class="comparison-summary">
      <article><span>Diferença de investimento B - A</span><strong>${signedMoney(difference)}</strong></article>
      <article><span>Variação relativa</span><strong>${percent >= 0 ? "+" : ""}${decimal.format(percent)}%</strong></article>
      <article><span>Área B - A</span><strong>${areaDifference >= 0 ? "+" : ""}${decimal.format(areaDifference)} m²</strong></article>
    </div>
    <div class="table-wrap comparison-table"><table><thead><tr><th>Métrica</th><th>${escapeHtml(a.name)}</th><th>${escapeHtml(b.name)}</th><th>Diferença</th></tr></thead><tbody>
    ${metrics.map((row) => `<tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td><td>${escapeHtml(row[2])}</td><td>${escapeHtml(row[3])}</td></tr>`).join("")}
    </tbody></table></div>`;
  panel.classList.remove("hidden");
}

async function loadAdminData() {
  setLoading(true);
  try {
    await Promise.all([
      loadParameters(true),
      loadPriceBaseHistory(true),
      loadParameterHistory(true)
    ]);
  } catch (error) {
    toast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function loadParameters(silent = false) {
  const parameters = await api("/api/parameters");
  $("#parametersEditor").value = JSON.stringify(parameters, null, 2);
  if (!silent) toast("Parâmetros carregados.", "success");
  return parameters;
}

async function saveParameters() {
  let parameters;
  try {
    parameters = JSON.parse($("#parametersEditor").value);
  } catch (error) {
    toast(`JSON inválido: ${error.message}`, "error");
    return;
  }
  setLoading(true);
  try {
    const changeNote = $("#parameterChangeNote").value.trim() || "Edição pelo painel";
    const saved = await api(`/api/parameters?change_note=${encodeURIComponent(changeNote)}`, {
      method: "PUT",
      body: parameters,
      headers: {
        "X-Admin-Key": $("#adminKey").value
      }
    });
    $("#parametersEditor").value = JSON.stringify(saved, null, 2);
    await loadParameterHistory(true);
    toast("Nova revisão dos parâmetros salva.", "success");
    checkHealth();
  } catch (error) {
    toast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function createPriceBase() {
  const scope = $("#priceBaseScope").value;
  const payload = {
    scope,
    state: $("#priceBaseState").value,
    city: scope === "municipal" ? $("#priceBaseCity").value.trim() : "",
    version: $("#priceBaseVersion").value.trim(),
    date_base: $("#priceBaseDate").value,
    base_cost_m2: num("#priceBaseCost"),
    currency: "BRL",
    source: $("#priceBaseSource").value.trim(),
    notes: $("#priceBaseNotes").value.trim(),
    activate: true
  };
  if (!payload.version || !payload.date_base || payload.base_cost_m2 <= 0 || (scope === "municipal" && !payload.city)) {
    toast("Preencha escopo/local, data-base, versão e custo-base positivo.", "error");
    return;
  }
  setLoading(true);
  try {
    const created = await api("/api/price-bases", {
      method: "POST",
      body: payload,
      headers: { "X-Admin-Key": $("#adminKey").value }
    });
    $("#baseFilterState").value = created.state;
    $("#baseFilterCity").value = created.city;
    await loadPriceBaseHistory(true);
    schedulePriceBaseRefresh(0);
    toast(`Base ${created.version} cadastrada e ativada.`, "success");
  } catch (error) {
    toast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function loadPriceBaseHistory(silent = false) {
  const state = $("#baseFilterState").value || "SP";
  const city = $("#baseFilterCity").value.trim();
  const params = new URLSearchParams({ state, limit: "500" });
  if (city) params.set("city", city);
  const records = await api(`/api/price-bases?${params.toString()}`);
  $("#priceBasesBody").innerHTML = records.map((record) => {
    const local = record.scope === "municipal" ? `${record.city} - ${record.state}` : record.state;
    const status = record.is_active ? '<span class="status-pill active">Ativa</span>' : '<span class="status-pill">Histórica</span>';
    const action = record.is_active ? "-" : `<button class="button small secondary" data-action="activate-base" data-id="${record.id}">Ativar</button>`;
    return `<tr><td>${escapeHtml(labelMaps.scope[record.scope] || record.scope)}<br><strong>${escapeHtml(local)}</strong></td><td>${escapeHtml(record.date_base)}</td><td><small>${escapeHtml(record.version)}</small></td><td>${money(record.base_cost_m2)}</td><td>${status}</td><td><small>${escapeHtml(record.source)}</small></td><td>${action}</td></tr>`;
  }).join("") || '<tr><td colspan="7">Nenhuma versão encontrada.</td></tr>';
  if (!silent) toast("Histórico de preços atualizado.", "success");
  return records;
}

async function handlePriceBaseHistoryAction(event) {
  const button = event.target.closest('button[data-action="activate-base"]');
  if (!button) return;
  setLoading(true);
  try {
    const activated = await api(`/api/price-bases/${button.dataset.id}/activate`, {
      method: "POST",
      headers: { "X-Admin-Key": $("#adminKey").value }
    });
    await loadPriceBaseHistory(true);
    schedulePriceBaseRefresh(0);
    toast(`Base ${activated.version} ativada.`, "success");
  } catch (error) {
    toast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function loadParameterHistory(silent = false) {
  const records = await api("/api/parameters/history?limit=100");
  $("#parameterHistoryBody").innerHTML = records.map((record) => `<tr><td><strong>${escapeHtml(record.version)}</strong></td><td>${escapeHtml(record.date_base || "-")}</td><td>${formatDate(record.created_at)}</td><td>${escapeHtml(record.change_note)}</td><td><button class="button small secondary" data-action="load-revision" data-id="${record.id}">Carregar JSON</button></td></tr>`).join("") || '<tr><td colspan="5">Nenhuma revisão registrada.</td></tr>';
  if (!silent) toast("Histórico de parâmetros atualizado.", "success");
  return records;
}

async function handleParameterHistoryAction(event) {
  const button = event.target.closest('button[data-action="load-revision"]');
  if (!button) return;
  setLoading(true);
  try {
    const revision = await api(`/api/parameters/history/${button.dataset.id}`);
    $("#parametersEditor").value = JSON.stringify(revision.payload, null, 2);
    $("#parameterChangeNote").value = `Nova revisão baseada em ${revision.version}`;
    toast("Revisão histórica carregada no editor; nada foi salvo ainda.", "success");
  } catch (error) {
    toast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function checkHealth() {
  const badge = $("#healthBadge");
  try {
    const data = await api("/api/health");
    badge.className = "health ok";
    badge.innerHTML = `<span></span> motor v${escapeHtml(data.engine_version)} · ${escapeHtml(data.parameter_version)}`;
  } catch {
    badge.className = "health error";
    badge.innerHTML = "<span></span> motor indisponível";
  }
}

async function api(url, options = {}, parse = true) {
  const headers = { ...(options.headers || {}) };
  const requestOptions = { method: options.method || "GET", headers };
  if (options.body !== undefined) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
    requestOptions.body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }
  const response = await fetch(url, requestOptions);
  if (!response.ok) throw new Error(await responseError(response));
  if (!parse || response.status === 204) return null;
  return response.json();
}

async function responseError(response) {
  try {
    const payload = await response.json();
    if (typeof payload.detail === "string") return payload.detail;
    if (Array.isArray(payload.detail)) return payload.detail.map((item) => item.msg || JSON.stringify(item)).join("; ");
    return payload.message || `Erro ${response.status}`;
  } catch {
    return `Erro ${response.status}: ${response.statusText}`;
  }
}

function setLoading(active) {
  $("#loadingOverlay").classList.toggle("hidden", !active);
}

function toast(message, type = "") {
  const element = $("#toast");
  element.textContent = message;
  element.className = `toast show ${type}`.trim();
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { element.className = "toast"; }, 3600);
}

function money(value) {
  return currency.format(Number(value || 0));
}

function formatNumber(value) {
  const number = Number(value || 0);
  return Math.abs(number - Math.round(number)) < 0.005 ? integer.format(number) : decimal.format(number);
}

function signedMoney(value) {
  const number = Number(value || 0);
  if (Math.abs(number) < 0.005) return money(0);
  return `${number > 0 ? "+" : "-"}${money(Math.abs(number))}`;
}

function formatDate(value) {
  try { return dateTime.format(new Date(value)); } catch { return value || "-"; }
}

function slug(value) {
  return (value || "estimativa-casa")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "estimativa-casa";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
