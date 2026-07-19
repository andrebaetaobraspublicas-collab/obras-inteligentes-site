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

  const pdfReportResponse = (request, result) => {
    const priceBase = result.price_base || {};
    const compatibility = result.program_compatibility || {};
    const terrain = request.terrain || {};
    const building = request.building || {};
    const program = request.program || {};
    const construction = request.construction || {};
    const extras = request.extras || {};
    const lines = [];
    const section = (title) => lines.push("", title);
    const row = (label, value) => lines.push(`${label}: ${value}`);
    const money = moneyText;

    lines.push(
      "Casa Parametrica - Relatorio preliminar",
      "",
      request.name || "Estimativa",
      `${request.location?.city || "Municipio nao informado"} - ${request.location?.state || "--"} | Base de precos: ${priceBase.version || result.parameter_version} | Data-base: ${priceBase.date_base || result.date_base}`
    );

    section("Resumo executivo");
    row("Custo tecnico", money(result.technical_cost));
    row("Investimento provavel", money(result.investment_total));
    row("Investimento minimo", money(result.investment_minimum));
    row("Investimento maximo", money(result.investment_maximum));
    row("Area principal", `${formatNumberText(result.main_area)} m2`);
    row("Area equivalente", `${formatNumberText(result.equivalent_area)} m2-eq`);
    row("Custo tecnico/m2", `${money(result.technical_cost_per_main_m2)}/m2`);
    row("Investimento/m2", `${money(result.investment_cost_per_main_m2)}/m2`);
    row("Prazo provavel", `${(result.estimated_duration_months || []).join(" a ")} meses`);
    row("Confiabilidade", result.confidence || "-");
    row("Completude", `${formatNumberText(result.completeness_score)}%`);
    row("Incerteza", `+/- ${formatNumberText(result.uncertainty_percent)}%`);
    row("Contingencia", `${formatNumberText(result.contingency_percent)}%`);

    section("Base de precos utilizada");
    row("Escopo/local", `${priceBase.scope || "-"} - ${priceBase.city || priceBase.state || "-"}`);
    row("Versao e data-base", `${priceBase.version || "-"} | ${priceBase.date_base || "-"}`);
    row("Custo-base", `${money(priceBase.base_cost_m2 || result.base_cost_m2)}/m2`);
    row("Fonte", priceBase.source || "-");
    row("Observacoes", priceBase.notes || "-");

    section("Premissas do imovel");
    row("Terreno", `${formatNumberText(terrain.land_area)} m2; inclinacao ${terrain.slope || "-"}; solo ${terrain.soil || "-"}; acesso ${terrain.access || "-"}`);
    row("Edificacao", `${formatNumberText(building.built_area)} m2 principais; ${building.floors || 1} pavimento(s); ${building.garage_spaces || 0} vaga(s); complexidade ${building.complexity || "-"}`);
    row("Programa", `${program.bedrooms || 0} quarto(s); ${program.suites || 0} suite(s); ${program.bathrooms || 0} banheiro(s); ${program.half_baths || 0} lavabo(s)`);
    row("Solucao", `${construction.system || "-"}; cobertura ${construction.roof || "-"}; padrao ${construction.finish || "-"}; piso ${construction.flooring || "-"}`);
    row("Complementos", `Piscina: ${extras.pool ? "sim" : "nao"}; solar: ${extras.solar ? "sim" : "nao"}; automacao: ${extras.automation ? "sim" : "nao"}; climatizacao: ${extras.air_conditioned_rooms || 0} ambiente(s)`);

    section("Compatibilidade entre area e programa");
    row("Classificacao", compatibility.label || "-");
    row("Indice de adequacao", `${compatibility.score ?? "-"} / 100`);
    row("Area informada", `${formatNumberText(compatibility.main_area)} m2`);
    row("Minimo parametrico", `${formatNumberText(compatibility.minimum_area)} m2`);
    row("Faixa recomendada", `${formatNumberText(compatibility.recommended_min)} a ${formatNumberText(compatibility.recommended_max)} m2`);
    row("Metodo", compatibility.method_version || "-");
    lines.push(compatibility.message || "");
    (compatibility.components || []).forEach((item) => {
      lines.push(`- ${item.label}: ${formatNumberText(item.area)} m2 | ${item.note || ""}`);
    });
    (compatibility.suggestions || []).forEach((item) => lines.push(`- ${item}`));
    if (compatibility.disclaimer) lines.push(compatibility.disclaimer);

    section("Separacao entre custo tecnico e investimento total");
    (result.investment_breakdown || []).forEach((item) => {
      lines.push(`${item.category} | Incluida: ${item.included ? "Sim" : "Nao"} | Valor: ${money(item.amount)} | ${item.note || ""}`);
    });
    lines.push(`INVESTIMENTO TOTAL PROVAVEL: ${money(result.investment_total)}`);

    section("Custo tecnico por subsistema");
    lines.push(result.formula_summary || "");
    (result.breakdown || []).forEach((item) => {
      const quantity = item.quantity !== null && item.quantity !== undefined ? `${formatNumberText(item.quantity)} ${item.unit || ""}` : "-";
      const unitCost = item.unit_cost !== null && item.unit_cost !== undefined ? `${money(item.unit_cost)}/${item.unit || "un"}` : "-";
      lines.push(`${item.category} | Quantidade-base: ${quantity} | Custo efetivo: ${unitCost} | Valor: ${money(item.amount)} | ${item.basis || ""}`);
    });
    lines.push(`CUSTO TECNICO: ${money(result.technical_cost)}`);

    section("Quantitativos parametricos intermediarios");
    lines.push("As quantidades abaixo orientam o modelo de custo. Elas sao aproximacoes de viabilidade e nao podem ser usadas para compra, medicao ou dimensionamento.");
    (result.quantities || []).forEach((item) => {
      lines.push(`${item.category} | ${item.label} | ${formatNumberText(item.quantity)} ${item.unit || ""} | Conf.: ${confidenceText(item.confidence)} | ${item.basis || ""}`);
    });

    section("Fatores aplicados");
    (result.factors || []).forEach((item) => {
      lines.push(`${item.label} | Multiplicador: ${Number(item.value || 0).toFixed(3)}x | Impacto aproximado: ${signedMoneyText(item.impact)}`);
    });

    section("Principais impactos");
    (result.sensitivity || []).forEach((item) => {
      lines.push(`${item.label} | ${item.direction === "decrease" ? "Reduz" : "Aumenta"} | ${money(Math.abs(item.impact || 0))}`);
    });

    section("Alertas");
    (result.warnings || []).forEach((item) => lines.push(`- ${item}`));
    section("Recomendacoes");
    (result.recommendations || []).forEach((item) => lines.push(`- ${item}`));
    section("Premissas e limitacoes");
    (result.assumptions || []).forEach((item) => lines.push(`- ${item}`));
    lines.push("- Este relatorio foi gerado automaticamente pelo sistema e possui carater auxiliar. A responsabilidade tecnica e do profissional habilitado.");

    const pdfBytes = buildSimplePdf(lines, `${request.name || "Casa Parametrica"} - Relatorio`);
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"casa-parametrica-relatorio.pdf\"",
        "Cache-Control": "no-store, max-age=0"
      }
    });
  };

  function moneyText(value) {
    return `R$ ${Number(value || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function signedMoneyText(value) {
    const number = Number(value || 0);
    return `${number >= 0 ? "+" : "-"}${moneyText(Math.abs(number))}`;
  }

  function formatNumberText(value, digits = 2) {
    const number = Number(value || 0);
    const maximumFractionDigits = Math.abs(number - Math.round(number)) < 0.005 ? 0 : digits;
    return number.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits });
  }

  function confidenceText(value) {
    return ({ high: "alta", medium: "media", low: "baixa" }[value] || value || "-");
  }

  function pdfEscape(value) {
    return String(value ?? "")
      .replace(/²/g, "2")
      .replace(/³/g, "3")
      .replace(/[º°]/g, "o")
      .replace(/[–—]/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\x20-\x7E]/g, "-")
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }

  function wrapPdfLine(line, width = 92) {
    const words = String(line || " ").split(/\s+/);
    const output = [];
    let current = "";
    for (const word of words) {
      if (!current) {
        current = word;
      } else if ((current.length + word.length + 1) <= width) {
        current += ` ${word}`;
      } else {
        output.push(current);
        current = word;
      }
    }
    output.push(current || " ");
    return output;
  }

  function buildSimplePdf(lines, title) {
    const pageWidth = 595;
    const pageHeight = 842;
    const margin = 52;
    const lineHeight = 15;
    const contentStreams = [];
    let cursorY = pageHeight - margin;
    let pageLines = [];

    const flushPage = () => {
      if (!pageLines.length) return;
      const body = [
        "BT",
        "/F1 16 Tf",
        `${margin} ${pageHeight - margin} Td`,
        `(${pdfEscape(title)}) Tj`,
        "0 -28 Td",
        "/F1 10 Tf",
        ...pageLines.map((line) => [`(${pdfEscape(line)}) Tj`, `0 -${lineHeight} Td`]).flat(),
        "ET"
      ].join("\n");
      contentStreams.push(body);
      pageLines = [];
      cursorY = pageHeight - margin;
    };

    for (const rawLine of lines) {
      const wrapped = rawLine ? wrapPdfLine(rawLine) : [" "];
      for (const line of wrapped) {
        if (cursorY < margin + lineHeight) flushPage();
        pageLines.push(line);
        cursorY -= lineHeight;
      }
    }
    flushPage();

    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      `<< /Type /Pages /Kids [${contentStreams.map((_, index) => `${3 + index * 2} 0 R`).join(" ")}] /Count ${contentStreams.length} >>`
    ];
    contentStreams.forEach((stream, index) => {
      const pageObjectNumber = 3 + index * 2;
      const contentObjectNumber = pageObjectNumber + 1;
      objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${3 + contentStreams.length * 2} 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`);
      objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    });
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

    const encoder = new TextEncoder();
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(encoder.encode(pdf).length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = encoder.encode(pdf).length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return encoder.encode(pdf);
  }

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
    const program = request.program || {};
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
    const riskAdd = (terrain.soil_report ? 0 : 3) + (terrain.slope === "muito_inclinado" ? 2 : 0) + (terrain.soil === "mole" ? 2 : 0) + (building.complexity === "complexa" ? 1.5 : 0);
    const contingencyPercent = costs.include_contingency ? 8 + riskAdd : 0;
    const contingencyCost = technicalCost * contingencyPercent / 100;
    const other = Number(costs.other_investment_costs || 0);
    const investmentTotal = technicalCost + designsCost + indirectCost + contingencyCost + other;
    const uncertaintyPercent = 18 + (terrain.soil_report ? 0 : 5) + (building.complexity === "complexa" ? 2 : 0) + (terrain.slope === "muito_inclinado" ? 2 : 0);
    const compatibility = programCompatibility({
      built_area: mainArea,
      floors: building.floors,
      complexity: building.complexity,
      program: request.program || {}
    });
    const floors = Math.max(1, Number(building.floors || 1));
    const balconiesArea = Number(building.balconies_area || 0);
    const basementArea = Number(building.basement_area || 0);
    const doubleHeightArea = Number(building.double_height_area || 0);
    const physicalArea = mainArea + garageArea + balconiesArea + basementArea;
    const projectionArea = mainArea / floors;
    const complexityPerimeter = { compacta: 1, regular: 1.08, articulada: 1.22, complexa: 1.38 }[building.complexity] || 1.08;
    const perimeter = Math.sqrt(Math.max(1, projectionArea)) * 4 * complexityPerimeter;
    const facadeArea = perimeter * 2.8 * floors + doubleHeightArea * 1.4;
    const internalWallFaces = mainArea * (1.35 + Number(program.bedrooms || 0) * 0.08 + Number(program.bathrooms || 0) * 0.05);
    const wallGuideArea = facadeArea + internalWallFaces + basementArea * 0.9;
    const foundationArea = projectionArea + garageArea * 0.45 + balconiesArea * 0.35 + basementArea * 0.65;
    const structuralArea = mainArea + garageArea * 0.35 + balconiesArea * 0.6 + basementArea * 1.15 + doubleHeightArea * 0.25;
    const concreteVolume = structuralArea * ({ alvenaria_concreto: 0.095, alvenaria_estrutural: 0.07, paredes_concreto: 0.11, steel_frame: 0.045, wood_frame: 0.035, estrutura_metalica: 0.055, pre_moldado: 0.08, modular: 0.04 }[construction.system] || 0.085);
    const steelMass = structuralArea * ({ alvenaria_concreto: 15, alvenaria_estrutural: 9, paredes_concreto: 13, steel_frame: 22, wood_frame: 5, estrutura_metalica: 28, pre_moldado: 14, modular: 8 }[construction.system] || 13);
    const earthVolume = projectionArea * ({ plano: 0.18, leve: 0.45, inclinado: 0.85, muito_inclinado: 1.25 }[terrain.slope] || 0.45) + basementArea * 1.8;
    const roofArea = projectionArea * ({ colonial_ceramica: 1.28, embutido_termoacustica: 1.12, fibrocimento: 1.08, shingle: 1.2, laje_impermeabilizada: 1.02, cobertura_verde: 1.08 }[construction.roof] || 1.12);
    const wetFloorArea = Number(program.bathrooms || 0) * 5.5 + Number(program.half_baths || 0) * 2.2 + 12 + (program.gourmet_area ? 10 : 0);
    const wetWallArea = Number(program.bathrooms || 0) * 22 + Number(program.half_baths || 0) * 10 + 18 + (program.gourmet_area ? 18 : 0);
    const waterproofArea = wetFloorArea + balconiesArea * 0.55 + basementArea * 0.65 + (construction.roof === "laje_impermeabilizada" ? roofArea * 0.7 : roofArea * 0.12);
    const windowArea = mainArea * ({ aluminio_basico: 0.11, aluminio_medio: 0.13, aluminio_superior: 0.15, pvc: 0.15, madeira: 0.14, grandes_vaos: 0.19 }[construction.windows] || 0.13);
    const doorCount = Math.max(4, Number(program.bedrooms || 0) + Number(program.bathrooms || 0) + Number(program.half_baths || 0) + 4);
    const electricalPoints = Math.round(mainArea * 0.42 + Number(program.bedrooms || 0) * 5 + Number(extras.air_conditioned_rooms || 0) * 3 + (extras.automation ? 18 : 0));
    const plumbingPoints = Math.round(Number(program.bathrooms || 0) * 8 + Number(program.half_baths || 0) * 4 + 9 + (program.gourmet_area ? 5 : 0) + (extras.pool ? 4 : 0));
    const installationPoints = electricalPoints + plumbingPoints * 1.25 + Number(extras.air_conditioned_rooms || 0) * 3;
    const ceilingArea = mainArea + basementArea * 0.9 + balconiesArea * 0.35;
    const paintingArea = Math.max(0, wallGuideArea + ceilingArea - wetWallArea * 0.65);
    const subsystemShares = [
      ["Servicos preliminares e canteiro", physicalArea, "m2", 0.045, "Area fisica total estimada."],
      ["Terraplenagem e fundacoes", foundationArea, "m2", 0.105, "Projecao, garagem, varandas e subsolo."],
      ["Estrutura", structuralArea, "m2", 0.145, "Areas cobertas ponderadas por esforco estrutural."],
      ["Vedacoes e alvenarias", wallGuideArea, "m2", 0.095, "Fachadas + faces internas + parcela de subsolo."],
      ["Cobertura", roofArea, "m2", 0.075, "Projecao coberta x solucao de cobertura."],
      ["Impermeabilizacao", waterproofArea, "m2", 0.04, "Areas molhadas, varandas, subsolo e cobertura."],
      ["Esquadrias e vidros", windowArea, "m2", 0.095, "Percentual da area principal conforme padrao de vaos."],
      ["Instalacoes eletricas e hidraulicas", installationPoints, "pt-eq", 0.13, "Pontos eletricos + hidraulicos ponderados."],
      ["Pisos e revestimentos", physicalArea, "m2", 0.17, "Casa, subsolo, varandas e garagem."],
      ["Pintura, acabamentos e entrega", paintingArea, "m2", 0.10, "Paredes e tetos menos revestimentos molhados."]
    ];
    const subtotalShares = subsystemShares.reduce((acc, item) => acc + item[3], 0);
    const subsystemBreakdown = subsystemShares.map(([category, quantity, unit, share, basis]) => {
      const amount = directCore * share / subtotalShares;
      return { kind: "direct", category, quantity: Number(quantity.toFixed(2)), unit, unit_cost: Number((amount / Math.max(1, quantity)).toFixed(2)), amount: Number(amount.toFixed(2)), basis };
    });
    const optionalBreakdown = [
      { kind: "specific", category: "Demolicao", quantity: Number(terrain.demolition_area || 0), unit: "m2", unit_cost: Number(specific.demolition_m2 || 175), amount: Number(demolitionCost.toFixed(2)), basis: "Area informada pelo usuario." },
      { kind: "specific", category: "Muros de contencao informados", quantity: Number(terrain.retaining_wall_area || 0), unit: "m2", unit_cost: Number(specific.retaining_wall_m2 || 1850), amount: Number(retainingCost.toFixed(2)), basis: "Area informada pelo usuario." },
      { kind: "specific", category: "Piscina", quantity: Number(extras.pool_area || 0), unit: "m2", unit_cost: Number(specific.pool_m2 || 4300), amount: Number(poolCost.toFixed(2)), basis: "Item opcional." },
      { kind: "specific", category: "Paisagismo", quantity: Number(extras.landscaping_area || 0), unit: "m2", unit_cost: Number(specific.landscaping_m2 || 310), amount: Number(landscapingCost.toFixed(2)), basis: "Item opcional." },
      { kind: "specific", category: "Sistema fotovoltaico preliminar", quantity: extras.solar ? 1 : 0, unit: "conj.", unit_cost: 42000, amount: extras.solar ? 42000 : 0, basis: "Verba parametrica preliminar." },
      { kind: "specific", category: "Automacao residencial", quantity: extras.automation ? 1 : 0, unit: "vb", unit_cost: 28000, amount: extras.automation ? 28000 : 0, basis: "Verba parametrica preliminar." },
      { kind: "specific", category: "Climatizacao", quantity: Number(extras.air_conditioned_rooms || 0), unit: "amb.", unit_cost: 5200, amount: Number(extras.air_conditioned_rooms || 0) * 5200, basis: "Ambientes climatizados informados." },
      { kind: "specific", category: "Elevador residencial", quantity: extras.elevator ? 1 : 0, unit: "un", unit_cost: 125000, amount: extras.elevator ? 125000 : 0, basis: "Item opcional." },
      { kind: "specific", category: "Carregador para veiculo eletrico", quantity: extras.ev_charger ? 1 : 0, unit: "un", unit_cost: 8500, amount: extras.ev_charger ? 8500 : 0, basis: "Item opcional." },
      { kind: "specific", category: "Reaproveitamento de agua pluvial", quantity: extras.rainwater_reuse ? 1 : 0, unit: "conj.", unit_cost: 18000, amount: extras.rainwater_reuse ? 18000 : 0, basis: "Item opcional." }
    ].filter((item) => item.amount > 0);
    const factorResults = factorItems.map(([label, value]) => ({ label, value, impact: directCore * (value - 1) / Math.max(1, globalFactor) }));
    const sensitivityItems = [
      ...factorResults.map((item) => ({ label: item.label, impact: Math.abs(item.impact), direction: item.impact < 0 ? "decrease" : "increase" })),
      ...optionalBreakdown.map((item) => ({ label: item.category, impact: item.amount, direction: "increase" }))
    ].filter((item) => item.impact > 0).sort((a, b) => b.impact - a.impact);

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
      breakdown: [...subsystemBreakdown, ...optionalBreakdown],
      investment_breakdown: [
        { category: "Custo tecnico da execucao", amount: Number(technicalCost.toFixed(2)), included: true, note: "Estimativa parametrica" },
        { category: "Projetos e aprovacoes", amount: Number(designsCost.toFixed(2)), included: costs.include_designs, note: "Percentual preliminar" },
        { category: "Administracao, indiretos e BDI", amount: Number(indirectCost.toFixed(2)), included: costs.include_indirects, note: "Percentual preliminar" },
        { category: "Contingencia", amount: Number(contingencyCost.toFixed(2)), included: costs.include_contingency, note: "Margem de incerteza" },
        { category: costs.other_investment_description || "Verba adicional", amount: other, included: other > 0, note: "Informada pelo usuario" }
      ],
      quantities: [
        { category: "Area", label: "Area principal", quantity: mainArea, unit: "m2", confidence: "high", basis: "Informada pelo usuario" },
        { category: "Area", label: "Area fisica estimada da garagem", quantity: Number(garageArea.toFixed(2)), unit: "m2", confidence: "medium", basis: `${building.garage_spaces || 0} vaga(s) x ${parameters.equivalent_area_coefficients?.garage_area_per_space || 13.5} m2.` },
        { category: "Area", label: "Area fisica total estimada", quantity: Number(physicalArea.toFixed(2)), unit: "m2", confidence: "high", basis: "Casa + garagem + varandas + subsolo." },
        { category: "Area", label: "Area equivalente", quantity: Number(equivalentArea.toFixed(2)), unit: "m2-eq", confidence: "medium", basis: "Coeficientes parametricos" },
        { category: "Geometria", label: "Projecao aproximada da casa", quantity: Number(projectionArea.toFixed(2)), unit: "m2", confidence: "medium", basis: "Area principal dividida pelo numero de pavimentos." },
        { category: "Geometria", label: "Perimetro externo estimado", quantity: Number(perimeter.toFixed(2)), unit: "m", confidence: "low", basis: "Planta equivalente quadrada ajustada pela complexidade." },
        { category: "Vedacoes", label: "Area estimada de fachadas", quantity: Number(facadeArea.toFixed(2)), unit: "m2", confidence: "low", basis: "Perimetro x pe-direito x pavimentos." },
        { category: "Vedacoes", label: "Faces de paredes internas", quantity: Number(internalWallFaces.toFixed(2)), unit: "m2", confidence: "low", basis: "Coeficiente por area e quantidade de ambientes." },
        { category: "Vedacoes", label: "Area total de paredes direcionadora", quantity: Number(wallGuideArea.toFixed(2)), unit: "m2", confidence: "low", basis: "Fachadas + faces internas + parcela de subsolo." },
        { category: "Estrutura", label: "Area equivalente de fundacoes", quantity: Number(foundationArea.toFixed(2)), unit: "m2", confidence: "low", basis: "Projecao, garagem, varandas e subsolo." },
        { category: "Estrutura", label: "Area estrutural equivalente", quantity: Number(structuralArea.toFixed(2)), unit: "m2", confidence: "medium", basis: "Areas cobertas ponderadas por esforco estrutural." },
        { category: "Estrutura", label: "Volume preliminar de concreto", quantity: Number(concreteVolume.toFixed(2)), unit: "m3", confidence: "low", basis: "Coeficiente por sistema aplicado a area estrutural." },
        { category: "Estrutura", label: "Massa estrutural equivalente de aco", quantity: Number(steelMass.toFixed(2)), unit: "kg", confidence: "low", basis: "Coeficiente por sistema; nao serve para compra." },
        { category: "Terreno", label: "Movimentacao de terra preliminar", quantity: Number(earthVolume.toFixed(2)), unit: "m3", confidence: "low", basis: "Projecao x classe de inclinacao + subsolo." },
        { category: "Cobertura", label: "Area efetiva estimada da cobertura", quantity: Number(roofArea.toFixed(2)), unit: "m2", confidence: "medium", basis: "Projecao coberta x multiplicador da solucao." },
        { category: "Impermeabilizacao", label: "Area equivalente de impermeabilizacao", quantity: Number(waterproofArea.toFixed(2)), unit: "m2", confidence: "low", basis: "Areas molhadas, varandas, subsolo e cobertura." },
        { category: "Esquadrias", label: "Area estimada de esquadrias e vidros", quantity: Number(windowArea.toFixed(2)), unit: "m2", confidence: "low", basis: "Percentual da area principal conforme padrao de vaos." },
        { category: "Esquadrias", label: "Quantidade estimada de portas", quantity: doorCount, unit: "un", confidence: "medium", basis: "Programa de ambientes + portas de acesso e servico." },
        { category: "Instalacoes", label: "Pontos eletricos estimados", quantity: electricalPoints, unit: "pt", confidence: "low", basis: "Area, quartos, banheiros, climatizacao e automacao." },
        { category: "Instalacoes", label: "Pontos hidraulicos estimados", quantity: plumbingPoints, unit: "pt", confidence: "medium", basis: "Banheiros, cozinha, lavanderia e complementos." },
        { category: "Instalacoes", label: "Pontos equivalentes de instalacoes", quantity: Number(installationPoints.toFixed(2)), unit: "pt-eq", confidence: "low", basis: "Pontos eletricos + hidraulicos ponderados." },
        { category: "Acabamentos", label: "Area de pisos molhados", quantity: Number(wetFloorArea.toFixed(2)), unit: "m2", confidence: "medium", basis: "Programa de banheiros, cozinha, lavanderia e gourmet." },
        { category: "Acabamentos", label: "Area de revestimentos em paredes molhadas", quantity: Number(wetWallArea.toFixed(2)), unit: "m2", confidence: "low", basis: "Coeficientes por ambiente molhado." },
        { category: "Acabamentos", label: "Area total de pisos e revestimentos de piso", quantity: Number(physicalArea.toFixed(2)), unit: "m2", confidence: "high", basis: "Casa, subsolo, varandas e garagem." },
        { category: "Acabamentos", label: "Area estimada de tetos e forros", quantity: Number(ceilingArea.toFixed(2)), unit: "m2", confidence: "medium", basis: "Areas internas e parcelas cobertas externas." },
        { category: "Acabamentos", label: "Area estimada de pintura", quantity: Number(paintingArea.toFixed(2)), unit: "m2", confidence: "low", basis: "Paredes e tetos menos revestimentos molhados." }
      ],
      sensitivity: sensitivityItems.slice(0, 14),
      warnings: [
        "Valores demonstrativos e preliminares, sem substituicao de orcamento analitico.",
        terrain.soil_report ? "Sondagem informada pelo usuario." : "Sem sondagem: fundacoes e contencoes possuem maior incerteza.",
        priceBase.scope === "state" && request.location?.city ? `Nao ha base municipal ativa para ${request.location.city}; foi usada base estadual de ${request.location?.state || "-"}.` : "Base de precos selecionada conforme dados informados."
      ],
      recommendations: [
        "Conferir area, padrao de acabamento, sistemas construtivos e condicionantes do terreno.",
        "Atualizar bases de preco com fontes tecnicas regionais antes de tomada de decisao.",
        "Realizar sondagem e levantamento topografico antes de consolidar o orcamento.",
        "Comparar padroes de acabamento por ambiente para localizar economias sem reduzir toda a especificacao.",
        "Compactar perimetro e recortes reduz paredes, fachadas, estrutura e cobertura.",
        extras.pool || extras.landscaping_area ? "Executar piscina e paisagismo em fase posterior reduz o desembolso inicial." : "Avaliar complementos em etapas futuras conforme disponibilidade orcamentaria."
      ],
      assumptions: [
        "A area principal exclui garagem, varandas, piscina e subsolo.",
        `Cada vaga de garagem foi estimada em ${parameters.equivalent_area_coefficients?.garage_area_per_space || 13.5} m2.`,
        "Os quantitativos intermediarios sao aproximacoes parametricas e nao substituem levantamento de projeto.",
        `A compatibilidade area x programa usa o metodo ${compatibility.method_version} e nao substitui estudo arquitetonico.`,
        "Cada subsistema usa um quantitativo direcionador, um benchmark de custo e apenas os fatores tecnicamente expostos.",
        "O custo tecnico reune a execucao fisica; o investimento total acrescenta projetos, indiretos/BDI, contingencia e verbas externas informadas.",
        "A faixa minimo-maximo representa incerteza parametrica preliminar, nao intervalo estatistico certificado.",
        parameters.notice || "Parametros demonstrativos.",
        "Modelo executado integralmente no navegador para publicacao estatica."
      ],
      factors: factorResults
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
    if (path === "/api/report.pdf") return pdfReportResponse(readBody(options), await estimate(readBody(options)));

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
      if (action === "report.pdf") return pdfReportResponse(record.input, record.result);
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
