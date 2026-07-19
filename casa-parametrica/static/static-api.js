"use strict";

(() => {
  const originalFetch = window.fetch.bind(window);
  const basePath = new URL("..", document.currentScript.src);
  const storageKey = "casa-parametrica-cenarios";
  let parametersCache = null;
  let priceBasesCache = null;

  const jsonResponse = (payload, status = 200) => new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });

  const textReportResponse = (request, result) => {
    const lines = [
      "Casa Parametrica - Relatorio preliminar",
      "",
      `Cenario: ${request.name || "Estimativa"}`,
      `Local: ${(request.location?.city || "-")} - ${(request.location?.state || "-")}`,
      `Area principal: ${result.main_area} m2`,
      `Custo tecnico: R$ ${Math.round(result.technical_cost).toLocaleString("pt-BR")}`,
      `Investimento total: R$ ${Math.round(result.investment_total).toLocaleString("pt-BR")}`,
      "",
      "Relatorio gerado em modo estatico. Valores preliminares e demonstrativos.",
      "Nao substitui orcamento analitico, projeto executivo ou responsabilidade tecnica."
    ];
    return new Response(lines.join("\n"), {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": "attachment; filename=\"casa-parametrica-relatorio.txt\""
      }
    });
  };

  async function loadParameters() {
    if (!parametersCache) {
      const response = await originalFetch(new URL("data/default_parameters.json", basePath));
      parametersCache = await response.json();
    }
    return parametersCache;
  }

  async function loadPriceBases() {
    if (!priceBasesCache) {
      const response = await originalFetch(new URL("data/default_price_bases.json", basePath));
      priceBasesCache = await response.json();
    }
    return priceBasesCache;
  }

  function readBody(options) {
    if (!options?.body) return {};
    return typeof options.body === "string" ? JSON.parse(options.body) : options.body;
  }

  function scenarios() {
    try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); }
    catch { return []; }
  }

  function saveScenarios(items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }

  function newest(records) {
    return [...records].sort((a, b) => String(b.date_base).localeCompare(String(a.date_base)))[0] || null;
  }

  async function resolvePriceBase(params) {
    const records = await loadPriceBases();
    const requestedId = params.get("price_base_id");
    if (requestedId) {
      const chosen = records.find((item) => item.id === requestedId);
      if (chosen) return { ...chosen, selected_manually: true };
    }
    const state = (params.get("state") || "SP").toUpperCase();
    const city = (params.get("city") || "").trim().toLowerCase();
    const municipal = records.filter((item) =>
      item.scope === "municipal" &&
      item.state === state &&
      (item.city || "").trim().toLowerCase() === city &&
      item.is_active
    );
    const stateRecords = records.filter((item) => item.scope === "state" && item.state === state && item.is_active);
    const fallback = records.filter((item) => item.scope === "state" && item.state === "SP" && item.is_active);
    return { ...(newest(municipal) || newest(stateRecords) || newest(fallback) || records[0]), selected_manually: false };
  }

  async function filterPriceBases(params) {
    const records = await loadPriceBases();
    const state = (params.get("state") || "").toUpperCase();
    const city = (params.get("city") || "").trim().toLowerCase();
    return records
      .filter((item) => !state || item.state === state)
      .filter((item) => !city || (item.city || "").trim().toLowerCase() === city)
      .sort((a, b) => String(b.date_base).localeCompare(String(a.date_base)));
  }

  function programCompatibility(payload) {
    const area = Number(payload.built_area || 0);
    const program = payload.program || {};
    const bedrooms = Number(program.bedrooms || 0);
    const suites = Number(program.suites || 0);
    const bathrooms = Number(program.bathrooms || 0);
    const halfBaths = Number(program.half_baths || 0);
    const floors = Number(payload.floors || 1);
    const gourmet = Boolean(program.gourmet_area);
    const complexity = payload.complexity || "regular";

    const minimum = 32 + bedrooms * 13 + suites * 5 + bathrooms * 4 + halfBaths * 2 + (gourmet ? 12 : 0);
    const complexityFactor = { compacta: 0.92, regular: 1, articulada: 1.08, complexa: 1.16 }[complexity] || 1;
    const floorFactor = floors > 1 ? 1.04 : 1;
    const minimumArea = Math.max(45, minimum * complexityFactor * floorFactor);
    const recommendedMin = minimumArea * 1.18;
    const recommendedMax = minimumArea * 1.55;
    const score = Math.max(0, Math.min(100, Math.round((area / recommendedMin) * 78)));
    let status = "adequate";
    let label = "Adequado";
    let message = "A area informada e compativel com o programa residencial indicado.";
    if (area < minimumArea) {
      status = "incompatible";
      label = "Incompativel";
      message = "A area principal esta abaixo da faixa minima estimada para os ambientes informados.";
    } else if (area < recommendedMin) {
      status = "tight";
      label = "Compacto";
      message = "A area atende ao minimo, mas exigira solucao arquitetonica compacta.";
    } else if (area > recommendedMax * 1.2) {
      status = "very_generous";
      label = "Muito generoso";
      message = "A area esta acima da faixa recomendada e pode elevar custos de implantacao e manutencao.";
    } else if (area > recommendedMax) {
      status = "generous";
      label = "Generoso";
      message = "A area oferece folga para circulacoes e ambientes mais amplos.";
    }
    return {
      status,
      label,
      message,
      main_area: area,
      minimum_area: Number(minimumArea.toFixed(1)),
      recommended_min: Number(recommendedMin.toFixed(1)),
      recommended_max: Number(recommendedMax.toFixed(1)),
      score,
      method_version: "static-2026.07",
      disclaimer: "Faixa orientativa; nao substitui estudo arquitetonico.",
      suggestions: [
        area < recommendedMin ? "Revise o programa de necessidades ou aumente a area principal." : "Valide a distribuicao dos ambientes com profissional habilitado.",
        "Considere circulacoes, areas tecnicas, afastamentos e condicionantes do terreno.",
        "Use a estimativa como apoio preliminar antes do orcamento analitico."
      ],
      components: [
        { label: "Ambientes-base", area: Number(minimum.toFixed(1)), note: "Quartos, banheiros e areas sociais" },
        { label: "Complexidade", area: Number((minimumArea - minimum).toFixed(1)), note: complexity },
        { label: "Faixa recomendada", area: Number(recommendedMin.toFixed(1)), note: "Inicio da faixa confortavel" }
      ]
    };
  }

  async function estimate(request) {
    const parameters = await loadParameters();
    const priceBase = await resolvePriceBase(new URLSearchParams({
      state: request.location?.state || "SP",
      city: request.location?.city || "",
      price_base_id: request.location?.price_base_id || ""
    }));
    const building = request.building || {};
    const terrain = request.terrain || {};
    const construction = request.construction || {};
    const extras = request.extras || {};
    const costs = request.costs || {};

    const mainArea = Number(building.built_area || 0);
    const garageArea = Number(building.garage_spaces || 0) * (parameters.equivalent_area_coefficients?.garage_area_per_space || 13.5);
    const equivalentArea = mainArea +
      Number(building.balconies_area || 0) * 0.58 +
      Number(building.basement_area || 0) * 1.3 +
      Number(building.double_height_area || 0) * 0.27 +
      garageArea * (building.garage_covered ? 0.48 : 0.22);

    const factorItems = [
      ["UF", parameters.region_factors?.[request.location?.state] || 1],
      ["Padrao de acabamento", parameters.finish_factors?.[construction.finish] || 1],
      ["Sistema construtivo", parameters.system_factors?.[construction.system] || 1],
      ["Cobertura", parameters.roof_factors?.[construction.roof] || 1],
      ["Piso", parameters.flooring_factors?.[construction.flooring] || 1],
      ["Esquadrias", parameters.window_factors?.[construction.windows] || 1],
      ["Declividade", parameters.slope_factors?.[terrain.slope] || 1],
      ["Solo", parameters.soil_factors?.[terrain.soil] || 1],
      ["Acesso", parameters.access_factors?.[terrain.access] || 1],
      ["Pavimentos", parameters.floors_factors?.[String(building.floors || 1)] || 1],
      ["Complexidade", parameters.complexity_factors?.[building.complexity] || 1]
    ];
    const globalFactor = factorItems.reduce((acc, item) => acc * item[1], 1);
    const baseCost = Number(priceBase.base_cost_m2 || parameters.base_cost_m2 || 3200);
    const directCore = equivalentArea * baseCost * globalFactor;
    const specific = parameters.specific_costs || {};
    const poolCost = extras.pool ? Number(extras.pool_area || 0) * Number(specific.pool_m2 || 4300) : 0;
    const landscapingCost = Number(extras.landscaping_area || 0) * Number(specific.landscaping_m2 || 310);
    const retainingCost = Number(terrain.retaining_wall_area || 0) * Number(specific.retaining_wall_m2 || 1850);
    const demolitionCost = Number(terrain.demolition_area || 0) * Number(specific.demolition_m2 || 175);
    const extrasCost = (extras.solar ? 42000 : 0) + (extras.automation ? 28000 : 0) +
      Number(extras.air_conditioned_rooms || 0) * 5200 + (extras.elevator ? 125000 : 0) +
      (extras.ev_charger ? 8500 : 0) + (extras.rainwater_reuse ? 18000 : 0);
    const technicalCost = directCore + poolCost + landscapingCost + retainingCost + demolitionCost + extrasCost;
    const designsCost = costs.include_designs ? technicalCost * 0.055 : 0;
    const indirectCost = costs.include_indirects ? technicalCost * 0.12 : 0;
    const contingencyPercent = costs.include_contingency ? 8 : 0;
    const contingencyCost = technicalCost * contingencyPercent / 100;
    const other = Number(costs.other_investment_costs || 0);
    const investmentTotal = technicalCost + designsCost + indirectCost + contingencyCost + other;
    const uncertaintyPercent = 18;
    const compatibility = programCompatibility({
      built_area: mainArea,
      floors: building.floors,
      complexity: building.complexity,
      program: request.program || {}
    });

    return {
      parameter_version: parameters.version || "2026.07-demo",
      date_base: parameters.date_base || "2026-07",
      base_cost_m2: baseCost,
      price_base: priceBase,
      main_area: mainArea,
      equivalent_area: Number(equivalentArea.toFixed(2)),
      technical_cost: Number(technicalCost.toFixed(2)),
      technical_cost_per_main_m2: Number((technicalCost / Math.max(1, mainArea)).toFixed(2)),
      investment_total: Number(investmentTotal.toFixed(2)),
      investment_minimum: Number((investmentTotal * (1 - uncertaintyPercent / 100)).toFixed(2)),
      investment_maximum: Number((investmentTotal * (1 + uncertaintyPercent / 100)).toFixed(2)),
      investment_cost_per_main_m2: Number((investmentTotal / Math.max(1, mainArea)).toFixed(2)),
      estimated_duration_months: [Math.max(4, Math.round(mainArea / 45)), Math.max(6, Math.round(mainArea / 32))],
      confidence: terrain.soil_report ? "high" : "medium",
      completeness_score: terrain.soil_report ? 82 : 68,
      uncertainty_percent: uncertaintyPercent,
      contingency_percent: contingencyPercent,
      formula_summary: "Area equivalente x custo-base regional x fatores parametricos + itens especificos + custos indiretos.",
      program_compatibility: compatibility,
      breakdown: [
        { kind: "direct", category: "Construcao principal", quantity: Number(equivalentArea.toFixed(2)), unit: "m2-eq", unit_cost: Number((baseCost * globalFactor).toFixed(2)), amount: Number(directCore.toFixed(2)), basis: "Area equivalente ajustada por fatores" },
        { kind: "specific", category: "Piscina", quantity: Number(extras.pool_area || 0), unit: "m2", unit_cost: Number(specific.pool_m2 || 4300), amount: Number(poolCost.toFixed(2)), basis: "Item opcional" },
        { kind: "specific", category: "Paisagismo", quantity: Number(extras.landscaping_area || 0), unit: "m2", unit_cost: Number(specific.landscaping_m2 || 310), amount: Number(landscapingCost.toFixed(2)), basis: "Item opcional" },
        { kind: "specific", category: "Contencoes e demolicoes", quantity: 1, unit: "vb", unit_cost: null, amount: Number((retainingCost + demolitionCost).toFixed(2)), basis: "Condicionantes do terreno" },
        { kind: "specific", category: "Sistemas extras", quantity: 1, unit: "vb", unit_cost: null, amount: Number(extrasCost.toFixed(2)), basis: "Energia, automacao, ar-condicionado e itens especiais" }
      ].filter((item) => item.amount > 0),
      investment_breakdown: [
        { category: "Custo tecnico da execucao", amount: Number(technicalCost.toFixed(2)), included: true, note: "Estimativa parametrica" },
        { category: "Projetos e aprovacoes", amount: Number(designsCost.toFixed(2)), included: costs.include_designs, note: "Percentual preliminar" },
        { category: "Administracao, indiretos e BDI", amount: Number(indirectCost.toFixed(2)), included: costs.include_indirects, note: "Percentual preliminar" },
        { category: "Contingencia", amount: Number(contingencyCost.toFixed(2)), included: costs.include_contingency, note: "Margem de incerteza" },
        { category: costs.other_investment_description || "Verba adicional", amount: other, included: other > 0, note: "Informada pelo usuario" }
      ],
      quantities: [
        { category: "Area", label: "Area principal", quantity: mainArea, unit: "m2", confidence: "high", basis: "Informada pelo usuario" },
        { category: "Area", label: "Area equivalente", quantity: Number(equivalentArea.toFixed(2)), unit: "m2-eq", confidence: "medium", basis: "Coeficientes parametricos" },
        { category: "Garagem", label: "Area equivalente de garagem", quantity: Number(garageArea.toFixed(2)), unit: "m2", confidence: "medium", basis: "Vagas informadas" }
      ],
      sensitivity: [
        { label: "Acabamento superior/inferior", impact: technicalCost * 0.12, direction: "increase" },
        { label: "Solo e fundacoes", impact: technicalCost * 0.07, direction: terrain.soil_report ? "decrease" : "increase" },
        { label: "Complexidade arquitetonica", impact: technicalCost * 0.08, direction: "increase" }
      ],
      warnings: [
        "Valores demonstrativos e preliminares, sem substituicao de orcamento analitico.",
        terrain.soil_report ? "Sondagem informada pelo usuario." : "Sem sondagem: fundacoes e contencoes possuem maior incerteza."
      ],
      recommendations: [
        "Conferir area, padrao de acabamento, sistemas construtivos e condicionantes do terreno.",
        "Atualizar bases de preco com fontes tecnicas regionais antes de tomada de decisao."
      ],
      assumptions: [
        parameters.notice || "Parametros demonstrativos.",
        "Modelo executado integralmente no navegador para publicacao estatica."
      ],
      factors: factorItems.map(([label, value]) => ({ label, value, impact: technicalCost * (value - 1) / factorItems.length }))
    };
  }

  function summary(record) {
    return {
      id: record.id,
      name: record.name,
      state: record.input.location?.state || "",
      city: record.input.location?.city || "",
      built_area: record.input.building?.built_area || 0,
      technical_cost: record.result.technical_cost,
      investment_total: record.result.investment_total,
      minimum_total: record.result.investment_minimum,
      maximum_total: record.result.investment_maximum,
      price_base_version: record.result.price_base?.version || record.result.parameter_version,
      updated_at: record.updated_at
    };
  }

  async function route(url, options) {
    const requestUrl = new URL(url, window.location.origin);
    const path = requestUrl.pathname;
    if (!path.startsWith("/api/")) return null;

    if (path === "/api/health") {
      const parameters = await loadParameters();
      return jsonResponse({ status: "ok", engine_version: "estatico", parameter_version: parameters.version });
    }
    if (path === "/api/parameters" && (options.method || "GET") === "GET") return jsonResponse(await loadParameters());
    if (path === "/api/parameters" && options.method === "PUT") {
      parametersCache = readBody(options);
      return jsonResponse(parametersCache);
    }
    if (path === "/api/parameters/history") {
      const parameters = await loadParameters();
      return jsonResponse([{ id: "static-current", version: parameters.version, date_base: parameters.date_base, created_at: new Date().toISOString(), change_note: "Versao estatica demonstrativa" }]);
    }
    if (path === "/api/parameters/history/static-current") return jsonResponse({ id: "static-current", payload: await loadParameters() });
    if (path === "/api/price-bases" && (options.method || "GET") === "GET") return jsonResponse(await filterPriceBases(requestUrl.searchParams));
    if (path === "/api/price-bases/resolve") return jsonResponse(await resolvePriceBase(requestUrl.searchParams));
    if (path === "/api/price-bases" && options.method === "POST") return jsonResponse({ id: `local-${Date.now()}`, ...readBody(options), is_active: true }, 201);
    if (/^\/api\/price-bases\/[^/]+\/activate$/.test(path)) return jsonResponse({ id: path.split("/")[3], is_active: true });
    if (path === "/api/program-compatibility") return jsonResponse(programCompatibility(readBody(options)));
    if (path === "/api/estimate") return jsonResponse(await estimate(readBody(options)));
    if (path === "/api/report.pdf") return textReportResponse(readBody(options), await estimate(readBody(options)));

    const simulationMatch = path.match(/^\/api\/simulations\/([^/]+)(?:\/(duplicate|report\.pdf))?$/);
    if (path === "/api/simulations" && (options.method || "GET") === "GET") {
      return jsonResponse(scenarios().map(summary).sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at))));
    }
    if (path === "/api/simulations" && options.method === "POST") {
      const input = readBody(options);
      const result = await estimate(input);
      const record = { id: crypto.randomUUID(), name: input.name || "Estimativa", input, result, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      saveScenarios([record, ...scenarios()]);
      return jsonResponse(record, 201);
    }
    if (simulationMatch) {
      const [, id, action] = simulationMatch;
      const items = scenarios();
      const record = items.find((item) => item.id === id);
      if (!record) return jsonResponse({ detail: "Cenario nao encontrado." }, 404);
      if (action === "report.pdf") return textReportResponse(record.input, record.result);
      if (action === "duplicate" && options.method === "POST") {
        const clone = { ...record, id: crypto.randomUUID(), name: `${record.name} - copia`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        saveScenarios([clone, ...items]);
        return jsonResponse(clone, 201);
      }
      if (options.method === "DELETE") {
        saveScenarios(items.filter((item) => item.id !== id));
        return new Response(null, { status: 204 });
      }
      if (options.method === "PUT") {
        const input = readBody(options);
        const result = await estimate(input);
        const updated = { ...record, name: input.name || record.name, input, result, updated_at: new Date().toISOString() };
        saveScenarios(items.map((item) => item.id === id ? updated : item));
        return jsonResponse(updated);
      }
      return jsonResponse(record);
    }
    return jsonResponse({ detail: "Recurso estatico nao implementado." }, 404);
  }

  window.fetch = async (url, options = {}) => {
    const routed = await route(String(url), { method: options.method || "GET", ...options });
    return routed || originalFetch(url, options);
  };
})();
