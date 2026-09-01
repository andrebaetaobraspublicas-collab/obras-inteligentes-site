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
    row("Confiabilidade", confidenceText(result.confidence));
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

  function wrapPdfText(line, fontSize = 10, width = 460) {
    const capacity = Math.max(12, Math.floor(width / (fontSize * 0.48)));
    const words = String(line || " ").split(/\s+/);
    const output = [];
    let current = "";
    for (const word of words) {
      if (!current) {
        current = word;
      } else if ((current.length + word.length + 1) <= capacity) {
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
    const margin = 42;
    const contentWidth = pageWidth - margin * 2;
    const sectionTitles = new Set([
      "Resumo executivo",
      "Base de precos utilizada",
      "Premissas do imovel",
      "Compatibilidade entre area e programa",
      "Separacao entre custo tecnico e investimento total",
      "Custo tecnico por subsistema",
      "Quantitativos parametricos intermediarios",
      "Fatores aplicados",
      "Principais impactos",
      "Alertas",
      "Recomendacoes",
      "Premissas e limitacoes"
    ]);
    const pages = [];
    let page = [];
    let y = pageHeight - 86;

    const color = {
      ink: "0.09 0.14 0.20",
      muted: "0.36 0.43 0.50",
      blue: "0.04 0.25 0.43",
      cyan: "0.00 0.54 0.62",
      line: "0.82 0.86 0.88",
      soft: "0.93 0.97 0.98",
      pale: "0.98 0.99 0.99",
      white: "1 1 1",
      warn: "0.99 0.93 0.82"
    };

    const newPage = () => {
      if (page.length) pages.push(page);
      page = [];
      y = pageHeight - 86;
    };
    const ensure = (height) => {
      if (y - height < 58) newPage();
    };
    const rect = (x, rectY, w, h, fill = null, stroke = null) => {
      if (fill) page.push(`${fill} rg ${x} ${rectY} ${w} ${h} re f`);
      if (stroke) page.push(`${stroke} RG ${x} ${rectY} ${w} ${h} re S`);
    };
    const text = (value, x, textY, size = 10, font = "F1", fill = color.ink) => {
      page.push(`BT ${fill} rg /${font} ${size} Tf ${x} ${textY} Td (${pdfEscape(value)}) Tj ET`);
    };
    const paragraph = (value, options = {}) => {
      const size = options.size || 9.2;
      const x = options.x || margin;
      const width = options.width || contentWidth;
      const font = options.font || "F1";
      const fill = options.fill || color.ink;
      const leading = options.leading || size * 1.42;
      const wrapped = wrapPdfText(value, size, width);
      ensure(wrapped.length * leading + 4);
      wrapped.forEach((line) => {
        text(line, x, y, size, font, fill);
        y -= leading;
      });
      y -= options.after ?? 2;
    };
    const section = (value) => {
      ensure(34);
      y -= 6;
      rect(margin, y - 17, contentWidth, 22, color.blue);
      text(value, margin + 10, y - 11, 10.5, "F2", color.white);
      y -= 31;
    };
    const keyValue = (line, shaded = false) => {
      const parts = line.split(/:\s+/);
      if (parts.length < 2) return paragraph(line);
      const label = parts.shift();
      const value = parts.join(": ");
      const labelWidth = 138;
      const valueWidth = contentWidth - labelWidth - 22;
      const wrapped = wrapPdfText(value, 8.8, valueWidth);
      const height = Math.max(19, wrapped.length * 12 + 8);
      ensure(height + 2);
      if (shaded) rect(margin, y - height + 5, contentWidth, height, color.pale, color.line);
      text(label, margin + 8, y - 8, 8.4, "F2", color.muted);
      wrapped.forEach((row, index) => text(row, margin + labelWidth, y - 8 - index * 12, 8.8, "F1", color.ink));
      y -= height;
    };
    const tableRow = (line, index = 0) => {
      const cells = line.split(" | ");
      if (cells.length < 2) return paragraph(line);
      const widths = cells.length >= 5 ? [100, 92, 94, 80, 148] :
        cells.length === 4 ? [170, 72, 92, 170] :
        cells.length === 3 ? [210, 90, 210] : [160, 340];
      const normalizedWidths = widths.slice(0, cells.length);
      const total = normalizedWidths.reduce((a, b) => a + b, 0);
      const scale = contentWidth / total;
      const scaled = normalizedWidths.map((w) => w * scale);
      const wrappedCells = cells.map((cell, cellIndex) => wrapPdfText(cell, 7.2, Math.max(42, scaled[cellIndex] - 10)));
      const rows = Math.max(...wrappedCells.map((cell) => cell.length));
      const height = Math.max(19, rows * 9.8 + 8);
      ensure(height + 2);
      rect(margin, y - height + 5, contentWidth, height, index % 2 ? color.pale : color.soft, color.line);
      let x = margin;
      cells.forEach((_, cellIndex) => {
        const cellLines = wrappedCells[cellIndex];
        if (cellIndex > 0) page.push(`${color.line} RG ${x} ${y - height + 5} m ${x} ${y + 5} l S`);
        cellLines.forEach((row, rowIndex) => text(row, x + 5, y - 7 - rowIndex * 9.8, 7.2, cellIndex === 0 ? "F2" : "F1", color.ink));
        x += scaled[cellIndex];
      });
      y -= height;
    };
    const metricGrid = (rows) => {
      const metrics = rows.map((line) => {
        const [label, ...rest] = line.split(/:\s+/);
        return { label, value: rest.join(": ") };
      });
      for (let i = 0; i < metrics.length; i += 2) {
        const pair = metrics.slice(i, i + 2);
        ensure(47);
        pair.forEach((item, index) => {
          const x = margin + index * (contentWidth / 2 + 6);
          const w = contentWidth / 2 - 6;
          rect(x, y - 39, w, 38, color.soft, color.line);
          text(item.label, x + 10, y - 13, 7.8, "F2", color.muted);
          text(item.value, x + 10, y - 29, 11.2, "F2", color.blue);
        });
        y -= 45;
      }
    };

    const subtitle = lines[0] || "Casa Parametrica - Relatorio preliminar";
    const projectName = lines[2] || title;
    const metadata = lines[3] || "";
    paragraph(subtitle, { size: 9, fill: color.muted, after: 6 });
    paragraph(projectName, { size: 20, font: "F2", fill: color.blue, leading: 24, after: 2 });
    paragraph(metadata, { size: 8.8, fill: color.muted, after: 12 });

    for (let index = 4; index < lines.length; index += 1) {
      const line = lines[index];
      if (!line) {
        y -= 4;
        continue;
      }
      if (sectionTitles.has(line)) {
        section(line);
        if (line === "Resumo executivo") {
          const metricRows = [];
          let scan = index + 1;
          while (scan < lines.length && lines[scan] && !sectionTitles.has(lines[scan])) {
            if (lines[scan].includes(": ")) metricRows.push(lines[scan]);
            scan += 1;
          }
          metricGrid(metricRows);
          index = scan - 1;
        }
        continue;
      }
      if (line.startsWith("- ")) {
        paragraph(`• ${line.slice(2)}`, { x: margin + 10, width: contentWidth - 10, size: 8.6, fill: color.ink });
      } else if (line.includes(" | ")) {
        tableRow(line, index);
      } else if (line.includes(": ")) {
        keyValue(line, index % 2 === 0);
      } else if (/^[A-Z0-9 .:-]+$/.test(line) && line.length < 52) {
        paragraph(line, { size: 9.2, font: "F2", fill: color.blue });
      } else {
        paragraph(line, { size: 8.8, fill: color.ink });
      }
    }
    if (page.length) pages.push(page);

    const contentStreams = pages.map((bodyCommands, index) => {
      const header = [
        `${color.blue} rg 0 ${pageHeight - 46} ${pageWidth} 46 re f`,
        `${color.cyan} rg 0 ${pageHeight - 49} ${pageWidth} 3 re f`,
        `BT ${color.white} rg /F2 12 Tf ${margin} ${pageHeight - 28} Td (Casa Parametrica) Tj ET`,
        `BT 0.78 0.88 0.92 rg /F1 8 Tf ${pageWidth - margin - 155} ${pageHeight - 28} Td (Estimativa parametrica preliminar) Tj ET`
      ];
      const footer = [
        `${color.line} RG ${margin} 42 m ${pageWidth - margin} 42 l S`,
        `BT ${color.muted} rg /F1 7.5 Tf ${margin} 28 Td (Relatorio gerado automaticamente. Conferencia obrigatoria por profissional habilitado.) Tj ET`,
        `BT ${color.muted} rg /F1 7.5 Tf ${pageWidth - margin - 48} 28 Td (Pagina ${index + 1}/${pages.length}) Tj ET`
      ];
      return [...header, ...bodyCommands, ...footer].join("\n");
    });

    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      `<< /Type /Pages /Kids [${contentStreams.map((_, index) => `${3 + index * 2} 0 R`).join(" ")}] /Count ${contentStreams.length} >>`
    ];
    contentStreams.forEach((stream, index) => {
      const pageObjectNumber = 3 + index * 2;
      const contentObjectNumber = pageObjectNumber + 1;
      objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${3 + contentStreams.length * 2} 0 R /F2 ${4 + contentStreams.length * 2} 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`);
      objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    });
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

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

    // Le a configuracao do JSON quando ja carregada (rota sincrona).
    const cfg = (parametersCache && parametersCache.program_area_compatibility) || {};
    const n = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);
    const socialCore = cfg.social_core_by_bedrooms || {};
    const bedKey = Math.min(4, bedrooms);
    const social = n(socialCore[String(bedKey)], 20 + bedrooms * 4) +
      Math.max(0, bedrooms - 4) * n(cfg.social_core_extra_bedroom_m2, 4);
    const plainBedrooms = Math.max(0, bedrooms - suites);
    const bedroomsArea = plainBedrooms * n(cfg.bedroom_m2, 10.5) + suites * n(cfg.suite_bedroom_m2, 13);
    const bathsArea = bathrooms * n(cfg.full_bath_m2, 4.2) + halfBaths * n(cfg.half_bath_m2, 2);
    const serviceArea = n(cfg.service_base_m2, 6) + bedrooms * n(cfg.service_per_bedroom_m2, 0.65);
    const storageArea = n(cfg.storage_base_m2, 2.5) + bedrooms * n(cfg.storage_per_bedroom_m2, 0.5);
    const gourmetArea = gourmet ? n(cfg.gourmet_m2, 15) : 0;
    const stairArea = floors > 1
      ? n(cfg.stair_first_extra_floor_m2, 8) + Math.max(0, floors - 2) * n(cfg.stair_additional_floor_m2, 3.5)
      : 0;
    const rooms = social + bedroomsArea + bathsArea + serviceArea + storageArea + gourmetArea + stairArea;
    const circulationFactors = cfg.circulation_wall_factors ||
      { compacta: 0.17, regular: 0.2, articulada: 0.23, complexa: 0.26 };
    const circulation = rooms * (n(circulationFactors[complexity], 0.2));
    const minimum = rooms + circulation;

    const minimumRatio = n(cfg.minimum_ratio, 0.91);
    const recommendedMaxRatio = n(cfg.recommended_max_ratio, 1.22);
    const generousLimitRatio = n(cfg.generous_limit_ratio, 1.25);
    const minimumArea = Math.max(45, minimum * minimumRatio);
    const recommendedMin = minimum;
    const recommendedMax = minimum * recommendedMaxRatio;
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
    } else if (area > recommendedMax * generousLimitRatio) {
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
      method_version: cfg.method_version || "programa-area-v1-2026.07",
      disclaimer: "Faixa orientativa; nao substitui estudo arquitetonico.",
      suggestions: [
        area < recommendedMin ? "Revise o programa de necessidades ou aumente a area principal." : "Valide a distribuicao dos ambientes com profissional habilitado.",
        "Considere circulacoes, areas tecnicas, afastamentos e condicionantes do terreno.",
        "Use a estimativa como apoio preliminar antes do orcamento analitico."
      ],
      components: [
        { label: "Nucleo social", area: Number(social.toFixed(1)), note: "Estar, jantar e cozinha" },
        { label: "Dormitorios", area: Number(bedroomsArea.toFixed(1)), note: `${plainBedrooms} quarto(s) + ${suites} suite(s)` },
        { label: "Banheiros e servico", area: Number((bathsArea + serviceArea + storageArea).toFixed(1)), note: "Banhos, area de servico e depositos" },
        { label: "Circulacao", area: Number(circulation.toFixed(1)), note: complexity },
        { label: "Faixa recomendada", area: Number(recommendedMin.toFixed(1)), note: "Inicio da faixa confortavel" }
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Motor de estimativa revisado (2026.08)
  //
  // Correcoes principais em relacao a versao anterior:
  //  1. Fim da cascata multiplicativa global. Cada fator passa a incidir apenas
  //     sobre os subsistemas expostos a ele, via parameters.subsystem_factor_exposure.
  //     custo_subsistema = base_neutra * peso_subsistema * (1 + Somatorio(exposicao*(fator-1)))
  //  2. Custo-base reancorado: o caso de referencia (todos os fatores = 1) resulta
  //     em base_cost_m2 efetivo, sem inflacao silenciosa por UF/telha.
  //  3. Leitura integral do JSON de parametros: custos especificos, taxas,
  //     coeficientes de concreto/aco/terraplenagem e fatores vem de "parameters".
  //     Nenhum valor monetario fica hardcoded no motor.
  //  4. Area equivalente serve apenas de referencia informativa. O custo direto
  //     e formado pela soma dos subsistemas (evita dupla contagem de garagem/
  //     subsolo/varanda, que antes entrava na area equivalente E nos quantitativos).
  //  5. Contingencia respeita base_contingency e max_contingency do JSON.
  // ---------------------------------------------------------------------------
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

    const num = (value, fallback = 0) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const coeff = parameters.quantity_coefficients || {};
    const specific = parameters.specific_costs || {};
    const rates = parameters.rates || {};
    const eqCoeff = parameters.equivalent_area_coefficients || {};

    const mainArea = num(building.built_area);
    const floors = Math.max(1, num(building.floors, 1));
    const balconiesArea = num(building.balconies_area);
    const basementArea = num(building.basement_area);
    const doubleHeightArea = num(building.double_height_area);
    const garageArea = num(building.garage_spaces) * num(eqCoeff.garage_area_per_space, 13.5);

    // Area equivalente: mantida apenas como referencia informativa e para prazos.
    const equivalentArea = mainArea +
      balconiesArea * num(eqCoeff.balcony, 0.58) +
      basementArea * num(eqCoeff.basement, 1.3) +
      doubleHeightArea * num(eqCoeff.double_height_extra, 0.27) +
      garageArea * (building.garage_covered ? num(eqCoeff.garage_covered, 0.48) : num(eqCoeff.garage_uncovered, 0.22));

    // -------------------------------------------------------------------------
    // Fatores individuais (todos vindos do JSON). Guardamos a chave "canonica"
    // usada pelo mapa de exposicao por subsistema.
    // -------------------------------------------------------------------------
    const factorItems = [
      ["UF", "region", parameters.region_factors?.[request.location?.state] || 1],
      ["Padrao de acabamento", "finish", parameters.finish_factors?.[construction.finish] || 1],
      ["Sistema construtivo", "system", parameters.system_factors?.[construction.system] || 1],
      ["Cobertura", "roof", parameters.roof_factors?.[construction.roof] || 1],
      ["Piso", "flooring", parameters.flooring_factors?.[construction.flooring] || 1],
      ["Esquadrias", "windows", parameters.window_factors?.[construction.windows] || 1],
      ["Declividade", "slope", parameters.slope_factors?.[terrain.slope] || 1],
      ["Solo", "soil", parameters.soil_factors?.[terrain.soil] || 1],
      ["Acesso", "access", parameters.access_factors?.[terrain.access] || 1],
      ["Pavimentos", "floors", parameters.floors_factors?.[String(building.floors || 1)] || 1],
      ["Complexidade", "complexity", parameters.complexity_factors?.[building.complexity] || 1]
    ];
    const factorByKey = Object.fromEntries(factorItems.map(([, key, value]) => [key, value]));

    // UF (regiao) incide sobre TODOS os subsistemas (custo de mao de obra/insumo
    // regional). Os demais fatores incidem conforme a exposicao declarada.
    const regionFactor = factorByKey.region || 1;
    const baseCost = num(priceBase.base_cost_m2 || parameters.base_cost_m2, 3200);
    const subsystemWeights = parameters.subsystem_weights || parameters.phase_weights || {};
    const exposureMap = parameters.subsystem_factor_exposure || {};

    // Quantitativos direcionadores (para exibicao e custo unitario aparente).
    const projectionArea = mainArea / floors;
    const physicalArea = mainArea + garageArea + balconiesArea + basementArea;
    const complexityPerimeter = (coeff.perimeter_shape_factors || {})[building.complexity] || 1.08;
    const ceilingHeight = num(coeff.average_ceiling_height_m, 2.8);
    const perimeter = Math.sqrt(Math.max(1, projectionArea)) * 4 * complexityPerimeter;
    const facadeArea = perimeter * ceilingHeight * floors + doubleHeightArea * 1.4;
    const internalWallFaces = mainArea * (num(coeff.internal_wall_face_m2_per_built_m2, 1.72)) +
      (num(program.bedrooms) + num(program.bathrooms)) * num(coeff.internal_wall_room_addition_m2, 4.2);
    const wallGuideArea = facadeArea + internalWallFaces + basementArea * 0.9;
    const foundationArea = projectionArea +
      garageArea * num(coeff.foundation_garage_share, 0.72) +
      balconiesArea * num(coeff.foundation_balcony_share, 0.4) +
      basementArea * 0.65;
    const structuralArea = mainArea +
      garageArea * num(coeff.structure_garage_share, 0.58) +
      balconiesArea * num(coeff.structure_balcony_share, 0.72) +
      basementArea * 1.15 + doubleHeightArea * 0.25;
    const roofMultipliers = coeff.roof_area_multipliers || {};
    const roofArea = projectionArea * (roofMultipliers[construction.roof] || 1.12) +
      balconiesArea * num(coeff.roof_balcony_coverage_share, 0.72);
    const earthMap = coeff.earthwork_m3_per_footprint || {};
    const earthVolume = projectionArea * (earthMap[terrain.slope] || 0.45) +
      basementArea * num(coeff.basement_excavation_depth_m, 3.1);
    const concreteMap = coeff.concrete_m3_per_structural_m2 || {};
    const concreteVolume = structuralArea * (concreteMap[construction.system] || 0.095);
    const steelMap = coeff.structural_steel_kg_per_m2 || {};
    const steelMass = structuralArea * (steelMap[construction.system] || 13);
    const wetFloorArea = num(program.bathrooms) * num(coeff.wet_floor_full_bath_m2, 4.6) +
      num(program.half_baths) * num(coeff.wet_floor_half_bath_m2, 2.1) +
      num(coeff.wet_floor_kitchen_laundry_m2, 17) +
      (program.gourmet_area ? num(coeff.wet_floor_gourmet_m2, 7) : 0);
    const wetWallArea = num(program.bathrooms) * num(coeff.wet_wall_full_bath_m2, 22) +
      num(program.half_baths) * num(coeff.wet_wall_half_bath_m2, 9) +
      num(coeff.wet_wall_kitchen_laundry_m2, 19) +
      (program.gourmet_area ? num(coeff.wet_wall_gourmet_m2, 8) : 0);
    const waterproofArea = wetFloorArea + balconiesArea * 0.55 +
      basementArea * num(coeff.waterproofing_basement_m2_per_m2, 1.35) +
      (construction.roof === "laje_impermeabilizada" ? roofArea * 0.7 : roofArea * 0.12);
    const windowRatios = coeff.window_area_ratios || {};
    const windowArea = mainArea * (windowRatios[construction.windows] || 0.15);
    const doorCount = Math.max(4, num(program.bedrooms) + num(program.bathrooms) + num(program.half_baths) +
      num(coeff.door_base_count, 3) + Math.max(0, floors - 1) * num(coeff.door_per_floor_above_one, 1));
    const electricalPoints = Math.round(mainArea * num(coeff.electrical_points_per_built_m2, 0.38) +
      num(coeff.electrical_base_points, 12) +
      num(program.bedrooms) * num(coeff.electrical_points_per_bedroom, 2) +
      num(program.bathrooms) * num(coeff.electrical_points_per_bathroom, 2.5) +
      (program.gourmet_area ? num(coeff.electrical_points_gourmet, 5) : 0) +
      (extras.automation ? num(coeff.electrical_points_automation, 9) : 0));
    const plumbingPoints = Math.round(num(program.bathrooms) * num(coeff.hydraulic_points_full_bath, 5) +
      num(program.half_baths) * num(coeff.hydraulic_points_half_bath, 2) +
      num(coeff.hydraulic_points_kitchen_laundry, 9) +
      (program.gourmet_area ? num(coeff.hydraulic_points_gourmet, 3) : 0) +
      (extras.pool ? num(coeff.hydraulic_points_pool, 3) : 0) +
      (extras.rainwater_reuse ? num(coeff.hydraulic_points_reuse, 3) : 0));
    const installationPoints = electricalPoints + plumbingPoints * 1.25 + num(extras.air_conditioned_rooms) * 3;
    const ceilingArea = mainArea + basementArea * 0.9 +
      garageArea * num(coeff.ceiling_covered_garage_share, 0.85) * (building.garage_covered ? 1 : 0) +
      balconiesArea * num(coeff.ceiling_balcony_share, 0.65);
    const paintingArea = Math.max(0, wallGuideArea + ceilingArea - wetWallArea * num(coeff.paint_wet_wall_deduction_share, 0.82));

    // -------------------------------------------------------------------------
    // Custo direto por subsistema, com exposicao seletiva a fatores.
    //  - base_neutra = mainArea * baseCost * regionFactor
    //  - cada subsistema recebe seu peso e um multiplicador aditivo proprio
    // Assim, "acabamento superior" NAO encarece fundacao, "declividade" NAO
    // encarece esquadrias, etc. O produto cheio de 11 fatores deixa de existir.
    // -------------------------------------------------------------------------
    const neutralBase = mainArea * baseCost * regionFactor;
    const subsystemDrivers = {
      "Serviços preliminares e canteiro": { quantity: physicalArea, unit: "m2", basis: "Area fisica total estimada." },
      "Terraplenagem e fundações": { quantity: foundationArea, unit: "m2", basis: "Projecao, garagem, varandas e subsolo." },
      "Estrutura": { quantity: structuralArea, unit: "m2", basis: "Areas cobertas ponderadas por esforco estrutural." },
      "Vedações e alvenarias": { quantity: wallGuideArea, unit: "m2", basis: "Fachadas + faces internas + parcela de subsolo." },
      "Cobertura": { quantity: roofArea, unit: "m2", basis: "Projecao coberta x solucao de cobertura." },
      "Impermeabilização": { quantity: waterproofArea, unit: "m2", basis: "Areas molhadas, varandas, subsolo e cobertura." },
      "Esquadrias e vidros": { quantity: windowArea, unit: "m2", basis: "Percentual da area principal conforme padrao de vaos." },
      "Instalações elétricas e hidráulicas": { quantity: installationPoints, unit: "pt-eq", basis: "Pontos eletricos + hidraulicos ponderados." },
      "Pisos e revestimentos": { quantity: physicalArea, unit: "m2", basis: "Casa, subsolo, varandas e garagem." },
      "Pintura, acabamentos e entrega": { quantity: paintingArea, unit: "m2", basis: "Paredes e tetos menos revestimentos molhados." }
    };

    const subsystemBreakdown = [];
    let directCore = 0;
    let weightedFactorNumerator = 0;
    let weightSum = 0;
    Object.entries(subsystemDrivers).forEach(([category, driver]) => {
      const weight = num(subsystemWeights[category]);
      if (weight <= 0) return;
      const exposure = exposureMap[category] || {};
      // multiplicador aditivo: 1 + Somatorio(exposicao_key * (fator_key - 1))
      let multiplier = 1;
      Object.entries(exposure).forEach(([key, share]) => {
        const factorValue = factorByKey[key];
        if (factorValue === undefined) return;
        multiplier += num(share) * (factorValue - 1);
      });
      multiplier = Math.max(0.35, multiplier); // piso de seguranca contra fatores negativos exagerados
      const amount = neutralBase * weight * multiplier;
      directCore += amount;
      weightedFactorNumerator += weight * multiplier * regionFactor;
      weightSum += weight;
      subsystemBreakdown.push({
        kind: "direct",
        category,
        quantity: Number(driver.quantity.toFixed(2)),
        unit: driver.unit,
        unit_cost: Number((amount / Math.max(1, driver.quantity)).toFixed(2)),
        amount: Number(amount.toFixed(2)),
        _multiplier: multiplier,
        basis: driver.basis
      });
    });
    // Fator global efetivo (medio ponderado) apenas para exibicao/telemetria.
    const globalFactor = weightSum > 0 ? weightedFactorNumerator / weightSum : regionFactor;

    // -------------------------------------------------------------------------
    // Itens especificos (todos do JSON specific_costs / rates).
    // -------------------------------------------------------------------------
    const poolCost = extras.pool ? num(extras.pool_area) * num(specific.pool_m2, 4300) : 0;
    const landscapingCost = num(extras.landscaping_area) * num(specific.landscaping_m2, 310);
    const retainingCost = num(terrain.retaining_wall_area) * num(specific.retaining_wall_m2, 1850);
    const demolitionCost = num(terrain.demolition_area) * num(specific.demolition_m2, 175);
    const solarCost = extras.solar ? num(specific.solar_system, 36000) : 0;
    const acCost = num(extras.air_conditioned_rooms) * num(specific.air_conditioned_room, 7200);
    const elevatorCost = extras.elevator ? num(specific.elevator, 128000) : 0;
    const evChargerCost = extras.ev_charger ? num(specific.ev_charger, 7200) : 0;
    const rainwaterCost = extras.rainwater_reuse ? num(specific.rainwater_reuse, 19500) : 0;
    // Automacao: percentual do custo direto (JSON rates.automation_percent).
    const automationCost = extras.automation ? directCore * num(rates.automation_percent, 0.028) : 0;
    const extrasCost = solarCost + automationCost + acCost + elevatorCost + evChargerCost + rainwaterCost;
    const technicalCost = directCore + poolCost + landscapingCost + retainingCost + demolitionCost + extrasCost;

    // -------------------------------------------------------------------------
    // Investimento total (taxas do JSON).
    // -------------------------------------------------------------------------
    const designsRate = num(rates.designs, 0.055);
    const indirectsRate = num(rates.indirects_bdi, 0.125);
    const baseContingency = num(rates.base_contingency, 0.065) * 100;
    const maxContingency = num(rates.max_contingency, 0.16) * 100;
    const designsCost = costs.include_designs ? technicalCost * designsRate : 0;
    const indirectCost = costs.include_indirects ? technicalCost * indirectsRate : 0;
    const riskAdd = (terrain.soil_report ? 0 : 3) +
      (terrain.slope === "muito_inclinado" ? 2 : 0) +
      (terrain.soil === "mole" ? 2 : 0) +
      (building.complexity === "complexa" ? 1.5 : 0);
    const contingencyPercent = costs.include_contingency ? Math.min(maxContingency, baseContingency + riskAdd) : 0;
    const contingencyCost = technicalCost * contingencyPercent / 100;
    const other = num(costs.other_investment_costs);
    const investmentTotal = technicalCost + designsCost + indirectCost + contingencyCost + other;
    const uncertaintyPercent = 18 + (terrain.soil_report ? 0 : 5) +
      (building.complexity === "complexa" ? 2 : 0) +
      (terrain.slope === "muito_inclinado" ? 2 : 0);

    const compatibility = programCompatibility({
      built_area: mainArea,
      floors: building.floors,
      complexity: building.complexity,
      program: request.program || {}
    });

    // Itens especificos para o breakdown (todos do JSON).
    const optionalBreakdown = [
      { kind: "specific", category: "Demolicao", quantity: num(terrain.demolition_area), unit: "m2", unit_cost: num(specific.demolition_m2, 175), amount: Number(demolitionCost.toFixed(2)), basis: "Area informada pelo usuario." },
      { kind: "specific", category: "Muros de contencao informados", quantity: num(terrain.retaining_wall_area), unit: "m2", unit_cost: num(specific.retaining_wall_m2, 1850), amount: Number(retainingCost.toFixed(2)), basis: "Area informada pelo usuario." },
      { kind: "specific", category: "Piscina", quantity: num(extras.pool_area), unit: "m2", unit_cost: num(specific.pool_m2, 4300), amount: Number(poolCost.toFixed(2)), basis: "Item opcional." },
      { kind: "specific", category: "Paisagismo", quantity: num(extras.landscaping_area), unit: "m2", unit_cost: num(specific.landscaping_m2, 310), amount: Number(landscapingCost.toFixed(2)), basis: "Item opcional." },
      { kind: "specific", category: "Sistema fotovoltaico preliminar", quantity: extras.solar ? 1 : 0, unit: "conj.", unit_cost: num(specific.solar_system, 36000), amount: Number(solarCost.toFixed(2)), basis: "Verba parametrica preliminar." },
      { kind: "specific", category: "Automacao residencial", quantity: extras.automation ? 1 : 0, unit: "vb", unit_cost: Number(automationCost.toFixed(2)), amount: Number(automationCost.toFixed(2)), basis: `Percentual de ${(num(rates.automation_percent, 0.028) * 100).toFixed(1)}% sobre o custo direto.` },
      { kind: "specific", category: "Climatizacao", quantity: num(extras.air_conditioned_rooms), unit: "amb.", unit_cost: num(specific.air_conditioned_room, 7200), amount: Number(acCost.toFixed(2)), basis: "Ambientes climatizados informados." },
      { kind: "specific", category: "Elevador residencial", quantity: extras.elevator ? 1 : 0, unit: "un", unit_cost: num(specific.elevator, 128000), amount: Number(elevatorCost.toFixed(2)), basis: "Item opcional." },
      { kind: "specific", category: "Carregador para veiculo eletrico", quantity: extras.ev_charger ? 1 : 0, unit: "un", unit_cost: num(specific.ev_charger, 7200), amount: Number(evChargerCost.toFixed(2)), basis: "Item opcional." },
      { kind: "specific", category: "Reaproveitamento de agua pluvial", quantity: extras.rainwater_reuse ? 1 : 0, unit: "conj.", unit_cost: num(specific.rainwater_reuse, 19500), amount: Number(rainwaterCost.toFixed(2)), basis: "Item opcional." }
    ].filter((item) => item.amount > 0);

    // -------------------------------------------------------------------------
    // Impacto de cada fator: quanto o custo direto muda ao zerar (fator=1) aquele
    // fator em todos os subsistemas expostos. Coerente com o novo modelo aditivo.
    // -------------------------------------------------------------------------
    const factorResults = factorItems.map(([label, key, value]) => {
      let impact = 0;
      subsystemBreakdown.forEach((item) => {
        const exposure = exposureMap[item.category] || {};
        const share = key === "region" ? 1 : num(exposure[key]);
        if (!share) return;
        if (key === "region") {
          // regiao multiplica tudo: impacto = amount * (1 - 1/fator)
          impact += item.amount * (1 - 1 / (value || 1));
        } else {
          // aditivo: parcela do amount atribuivel a (share*(fator-1))
          const multiplier = item._multiplier || 1;
          impact += item.amount * (share * (value - 1)) / multiplier;
        }
      });
      return { label, value, impact: Number(impact.toFixed(2)) };
    });

    const sensitivityItems = [
      ...factorResults.map((item) => ({ label: item.label, impact: Math.abs(item.impact), direction: item.impact < 0 ? "decrease" : "increase" })),
      ...optionalBreakdown.map((item) => ({ label: item.category, impact: item.amount, direction: "increase" }))
    ].filter((item) => item.impact > 0).sort((a, b) => b.impact - a.impact);

    // Limpa campos internos antes de expor o breakdown.
    const cleanSubsystemBreakdown = subsystemBreakdown.map(({ _multiplier, ...rest }) => rest);

    return {
      parameter_version: parameters.version || "2026.08-demo",
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
      contingency_percent: Number(contingencyPercent.toFixed(2)),
      formula_summary: "Base neutra (area principal x custo-base x fator regional) rateada por subsistema, com cada fator incidindo apenas nos subsistemas expostos + itens especificos + indiretos.",
      program_compatibility: compatibility,
      breakdown: [...cleanSubsystemBreakdown, ...optionalBreakdown],
      investment_breakdown: [
        { category: "Custo tecnico da execucao", amount: Number(technicalCost.toFixed(2)), included: true, note: "Estimativa parametrica" },
        { category: "Projetos e aprovacoes", amount: Number(designsCost.toFixed(2)), included: costs.include_designs, note: `Percentual de ${(designsRate * 100).toFixed(1)}%` },
        { category: "Administracao, indiretos e BDI", amount: Number(indirectCost.toFixed(2)), included: costs.include_indirects, note: `Percentual de ${(indirectsRate * 100).toFixed(1)}%` },
        { category: "Contingencia", amount: Number(contingencyCost.toFixed(2)), included: costs.include_contingency, note: `Margem de ${contingencyPercent.toFixed(1)}% (limite ${maxContingency.toFixed(0)}%)` },
        { category: costs.other_investment_description || "Verba adicional", amount: other, included: other > 0, note: "Informada pelo usuario" }
      ],
      quantities: [
        { category: "Area", label: "Area principal", quantity: mainArea, unit: "m2", confidence: "high", basis: "Informada pelo usuario" },
        { category: "Area", label: "Area fisica estimada da garagem", quantity: Number(garageArea.toFixed(2)), unit: "m2", confidence: "medium", basis: `${building.garage_spaces || 0} vaga(s) x ${num(eqCoeff.garage_area_per_space, 13.5)} m2.` },
        { category: "Area", label: "Area fisica total estimada", quantity: Number(physicalArea.toFixed(2)), unit: "m2", confidence: "high", basis: "Casa + garagem + varandas + subsolo." },
        { category: "Area", label: "Area equivalente (referencia)", quantity: Number(equivalentArea.toFixed(2)), unit: "m2-eq", confidence: "low", basis: "Coeficientes parametricos; nao usada como driver de custo." },
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
        `Cada vaga de garagem foi estimada em ${num(eqCoeff.garage_area_per_space, 13.5)} m2.`,
        "Os quantitativos intermediarios sao aproximacoes parametricas e nao substituem levantamento de projeto.",
        `A compatibilidade area x programa usa o metodo ${compatibility.method_version} e nao substitui estudo arquitetonico.`,
        "Cada subsistema usa a area principal como base, seu peso proprio e apenas os fatores tecnicamente expostos (sem cascata multiplicativa global).",
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

  // ===========================================================================
  // Gerador de modelo IFC4 (massing conceitual)
  //
  // Produz um arquivo IFC-SPF (STEP / ISO-10303-21) em texto puro, sem qualquer
  // dependencia externa, no mesmo espirito do gerador de PDF acima.
  //
  // IMPORTANTE: este e um MODELO VOLUMETRICO CONCEITUAL (nivel ~LOD 100).
  // Representa uma HIPOTESE de implantacao derivada dos parametros, NAO um
  // projeto arquitetonico. As paredes internas, aberturas e ambientes nao estao
  // em posicao real de projeto. Serve para estudo de volume, gabarito,
  // afastamentos e coordenacao preliminar - nunca para medicao ou execucao.
  //
  // Estrutura espacial:
  //   IfcProject -> IfcSite (com talude/cota) -> IfcBuilding -> IfcBuildingStorey[]
  // Elementos por pavimento: laje (IfcSlab), paredes-casca (IfcWallStandardCase),
  // aberturas (IfcOpeningElement + IfcWindow/IfcDoor), vazio de pe-direito duplo.
  // Anexos: cobertura (IfcRoof), garagem (volume), piscina (IfcSlab rebaixado),
  // terreno como IfcGeographicElement/IfcSite com sólido de talude.
  // ===========================================================================
  function buildIfcModel(request, result, parameters) {
    const num = (v, f = 0) => (Number.isFinite(Number(v)) ? Number(v) : f);
    const building = request.building || {};
    const terrain = request.terrain || {};
    const program = request.program || {};
    const construction = request.construction || {};
    const extras = request.extras || {};
    const coeff = (parameters && parameters.quantity_coefficients) || {};

    const mainArea = Math.max(1, num(building.built_area, 100));
    const floors = Math.max(1, Math.round(num(building.floors, 1)));
    const ceilingHeight = num(coeff.average_ceiling_height_m, 2.8);
    const complexityPerimeter = ((coeff.perimeter_shape_factors) || {})[building.complexity] || 1.08;

    // Geometria de projecao: retangulo com razao derivada da complexidade.
    // Area de projecao = area principal / pavimentos.
    const projection = mainArea / floors;
    // proporcao do retangulo: mais "articulada" => mais alongada
    const ratio = { compacta: 1.0, regular: 1.2, articulada: 1.45, complexa: 1.7 }[building.complexity] || 1.2;
    const width = Math.sqrt(projection / ratio);   // menor lado (X)
    const depth = projection / Math.max(0.5, width); // maior lado (Y)
    const wallThickness = 0.2;
    const slabThickness = 0.15;

    // Terreno e cota de implantacao.
    const slopeGrade = { plano: 0.0, leve: 0.06, inclinado: 0.15, muito_inclinado: 0.30 }[terrain.slope] || 0.0;
    const siteMargin = Math.max(6, Math.sqrt(projection) * 1.2);
    const siteW = width + siteMargin * 2;
    const siteD = depth + siteMargin * 2;
    const dropAcrossSite = slopeGrade * siteD;        // desnivel total no eixo Y
    const platformCut = slopeGrade > 0 ? dropAcrossSite * 0.5 : 0; // plataforma nivelada (corte/aterro)
    const buildingBaseZ = 0.0; // a edificacao assenta na plataforma (z=0); o terreno varia ao redor.

    // ------------------------------------------------------------------
    // Coletor de linhas STEP com numeracao incremental de #id.
    // ------------------------------------------------------------------
    const lines = [];
    let id = 0;
    const ref = () => `#${id}`;
    const add = (body) => { id += 1; lines.push(`#${id}=${body};`); return `#${id}`; };
    const S = (s) => `'${String(s == null ? "" : s).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
    const guid = () => {
      // GUID IFC compactado (22 chars, base64-ish do padrao IFC).
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$";
      let g = "";
      for (let i = 0; i < 22; i += 1) g += chars[Math.floor(Math.random() * 64)];
      return g;
    };
    const guidRef = () => S(guid());

    // ------------------------------------------------------------------
    // Fundacao geometrica: contextos, unidades, owner history.
    // ------------------------------------------------------------------
    const person = add(`IFCPERSON($,$,'Casa Parametrica',$,$,$,$,$)`);
    const org = add(`IFCORGANIZATION($,'Casa Parametrica','Modelo conceitual parametrico',$,$)`);
    const personAndOrg = add(`IFCPERSONANDORGANIZATION(${person},${org},$)`);
    const application = add(`IFCAPPLICATION(${org},'2026.08',${S("Casa Parametrica - Massing IFC")},'CasaParametrica')`);
    const ownerHistory = add(`IFCOWNERHISTORY(${personAndOrg},${application},$,.ADDED.,$,${personAndOrg},${application},${Math.floor(Date.now() / 1000)})`);

    const dimExp = add(`IFCDIMENSIONALEXPONENTS(0,0,0,0,0,0,0)`);
    const unitLen = add(`IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.)`);
    const unitArea = add(`IFCSIUNIT(*,.AREAUNIT.,$,.SQUARE_METRE.)`);
    const unitVol = add(`IFCSIUNIT(*,.VOLUMEUNIT.,$,.CUBIC_METRE.)`);
    const unitAngleRad = add(`IFCSIUNIT(*,.PLANEANGLEUNIT.,$,.RADIAN.)`);
    const unitAssignment = add(`IFCUNITASSIGNMENT((${unitLen},${unitArea},${unitVol},${unitAngleRad}))`);

    const originPt = add(`IFCCARTESIANPOINT((0.,0.,0.))`);
    const dirZ = add(`IFCDIRECTION((0.,0.,1.))`);
    const dirX = add(`IFCDIRECTION((1.,0.,0.))`);
    const worldAxis = add(`IFCAXIS2PLACEMENT3D(${originPt},${dirZ},${dirX})`);
    const dirTrue = add(`IFCDIRECTION((0.,1.))`);
    const geomContext = add(`IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.0E-5,${worldAxis},${dirTrue})`);
    const bodySubContext = add(`IFCGEOMETRICREPRESENTATIONSUBCONTEXT('Body','Model',*,*,*,*,${geomContext},$,.MODEL_VIEW.,$)`);

    // Placement raiz reutilizavel.
    const rootPlacement = add(`IFCLOCALPLACEMENT($,${worldAxis})`);

    // ------------------------------------------------------------------
    // Helpers de geometria: caixa por extrusao a partir de um retangulo.
    // profile centrado; placement define a origem (canto) e a cota Z.
    // ------------------------------------------------------------------
    const placementAt = (x, y, z, parent) => {
      const p = add(`IFCCARTESIANPOINT((${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}))`);
      const ax = add(`IFCAXIS2PLACEMENT3D(${p},${dirZ},${dirX})`);
      return add(`IFCLOCALPLACEMENT(${parent || rootPlacement},${ax})`);
    };
    const extrudedBox = (w, d, h) => {
      // profile retangular centrado na origem local
      const profPos2d = add(`IFCCARTESIANPOINT((0.,0.))`);
      const profAxis = add(`IFCAXIS2PLACEMENT2D(${profPos2d},$)`);
      const prof = add(`IFCRECTANGLEPROFILEDEF(.AREA.,$,${profAxis},${w.toFixed(4)},${d.toFixed(4)})`);
      const solidPos = add(`IFCAXIS2PLACEMENT3D(${originPt},${dirZ},${dirX})`);
      const extrudeDir = add(`IFCDIRECTION((0.,0.,1.))`);
      const solid = add(`IFCEXTRUDEDAREASOLID(${prof},${solidPos},${extrudeDir},${h.toFixed(4)})`);
      const shapeRep = add(`IFCSHAPEREPRESENTATION(${bodySubContext},'Body','SweptSolid',(${solid}))`);
      return add(`IFCPRODUCTDEFINITIONSHAPE($,$,(${shapeRep}))`);
    };
    // caixa "casca" (hollow) para paredes perimetrais: retangulo externo com furo interno,
    // via perfil arbitrario com void (contorno externo + contorno interno como buraco).
    const hollowBox = (wOut, dOut, thickness, h) => {
      const innerW = Math.max(0.2, wOut - 2 * thickness);
      const innerD = Math.max(0.2, dOut - 2 * thickness);
      const outerCurve = profileCurveOf(wOut, dOut);
      const innerCurve = profileCurveOf(innerW, innerD);
      const hollow = add(`IFCARBITRARYPROFILEDEFWITHVOIDS(.AREA.,$,${outerCurve},(${innerCurve}))`);
      const solidPos = add(`IFCAXIS2PLACEMENT3D(${originPt},${dirZ},${dirX})`);
      const extrudeDir = add(`IFCDIRECTION((0.,0.,1.))`);
      const solid = add(`IFCEXTRUDEDAREASOLID(${hollow},${solidPos},${extrudeDir},${h.toFixed(4)})`);
      const shapeRep = add(`IFCSHAPEREPRESENTATION(${bodySubContext},'Body','SweptSolid',(${solid}))`);
      return add(`IFCPRODUCTDEFINITIONSHAPE($,$,(${shapeRep}))`);
    };
    // curva poligonal fechada para um retangulo centrado (para o perfil com voids)
    function profileCurveOf(w, d) {
      const hw = w / 2, hd = d / 2;
      const p1 = add(`IFCCARTESIANPOINT((${(-hw).toFixed(4)},${(-hd).toFixed(4)}))`);
      const p2 = add(`IFCCARTESIANPOINT((${hw.toFixed(4)},${(-hd).toFixed(4)}))`);
      const p3 = add(`IFCCARTESIANPOINT((${hw.toFixed(4)},${hd.toFixed(4)}))`);
      const p4 = add(`IFCCARTESIANPOINT((${(-hw).toFixed(4)},${hd.toFixed(4)}))`);
      return add(`IFCPOLYLINE((${p1},${p2},${p3},${p4},${p1}))`);
    }

    // ------------------------------------------------------------------
    // Estrutura espacial.
    // ------------------------------------------------------------------
    const project = add(`IFCPROJECT(${guidRef()},${ownerHistory},'Casa Parametrica',${S("Modelo conceitual de massa (LOD 100). Nao e projeto arquitetonico.")},$,$,$,(${geomContext}),${unitAssignment})`);

    // Site com placement em cota (topo da plataforma). RefElevation informativa.
    const sitePlacement = placementAt(-siteW / 2 + width / 2, -siteD / 2 + depth / 2, -platformCut, rootPlacement);
    const siteShape = extrudedBox(siteW, siteD, Math.max(0.3, platformCut + 0.3));
    const site = add(`IFCSITE(${guidRef()},${ownerHistory},'Terreno',${S("Plataforma de implantacao (corte/aterro conceitual)")},$,${sitePlacement},${siteShape},$,.ELEMENT.,$,$,${Math.round(buildingBaseZ * 1000)},$,$)`);

    const buildingPlacement = placementAt(0, 0, buildingBaseZ, rootPlacement);
    const ifcBuilding = add(`IFCBUILDING(${guidRef()},${ownerHistory},${S(request.name || "Edificacao")},${S(descricaoTipo(building, extras))},$,${buildingPlacement},$,$,.ELEMENT.,$,$,$)`);

    // ------------------------------------------------------------------
    // Pavimentos, lajes, paredes, aberturas.
    // ------------------------------------------------------------------
    const storeyRefs = [];
    const productRels = []; // {storey, products:[]}
    const doubleHeightArea = num(building.double_height_area, 0);

    for (let level = 0; level < floors; level += 1) {
      const z = buildingBaseZ + level * ceilingHeight;
      const storeyPlacement = placementAt(0, 0, z, buildingPlacement);
      const storey = add(`IFCBUILDINGSTOREY(${guidRef()},${ownerHistory},'Pavimento ${level + 1}',$,$,${storeyPlacement},$,$,.ELEMENT.,${z.toFixed(3)})`);
      const products = [];

      // Laje de piso.
      const slabPlacement = placementAt(0, 0, 0, storeyPlacement);
      const slabShape = extrudedBox(width, depth, slabThickness);
      const slab = add(`IFCSLAB(${guidRef()},${ownerHistory},'Laje pav ${level + 1}',$,$,${slabPlacement},${slabShape},$,.FLOOR.)`);
      products.push(slab);

      // Paredes perimetrais como casca (hollow box) subindo o pe-direito.
      const wallPlacement = placementAt(0, 0, slabThickness, storeyPlacement);
      const wallShape = hollowBox(width, depth, wallThickness, ceilingHeight - slabThickness);
      const wall = add(`IFCWALLSTANDARDCASE(${guidRef()},${ownerHistory},'Envoltoria pav ${level + 1}',${S("Casca perimetral conceitual")},$,${wallPlacement},${wallShape},$,.STANDARD.)`);
      products.push(wall);

      // Aberturas (janelas) distribuidas nas 4 fachadas, proporcional a area de esquadrias.
      // Numero aproximado de vaos por pavimento.
      const windowsPerFloor = Math.max(2, Math.round((num(program.bedrooms, 2) + 2) / floors) + 2);
      for (let wI = 0; wI < windowsPerFloor; wI += 1) {
        const side = wI % 4; // 0..3 -> 4 fachadas
        const along = ((wI % 3) + 1) / 4; // posicao relativa 0.25/0.5/0.75
        let wx = 0, wy = 0;
        const winW = 1.4, winH = 1.3, sill = 1.0;
        if (side === 0) { wx = -width / 2; wy = -depth / 2 + depth * along; }
        else if (side === 1) { wx = width / 2; wy = -depth / 2 + depth * along; }
        else if (side === 2) { wx = -width / 2 + width * along; wy = -depth / 2; }
        else { wx = -width / 2 + width * along; wy = depth / 2; }
        const openPlacement = placementAt(wx, wy, slabThickness + sill, storeyPlacement);
        const openShape = extrudedBox(winW, wallThickness * 1.2, winH);
        const opening = add(`IFCOPENINGELEMENT(${guidRef()},${ownerHistory},'Vao ${level + 1}-${wI + 1}',$,$,${openPlacement},${openShape},$,.OPENING.)`);
        add(`IFCRELVOIDSELEMENT(${guidRef()},${ownerHistory},$,$,${wall},${opening})`);
        const winShape = extrudedBox(winW * 0.95, wallThickness * 0.4, winH * 0.95);
        const winPlacement = placementAt(wx, wy, slabThickness + sill, storeyPlacement);
        const window = add(`IFCWINDOW(${guidRef()},${ownerHistory},'Janela ${level + 1}-${wI + 1}',$,$,${winPlacement},${winShape},$,${winH.toFixed(2)},${winW.toFixed(2)},.WINDOW.,.NOTDEFINED.,$)`);
        add(`IFCRELFILLSELEMENT(${guidRef()},${ownerHistory},$,$,${opening},${window})`);
        products.push(window);
      }

      // Porta de acesso no pavimento terreo.
      if (level === 0) {
        const doorPlacement = placementAt(0, -depth / 2, slabThickness, storeyPlacement);
        const doorOpenShape = extrudedBox(1.0, wallThickness * 1.2, 2.1);
        const doorOpening = add(`IFCOPENINGELEMENT(${guidRef()},${ownerHistory},'Vao porta',$,$,${doorPlacement},${doorOpenShape},$,.OPENING.)`);
        add(`IFCRELVOIDSELEMENT(${guidRef()},${ownerHistory},$,$,${wall},${doorOpening})`);
        const doorShape = extrudedBox(0.95, wallThickness * 0.4, 2.1);
        const doorPl2 = placementAt(0, -depth / 2, slabThickness, storeyPlacement);
        const door = add(`IFCDOOR(${guidRef()},${ownerHistory},'Porta de acesso',$,$,${doorPl2},${doorShape},$,2.10,1.00,.DOOR.,.SINGLE_SWING_LEFT.,$)`);
        add(`IFCRELFILLSELEMENT(${guidRef()},${ownerHistory},$,$,${doorOpening},${door})`);
        products.push(door);
      }

      storeyRefs.push(storey);
      productRels.push({ storey, products });
    }

    // Vazio de pe-direito duplo: subtrai uma laje no pavimento superior (representado
    // como um IfcSpace "vazado" informativo no ultimo pavimento).
    let doubleHeightSpace = null;
    if (doubleHeightArea > 0 && floors > 1) {
      const topStorey = storeyRefs[storeyRefs.length - 1];
      const dhW = Math.min(width * 0.8, Math.sqrt(doubleHeightArea));
      const dhD = Math.min(depth * 0.8, doubleHeightArea / Math.max(0.5, dhW));
      const dhPlacement = placementAt(0, 0, 0, placementAt(0, 0, buildingBaseZ + (floors - 1) * ceilingHeight, buildingPlacement));
      const dhShape = extrudedBox(dhW, dhD, ceilingHeight * 0.98);
      doubleHeightSpace = add(`IFCSPACE(${guidRef()},${ownerHistory},'Pe-direito duplo',${S("Vazio de pe-direito duplo (conceitual)")},$,${dhPlacement},${dhShape},$,.ELEMENT.,.INTERNAL.,$)`);
    }

    // ------------------------------------------------------------------
    // Cobertura conforme tipo.
    // ------------------------------------------------------------------
    const roofZ = buildingBaseZ + floors * ceilingHeight;
    const roofType = construction.roof || "colonial_ceramica";
    const flatRoof = ["laje_impermeabilizada", "embutido_termoacustica", "cobertura_verde"].includes(roofType);
    const roofPlacement = placementAt(0, 0, roofZ, buildingPlacement);
    let roofShape;
    if (flatRoof) {
      roofShape = extrudedBox(width + 0.4, depth + 0.4, 0.3);
    } else {
      // telhado inclinado simplificado: prisma triangular ao longo do maior eixo
      const ridgeH = Math.min(2.2, Math.sqrt(projection) * 0.18);
      roofShape = gableRoofShape(width, depth, ridgeH, add, originPt, dirZ, dirX, bodySubContext);
    }
    const roof = add(`IFCROOF(${guidRef()},${ownerHistory},'Cobertura',${S(roofType)},$,${roofPlacement},${roofShape},$,.${flatRoof ? "FLAT_ROOF" : "GABLE_ROOF"}.)`);

    // ------------------------------------------------------------------
    // Garagem (volume anexo lateral), coberta ou nao.
    // ------------------------------------------------------------------
    let garage = null;
    const garageSpaces = num(building.garage_spaces, 0);
    if (garageSpaces > 0) {
      const gW = Math.min(6, 2.6 * Math.min(2, garageSpaces));
      const gD = 5.0;
      const gH = building.garage_covered ? 2.6 : 0.15;
      const gx = -(width / 2 + gW / 2 + 0.3);
      const garagePlacement = placementAt(gx, -depth / 2 + gD / 2, buildingBaseZ, buildingPlacement);
      const garageShape = extrudedBox(gW, gD, gH);
      garage = add(`IFCBUILDINGELEMENTPROXY(${guidRef()},${ownerHistory},'Garagem',${S(building.garage_covered ? "Garagem coberta (conceitual)" : "Vaga descoberta (conceitual)")},$,${garagePlacement},${garageShape},$,.ELEMENT.)`);
    }

    // ------------------------------------------------------------------
    // Piscina (laje rebaixada no terreno).
    // ------------------------------------------------------------------
    let pool = null;
    if (extras.pool && num(extras.pool_area, 0) > 0) {
      const poolArea = num(extras.pool_area, 18);
      const pW = Math.sqrt(poolArea / 2);
      const pD = poolArea / Math.max(0.5, pW);
      const px = width / 2 + pW / 2 + 1.5;
      const poolPlacement = placementAt(px, 0, -1.4, sitePlacement);
      const poolShape = extrudedBox(pW, pD, 1.4);
      pool = add(`IFCBUILDINGELEMENTPROXY(${guidRef()},${ownerHistory},'Piscina',${S("Piscina (volume conceitual)")},$,${poolPlacement},${poolShape},$,.ELEMENT.)`);
    }

    // ------------------------------------------------------------------
    // Talude / desnivel do terreno (prisma inclinado) quando ha inclinacao.
    // ------------------------------------------------------------------
    let slopeMass = null;
    if (slopeGrade > 0) {
      const slopeShape = wedgeShape(siteW, siteD, dropAcrossSite, add, originPt, dirZ, dirX, bodySubContext);
      const slopePlacement = placementAt(-siteW / 2 + width / 2, -siteD / 2 + depth / 2, -platformCut - 0.3, rootPlacement);
      slopeMass = add(`IFCGEOGRAPHICELEMENT(${guidRef()},${ownerHistory},'Talude do terreno',${S("Desnivel natural (corte/aterro conceitual)")},$,${slopePlacement},${slopeShape},$,.TERRAIN.)`);
    }

    // ------------------------------------------------------------------
    // Relacoes de agregacao e contencao espacial.
    // ------------------------------------------------------------------
    add(`IFCRELAGGREGATES(${guidRef()},${ownerHistory},$,$,${project},(${site}))`);
    add(`IFCRELAGGREGATES(${guidRef()},${ownerHistory},$,$,${site},(${ifcBuilding}))`);
    add(`IFCRELAGGREGATES(${guidRef()},${ownerHistory},$,$,${ifcBuilding},(${storeyRefs.join(",")}))`);

    // Elementos por pavimento.
    productRels.forEach(({ storey, products }, i) => {
      if (products.length) {
        add(`IFCRELCONTAINEDINSPATIALSTRUCTURE(${guidRef()},${ownerHistory},'Conteudo pav ${i + 1}',$,(${products.join(",")}),${storey})`);
      }
    });
    // Cobertura e espaco de pe-direito no topo / building.
    const buildingLevelProducts = [roof];
    if (doubleHeightSpace) buildingLevelProducts.push(doubleHeightSpace);
    if (garage) buildingLevelProducts.push(garage);
    add(`IFCRELCONTAINEDINSPATIALSTRUCTURE(${guidRef()},${ownerHistory},'Elementos da edificacao',$,(${buildingLevelProducts.join(",")}),${storeyRefs[0]})`);
    // Elementos do sitio (piscina, talude).
    const siteProducts = [];
    if (pool) siteProducts.push(pool);
    if (slopeMass) siteProducts.push(slopeMass);
    if (siteProducts.length) {
      add(`IFCRELCONTAINEDINSPATIALSTRUCTURE(${guidRef()},${ownerHistory},'Elementos do terreno',$,(${siteProducts.join(",")}),${site})`);
    }

    // ------------------------------------------------------------------
    // Property set com aviso e resumo parametrico.
    // ------------------------------------------------------------------
    const pv = (name, val) => add(`IFCPROPERTYSINGLEVALUE('${name}',$,IFCTEXT(${S(val)}),$)`);
    const props = [
      pv("Natureza", "Modelo conceitual de massa (LOD 100)"),
      pv("Aviso", "Hipotese de implantacao. Nao e projeto arquitetonico nem base para medicao/execucao."),
      pv("Area principal (m2)", String(mainArea)),
      pv("Pavimentos", String(floors)),
      pv("Custo tecnico (R$)", String(result.technical_cost)),
      pv("Investimento total (R$)", String(result.investment_total)),
      pv("Base de precos", String(result.price_base?.version || result.parameter_version))
    ];
    const pset = add(`IFCPROPERTYSET(${guidRef()},${ownerHistory},'Pset_CasaParametrica',${S("Resumo parametrico e avisos")},(${props.join(",")}))`);
    add(`IFCRELDEFINESBYPROPERTIES(${guidRef()},${ownerHistory},$,$,(${ifcBuilding}),${pset})`);

    // ------------------------------------------------------------------
    // Montagem do arquivo STEP.
    // ------------------------------------------------------------------
    const now = new Date().toISOString();
    const header = [
      "ISO-10303-21;",
      "HEADER;",
      `FILE_DESCRIPTION(('Casa Parametrica - modelo conceitual de massa (LOD 100)','Nao e projeto arquitetonico'),'2;1');`,
      `FILE_NAME('${(request.name || "casa-parametrica").replace(/'/g, "")}.ifc','${now}',('Casa Parametrica'),('Casa Parametrica'),'Casa Parametrica Massing 2026.08','Casa Parametrica','');`,
      "FILE_SCHEMA(('IFC4'));",
      "ENDSEC;",
      "DATA;"
    ].join("\n");
    const footer = ["ENDSEC;", "END-ISO-10303-21;"].join("\n");
    const content = `${header}\n${lines.join("\n")}\n${footer}\n`;
    return content;
  }

  // Telhado de duas aguas: prisma triangular varrido ao longo do eixo Y (depth).
  function gableRoofShape(width, depth, ridgeH, add, originPt, dirZ, dirX, bodySubContext) {
    const hw = width / 2;
    const p1 = add(`IFCCARTESIANPOINT((${(-hw).toFixed(4)},0.))`);
    const p2 = add(`IFCCARTESIANPOINT((${hw.toFixed(4)},0.))`);
    const p3 = add(`IFCCARTESIANPOINT((0.,${ridgeH.toFixed(4)}))`);
    const poly = add(`IFCPOLYLINE((${p1},${p2},${p3},${p1}))`);
    const prof = add(`IFCARBITRARYCLOSEDPROFILEDEF(.AREA.,$,${poly})`);
    // roda o perfil para o plano XZ e varre em +Y
    const rp = add(`IFCCARTESIANPOINT((0.,0.,0.))`);
    const rdz = add(`IFCDIRECTION((0.,-1.,0.))`);
    const rdx = add(`IFCDIRECTION((1.,0.,0.))`);
    const solidPos = add(`IFCAXIS2PLACEMENT3D(${rp},${rdz},${rdx})`);
    const extrudeDir = add(`IFCDIRECTION((0.,0.,1.))`);
    const solid = add(`IFCEXTRUDEDAREASOLID(${prof},${solidPos},${extrudeDir},${depth.toFixed(4)})`);
    const shapeRep = add(`IFCSHAPEREPRESENTATION(${bodySubContext},'Body','SweptSolid',(${solid}))`);
    return add(`IFCPRODUCTDEFINITIONSHAPE($,$,(${shapeRep}))`);
  }

  // Cunha (wedge) para representar desnivel do terreno: triangulo varrido em X.
  function wedgeShape(width, depth, drop, add, originPt, dirZ, dirX, bodySubContext) {
    const hd = depth / 2;
    const p1 = add(`IFCCARTESIANPOINT((${(-hd).toFixed(4)},0.))`);
    const p2 = add(`IFCCARTESIANPOINT((${hd.toFixed(4)},0.))`);
    const p3 = add(`IFCCARTESIANPOINT((${hd.toFixed(4)},${Math.max(0.1, drop).toFixed(4)}))`);
    const poly = add(`IFCPOLYLINE((${p1},${p2},${p3},${p1}))`);
    const prof = add(`IFCARBITRARYCLOSEDPROFILEDEF(.AREA.,$,${poly})`);
    const rp = add(`IFCCARTESIANPOINT((0.,0.,0.))`);
    const rdz = add(`IFCDIRECTION((1.,0.,0.))`);
    const rdx = add(`IFCDIRECTION((0.,1.,0.))`);
    const solidPos = add(`IFCAXIS2PLACEMENT3D(${rp},${rdz},${rdx})`);
    const extrudeDir = add(`IFCDIRECTION((0.,0.,1.))`);
    const solid = add(`IFCEXTRUDEDAREASOLID(${prof},${solidPos},${extrudeDir},${width.toFixed(4)})`);
    const shapeRep = add(`IFCSHAPEREPRESENTATION(${bodySubContext},'Body','SweptSolid',(${solid}))`);
    return add(`IFCPRODUCTDEFINITIONSHAPE($,$,(${shapeRep}))`);
  }

  function descricaoTipo(building, extras) {
    const floors = Math.max(1, Math.round(Number(building.floors || 1)));
    const tipo = floors > 1 ? "Sobrado" : "Edificacao terrea";
    const compl = building.complexity ? ` - ${building.complexity}` : "";
    return `${tipo}${compl}`;
  }

  function ifcModelResponse(request, result) {
    const encoder = new TextEncoder();
    return loadParameters().then((parameters) => {
      const content = buildIfcModel(request, result, parameters);
      return new Response(encoder.encode(content), {
        status: 200,
        headers: {
          "Content-Type": "application/x-step",
          "Content-Disposition": "attachment; filename=\"casa-parametrica-modelo.ifc\"",
          "Cache-Control": "no-store, max-age=0"
        }
      });
    });
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
    if (path === "/api/model.ifc") {
      const body = readBody(options);
      return ifcModelResponse(body, await estimate(body));
    }

    const simulationMatch = path.match(/^\/api\/simulations\/([^/]+)(?:\/(duplicate|report\.pdf|model\.ifc))?$/);
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
      if (action === "model.ifc") return ifcModelResponse(record.input, record.result);
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
