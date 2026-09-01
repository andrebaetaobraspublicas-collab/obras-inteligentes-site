"use strict";

(() => {
  const sectionMeta = [
    { id: "inicio", label: "Visão geral" },
    { id: "roteiro", label: "Roteiro de uso" },
    { id: "conceitos", label: "Conceitos e cálculo" },
    { id: "etapas", label: "Campos das 5 etapas" },
    { id: "resultados", label: "Leitura dos resultados" },
    { id: "cenarios", label: "Cenários e comparação" },
    { id: "parametros", label: "Parâmetros e bases" },
    { id: "dados", label: "PDF, dados e operação" },
    { id: "boas-praticas", label: "Boas práticas" },
    { id: "glossario", label: "Glossário" }
  ];

  const storageKeys = {
    read: "casa-parametrica-manual-read-v1",
    last: "casa-parametrica-manual-last-v1",
    checks: "casa-parametrica-manual-checks-v1"
  };

  const manualMarkup = `
    <div class="manual-overlay hidden" id="interactiveManual" role="dialog" aria-modal="true" aria-labelledby="manualTitle" aria-hidden="true">
      <div class="manual-dialog" role="document">
        <header class="manual-header">
          <div class="manual-title-wrap">
            <div class="manual-title-icon" aria-hidden="true">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><path d="M5 4.75A2.75 2.75 0 0 1 7.75 2H20v16H7.75A2.75 2.75 0 0 0 5 20.75v-16Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 20.75A2.75 2.75 0 0 1 7.75 18H20v4H7.75A2.75 2.75 0 0 1 5 19.25M9 6h7M9 10h7M9 14h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div>
              <span class="manual-eyebrow">Ajuda integrada</span>
              <h2 id="manualTitle">Manual interativo</h2>
              <p>Conceitos, método de cálculo, uso de cada campo e interpretação segura dos resultados.</p>
            </div>
          </div>

          <div class="manual-search-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <label class="hidden" for="manualSearch">Pesquisar no manual</label>
            <input class="manual-search" id="manualSearch" type="search" autocomplete="off" placeholder="Pesquise: área equivalente, contingência, cenário, PDF...">
            <span class="manual-search-shortcut"><kbd>Ctrl</kbd><kbd>K</kbd></span>
            <span class="manual-search-status hidden" id="manualSearchStatus" role="status" aria-live="polite"></span>
          </div>

          <button type="button" class="manual-close" id="closeManualButton" aria-label="Fechar o manual">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </header>

        <div class="manual-layout">
          <aside class="manual-sidebar" aria-label="Tópicos do manual">
            <div class="manual-sidebar-label">Conteúdo</div>
            <nav class="manual-nav" id="manualNav"></nav>

            <div class="manual-progress-card">
              <div class="manual-progress-heading"><span>Progresso de leitura</span><strong id="manualProgressText">0%</strong></div>
              <div class="manual-progress-track" aria-hidden="true"><div class="manual-progress-bar" id="manualProgressBar"></div></div>
              <p id="manualProgressDetail">Nenhum tópico marcado como lido.</p>
              <button type="button" class="manual-reset-progress" id="manualResetProgress">Reiniciar progresso</button>
            </div>

            <div class="manual-shortcuts" aria-label="Atalhos do manual">
              <span><span>Abrir o manual</span><kbd>F1</kbd></span>
              <span><span>Pesquisar</span><kbd>Ctrl K</kbd></span>
              <span><span>Fechar</span><kbd>Esc</kbd></span>
              <span><span>Tópico anterior/próximo</span><kbd>Alt ←/→</kbd></span>
            </div>
          </aside>

          <main class="manual-content" id="manualContent" tabindex="-1">
            <div class="manual-search-empty hidden" id="manualSearchEmpty">
              <strong>Nenhum conteúdo encontrado.</strong>
              Tente uma palavra mais ampla, como “custo”, “área”, “terreno” ou “cenário”.
              <div class="manual-actions" style="justify-content:center"><button type="button" class="manual-action" data-manual-clear-search>Limpar pesquisa</button></div>
            </div>

            <section class="manual-section active" data-manual-section="inicio" aria-labelledby="manualHeadingInicio">
              <div class="manual-section-heading">
                <span class="manual-section-kicker">01 · Comece aqui</span>
                <h3 id="manualHeadingInicio">O que é a Casa Paramétrica?</h3>
                <p>É uma ferramenta de <strong>viabilidade inicial</strong> que transforma poucas informações sobre terreno, programa residencial, solução construtiva e acabamentos em uma estimativa preliminar de custo, faixa de incerteza, prazo e principais direcionadores.</p>
              </div>

              <div class="manual-grid">
                <article class="manual-card is-accent manual-col-4" data-manual-search-block>
                  <div class="manual-card-icon" aria-hidden="true">1</div>
                  <h4>Para que serve</h4>
                  <p>Para testar alternativas antes do projeto detalhado: tamanho da casa, número de pavimentos, padrão de acabamento, sistema construtivo, piscina, subsolo e outros complementos.</p>
                </article>
                <article class="manual-card is-info manual-col-4" data-manual-search-block>
                  <div class="manual-card-icon" aria-hidden="true">2</div>
                  <h4>O que entrega</h4>
                  <p>Custo técnico, investimento provável, faixa mínima–máxima, custo por metro quadrado, quantitativos orientativos, compatibilidade área × programa, impactos, alertas e PDF.</p>
                </article>
                <article class="manual-card is-warning manual-col-4" data-manual-search-block>
                  <div class="manual-card-icon" aria-hidden="true">!</div>
                  <h4>O que não substitui</h4>
                  <p>Projeto arquitetônico e complementares, sondagem, levantamento topográfico, orçamento analítico, cronograma executivo, proposta comercial, laudo ou responsabilidade técnica.</p>
                </article>
              </div>

              <div class="manual-callout warning" data-manual-search-block style="margin-top:14px">
                <h4>Regra de ouro</h4>
                <p>O resultado é uma <strong>ordem de grandeza para decisão preliminar</strong>. Não utilize os quantitativos para comprar materiais, contratar serviços, medir obra ou dimensionar elementos. Quanto mais distante o estudo estiver de projetos e fontes regionais confiáveis, maior deve ser a prudência.</p>
              </div>

              <div class="manual-card manual-col-12" data-manual-search-block style="margin-top:14px">
                <h4>Leitura rápida do sistema em sete movimentos</h4>
                <div class="manual-workflow" aria-label="Fluxo resumido de uso">
                  <div class="manual-workflow-step"><span>1</span><strong>Escolha local e base</strong></div>
                  <div class="manual-workflow-step"><span>2</span><strong>Descreva o terreno</strong></div>
                  <div class="manual-workflow-step"><span>3</span><strong>Defina casa e programa</strong></div>
                  <div class="manual-workflow-step"><span>4</span><strong>Escolha a solução</strong></div>
                  <div class="manual-workflow-step"><span>5</span><strong>Inclua complementos</strong></div>
                  <div class="manual-workflow-step"><span>6</span><strong>Calcule e interprete</strong></div>
                  <div class="manual-workflow-step"><span>7</span><strong>Salve e compare</strong></div>
                </div>
                <div class="manual-actions">
                  <button type="button" class="manual-action primary" data-manual-go-view="estimate" data-manual-go-step="0" data-manual-target="#name">Iniciar uma estimativa</button>
                  <button type="button" class="manual-action" data-manual-section-link="conceitos">Entender o método de cálculo</button>
                  <button type="button" class="manual-action" data-manual-go-view="estimate" data-manual-target="#loadSampleButton">Abrir o exemplo preenchido</button>
                </div>
              </div>

              <div class="manual-grid" style="margin-top:14px">
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Três números que não devem ser confundidos</h4>
                  <ul>
                    <li><strong>Custo-base:</strong> referência monetária por m² da versão de preços.</li>
                    <li><strong>Custo técnico:</strong> execução física estimada, já com fatores e itens específicos.</li>
                    <li><strong>Investimento total:</strong> custo técnico acrescido das parcelas globais selecionadas e de eventual verba externa.</li>
                  </ul>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Onde seus dados ficam</h4>
                  <p>Na versão estática deste pacote, os cenários são gravados no armazenamento local do navegador. Eles não são enviados a um servidor, mas também não formam um backup permanente: limpeza de dados, troca de navegador ou uso de outro computador pode removê-los.</p>
                </article>
              </div>
            </section>

            <section class="manual-section" data-manual-section="roteiro" aria-labelledby="manualHeadingRoteiro">
              <div class="manual-section-heading">
                <span class="manual-section-kicker">02 · Passo a passo</span>
                <h3 id="manualHeadingRoteiro">Roteiro completo de utilização</h3>
                <p>O formulário foi organizado em cinco etapas para reduzir omissões. Os campos essenciais são validados antes do avanço e a estimativa só é calculada quando todas as etapas estão coerentes.</p>
              </div>

              <div class="manual-grid">
                <article class="manual-step-card manual-col-6" data-manual-search-block>
                  <span class="manual-step-number">A</span>
                  <span class="manual-step-kicker">Antes do formulário</span>
                  <h4>Leia o aviso legal e entre no sistema</h4>
                  <p>A abertura apresenta a finalidade e as limitações. A concordância é registrada apenas para a sessão atual do navegador. O botão <strong>Tela inicial</strong> reabre a apresentação sem apagar o trabalho.</p>
                </article>
                <article class="manual-step-card manual-col-6" data-manual-search-block>
                  <span class="manual-step-number">B</span>
                  <span class="manual-step-kicker">Atalhos de preenchimento</span>
                  <h4>Use “Preencher exemplo” ou “Limpar”</h4>
                  <p><strong>Preencher exemplo</strong> carrega uma casa térrea demonstrativa de 180 m². <strong>Limpar</strong> restaura o formulário e oculta o resultado anterior. O exemplo é um ponto de partida, não uma referência de mercado.</p>
                </article>
              </div>

              <div class="manual-card" data-manual-search-block style="margin-top:14px">
                <h4>Sequência recomendada</h4>
                <ol>
                  <li><strong>Local:</strong> informe UF, município e confirme a base de preços resolvida.</li>
                  <li><strong>Terreno:</strong> descreva inclinação, solo, acesso, demolição, contenções e existência de sondagem.</li>
                  <li><strong>Casa:</strong> defina área principal, pavimentos, áreas complementares, forma e programa de ambientes.</li>
                  <li><strong>Solução:</strong> selecione sistema construtivo, cobertura e padrões predominantes.</li>
                  <li><strong>Extras:</strong> inclua piscina, paisagismo, sistemas especiais e parcelas globais.</li>
                  <li><strong>Calcular:</strong> revise os dados; o sistema resolve a base, aplica o modelo e monta as memórias.</li>
                  <li><strong>Interpretar:</strong> leia primeiro custo técnico e investimento, depois incerteza, premissas e impactos.</li>
                  <li><strong>Salvar:</strong> guarde cenários com nomes claros e compare apenas alternativas com bases de preço compatíveis.</li>
                </ol>
              </div>

              <div class="manual-checklist" data-manual-search-block style="margin-top:14px">
                <h4>Checklist antes de calcular</h4>
                <p style="margin:0;color:#627d98;font-size:.74rem;line-height:1.5">As marcações ficam guardadas neste navegador.</p>
                <div class="manual-checklist-grid">
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="base"><span>Conferi UF, município, data-base e fonte da versão de preços.</span></label>
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="areas"><span>Separei área principal de garagem, varanda, subsolo e piscina.</span></label>
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="programa"><span>Quartos, suítes, banheiros e área gourmet representam o programa pretendido.</span></label>
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="terreno"><span>Inclinação, solo e acesso foram informados de forma conservadora.</span></label>
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="padrao"><span>O padrão de acabamento corresponde à maior parte da casa, não a um único ambiente.</span></label>
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="extras"><span>Evitei duplicar um item nos complementos e na verba adicional.</span></label>
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="parcelas"><span>Decidi conscientemente se projetos, indiretos/BDI e contingência serão incluídos.</span></label>
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="objetivo"><span>Sei qual decisão preliminar este cenário pretende apoiar.</span></label>
                </div>
              </div>

              <details class="manual-details" data-manual-search-block>
                <summary>Como funcionam as validações do formulário?</summary>
                <div class="manual-details-body">
                  <ul>
                    <li>O nome da estimativa não pode ficar vazio.</li>
                    <li>A área do terreno deve ser maior que 30 m² e a área principal maior que 20 m².</li>
                    <li>O número de suítes não pode superar o número de quartos.</li>
                    <li>A área de pé-direito duplo não pode superar a área principal.</li>
                    <li>O subsolo acima de 150% da área principal exige revisão.</li>
                    <li>Se a piscina estiver ativa, sua área deve ser positiva.</li>
                    <li>Uma verba adicional positiva deve ter descrição.</li>
                  </ul>
                  <p>Quando houver erro, o sistema abre a etapa correspondente, destaca o campo e apresenta a primeira mensagem de correção.</p>
                </div>
              </details>

              <details class="manual-details" data-manual-search-block>
                <summary>O que acontece tecnicamente ao clicar em “Calcular estimativa”?</summary>
                <div class="manual-details-body">
                  <ol>
                    <li>Os dados do formulário são organizados em localização, terreno, edificação, programa, construção, extras e custos globais.</li>
                    <li>A base de preços é resolvida pela versão escolhida ou pela hierarquia automática.</li>
                    <li>Calculam-se área equivalente, fatores multiplicadores e núcleo da execução.</li>
                    <li>Somam-se itens específicos, parcelas globais e verba externa.</li>
                    <li>São produzidos faixa de incerteza, prazo, compatibilidade de programa, quantitativos, subsistemas, impactos, alertas e premissas.</li>
                    <li>O resultado aparece abaixo do formulário, sem ser salvo automaticamente.</li>
                  </ol>
                </div>
              </details>

              <div class="manual-actions">
                <button type="button" class="manual-action primary" data-manual-go-view="estimate" data-manual-go-step="0" data-manual-target="#name">Ir para a etapa 1</button>
                <button type="button" class="manual-action" data-manual-go-view="estimate" data-manual-go-step="4" data-manual-target="#calculateButton">Ir para o cálculo</button>
              </div>
            </section>

            <section class="manual-section" data-manual-section="conceitos" aria-labelledby="manualHeadingConceitos">
              <div class="manual-section-heading">
                <span class="manual-section-kicker">03 · Fundamentos</span>
                <h3 id="manualHeadingConceitos">Conceitos e lógica de cálculo</h3>
                <p>O método combina uma referência monetária por área, equivalência entre tipos de área, fatores de complexidade e verbas específicas. A transparência está nas memórias exibidas após o cálculo.</p>
              </div>

              <div class="manual-grid">
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Estimativa paramétrica</h4>
                  <p>É uma aproximação construída a partir de relações entre características mensuráveis e custo. Em vez de levantar cada serviço, o sistema usa direcionadores como área, pavimentos, padrão, geometria, solo e complementos.</p>
                  <p>Ela é adequada para comparar alternativas em fase inicial, mas perde precisão quando o objeto é atípico, a base não é regional ou há condicionantes ainda desconhecidas.</p>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Orçamento analítico</h4>
                  <p>É elaborado com projetos, quantitativos de cada serviço, composições de custos, produtividade, cotações, encargos, tributos, logística e cronograma. É o nível necessário para contratar, negociar e controlar a execução.</p>
                  <p>A Casa Paramétrica não tenta substituir esse processo; ela ajuda a decidir quais alternativas merecem ser detalhadas.</p>
                </article>
              </div>

              <div class="manual-formula" data-manual-search-block style="margin-top:14px">
                <span class="manual-formula-label">Estrutura central do modelo atual</span>
                <div class="manual-equation">Núcleo = Área equivalente × Custo-base × (F<sub>UF</sub> × F<sub>acabamento</sub> × F<sub>sistema</sub> × F<sub>cobertura</sub> × F<sub>piso</sub> × F<sub>esquadrias</sub> × F<sub>declividade</sub> × F<sub>solo</sub> × F<sub>acesso</sub> × F<sub>pavimentos</sub> × F<sub>complexidade</sub>)</div>
                <div class="manual-equation" style="margin-top:9px">Custo técnico = Núcleo + demolição + contenções + piscina + paisagismo + sistemas especiais</div>
                <div class="manual-equation" style="margin-top:9px">Investimento provável = Custo técnico + projetos + indiretos/BDI + contingência + verba adicional</div>
                <p>Os multiplicadores são compostos: dois fatores de 1,10 resultam em 1,21, e não em 1,20. Os valores atuais podem ser consultados no quadro <strong>Fatores aplicados</strong> e no JSON de parâmetros.</p>
              </div>

              <details class="manual-details" data-manual-search-block open>
                <summary>Base de preços: qual valor inicia o cálculo?</summary>
                <div class="manual-details-body">
                  <p>O <strong>custo-base</strong> é um valor de referência em R$/m² associado a uma versão, local, data-base, fonte e observações. Ele não é o custo final por m² da casa.</p>
                  <p>Na seleção automática, o motor procura: <strong>1)</strong> base municipal ativa com correspondência exata de município e UF; <strong>2)</strong> base estadual ativa da UF; <strong>3)</strong> base estadual de fallback. Uma versão histórica pode ser escolhida manualmente.</p>
                  <p>O custo final por m² principal incorpora área equivalente, fatores e itens que não são proporcionais à área principal. Por isso ele pode diferir bastante do custo-base.</p>
                </div>
              </details>

              <div class="manual-grid" style="margin-top:14px">
                <div class="manual-simulator manual-col-7" data-manual-search-block>
                  <h4>Simulador didático de área equivalente</h4>
                  <p>Altere os valores para observar como áreas com esforços de custo distintos são convertidas para uma base comum.</p>
                  <div class="manual-simulator-grid">
                    <label>Área principal (m²)<input id="manualEqMain" type="number" min="0" step="1" value="180"></label>
                    <label>Vagas de garagem<input id="manualEqGarageSpaces" type="number" min="0" step="1" value="2"></label>
                    <label class="manual-simulator-check"><input id="manualEqGarageCovered" type="checkbox" checked><span>Garagem coberta</span></label>
                    <label>Varandas/sacadas (m²)<input id="manualEqBalcony" type="number" min="0" step="1" value="20"></label>
                    <label>Subsolo (m²)<input id="manualEqBasement" type="number" min="0" step="1" value="0"></label>
                    <label>Pé-direito duplo (m²)<input id="manualEqDoubleHeight" type="number" min="0" step="1" value="0"></label>
                  </div>
                  <div class="manual-simulator-result">
                    <div><span>Área equivalente calculada</span><strong id="manualEqResult">—</strong><div class="manual-simulator-breakdown" id="manualEqBreakdown"></div></div>
                    <button type="button" class="manual-action" id="manualApplyEqDemo">Aplicar ao formulário</button>
                  </div>
                </div>

                <article class="manual-card manual-col-5" data-manual-search-block>
                  <h4>Área principal, física e equivalente</h4>
                  <ul>
                    <li><strong>Principal:</strong> área interna-base informada para a casa.</li>
                    <li><strong>Física estimada:</strong> principal + garagem física + varandas + subsolo.</li>
                    <li><strong>Equivalente:</strong> cada área recebe um coeficiente segundo seu esforço relativo de custo.</li>
                  </ul>
                  <p>Na parametrização atual: varanda = 0,58; subsolo = 1,30; pé-direito duplo = 0,27; cada vaga representa cerca de 13,5 m² físicos, ponderados por 0,48 se coberta ou 0,22 se descoberta.</p>
                </article>
              </div>

              <details class="manual-details" data-manual-search-block>
                <summary>Como interpretar os fatores multiplicadores?</summary>
                <div class="manual-details-body">
                  <p>Um fator <strong>1,00</strong> mantém o custo; <strong>1,10</strong> eleva em torno de 10% naquele ponto da cadeia; <strong>0,95</strong> reduz em torno de 5%. O efeito final depende da combinação com os demais fatores.</p>
                  <ul>
                    <li><strong>UF:</strong> aproxima diferenças regionais.</li>
                    <li><strong>Padrão de acabamento:</strong> representa nível global de especificação.</li>
                    <li><strong>Sistema construtivo:</strong> aproxima diferenças de materiais, mão de obra, logística e produtividade.</li>
                    <li><strong>Cobertura, piso e esquadrias:</strong> tratam escolhas predominantes.</li>
                    <li><strong>Declividade, solo e acesso:</strong> representam condicionantes de implantação.</li>
                    <li><strong>Pavimentos e complexidade:</strong> capturam circulação vertical, estrutura, perímetro, recortes e dificuldade executiva.</li>
                  </ul>
                  <p>Os fatores não substituem a análise técnica de cada subsistema. Em uma calibração profissional, cada fator deve ser sustentado por amostra, fonte, data e escopo.</p>
                </div>
              </details>

              <details class="manual-details" data-manual-search-block>
                <summary>Compatibilidade entre área e programa residencial</summary>
                <div class="manual-details-body">
                  <p>O verificador testa se a área principal é plausível para a quantidade de quartos, suítes, banheiros, lavabos, área gourmet, pavimentos e forma da planta. Ele não desenha a planta e não verifica código de obras, acessibilidade, afastamentos ou insolação.</p>
                  <p>No motor estático atual, a área-base é aproximada por:</p>
                  <div class="manual-equation">M₀ = 32 + 13×quartos + 5×suítes + 4×banheiros + 2×lavabos + 12×área gourmet</div>
                  <p>O valor recebe fator de complexidade da forma, acréscimo quando há mais de um pavimento e piso mínimo de 45 m². A faixa recomendada vai aproximadamente de <strong>1,18 a 1,55 vezes</strong> o mínimo paramétrico.</p>
                  <ul>
                    <li><strong>Incompatível:</strong> abaixo do mínimo.</li>
                    <li><strong>Compacto:</strong> acima do mínimo, mas abaixo da faixa recomendada.</li>
                    <li><strong>Adequado:</strong> dentro da faixa de referência.</li>
                    <li><strong>Generoso / muito generoso:</strong> acima da faixa, com possível aumento de implantação e manutenção.</li>
                  </ul>
                </div>
              </details>

              <details class="manual-details" data-manual-search-block>
                <summary>Quantitativos paramétricos e custo por subsistema</summary>
                <div class="manual-details-body">
                  <p>O sistema deriva grandezas intermediárias para tornar o modelo auditável: projeção da casa, perímetro, fachadas, faces de paredes, áreas de fundação e estrutura, volumes preliminares, movimentação de terra, cobertura, impermeabilização, esquadrias, portas, pontos elétricos/hidráulicos e pintura.</p>
                  <p>O núcleo de custo é distribuído entre dez subsistemas. A coluna <strong>Custo efetivo</strong> é a divisão da parcela do subsistema pelo quantitativo direcionador. Ela serve para explicar o modelo; não é composição de mercado nem preço unitário contratável.</p>
                  <p>As classificações alta, média e baixa indicam o grau de aproximação daquela quantidade. Mesmo uma quantidade classificada como alta continua sendo paramétrica.</p>
                </div>
              </details>

              <div class="manual-grid" style="margin-top:14px">
                <div class="manual-simulator manual-col-7" data-manual-search-block>
                  <h4>Simulador da ponte até o investimento</h4>
                  <p>Exemplo didático com os percentuais padrão do motor estático atual.</p>
                  <div class="manual-simulator-grid">
                    <label>Custo técnico (R$)<input id="manualInvTechnical" type="number" min="0" step="1000" value="750000"></label>
                    <label class="manual-simulator-check"><input id="manualInvDesigns" type="checkbox" checked><span>Projetos: 5,5%</span></label>
                    <label class="manual-simulator-check"><input id="manualInvIndirects" type="checkbox" checked><span>Indiretos/BDI: 12%</span></label>
                    <label class="manual-simulator-check"><input id="manualInvContingency" type="checkbox" checked><span>Contingência</span></label>
                    <label>Taxa de contingência (%)<input id="manualInvContingencyRate" type="number" min="0" max="100" step="0.5" value="11"></label>
                    <label>Verba adicional (R$)<input id="manualInvOther" type="number" min="0" step="1000" value="0"></label>
                  </div>
                  <div class="manual-simulator-result">
                    <div><span>Investimento provável</span><strong id="manualInvResult">—</strong><div class="manual-simulator-breakdown" id="manualInvBreakdown"></div></div>
                  </div>
                </div>

                <article class="manual-card manual-col-5" data-manual-search-block>
                  <h4>Contingência não é incerteza</h4>
                  <p><strong>Contingência</strong> é uma parcela monetária incluída no investimento provável para eventos e indefinições previsíveis. No padrão atual, parte de 8% e aumenta com ausência de sondagem, terreno muito inclinado, solo mole e planta complexa.</p>
                  <p><strong>Incerteza</strong> é a amplitude usada para formar mínimo e máximo. Parte de 18% e aumenta em algumas situações. Ela não é somada como uma segunda reserva.</p>
                </article>
              </div>

              <details class="manual-details" data-manual-search-block>
                <summary>Confiabilidade, completude e prazo provável</summary>
                <div class="manual-details-body">
                  <ul>
                    <li><strong>Confiabilidade:</strong> sinal qualitativo da robustez das entradas. No MVP atual, a existência de sondagem eleva o indicador.</li>
                    <li><strong>Completude:</strong> índice simplificado do conjunto de informações. Atualmente é 68% sem sondagem e 82% com sondagem; não é uma certificação de maturidade de projeto.</li>
                    <li><strong>Prazo provável:</strong> faixa indicativa baseada principalmente na área principal, com limites mínimos. Não considera produtividade real, frentes, restrições, licenças, fluxo de caixa ou caminho crítico.</li>
                  </ul>
                </div>
              </details>

              <details class="manual-details" data-manual-search-block>
                <summary>Maiores impactos e análise de sensibilidade</summary>
                <div class="manual-details-body">
                  <p>O painel ordena os fatores e itens específicos pelo impacto monetário aproximado. Barras maiores indicam variáveis que merecem ser verificadas primeiro ou testadas em cenários alternativos.</p>
                  <p>O impacto é marginal e aproximado; não deve ser somado diretamente para reconstruir o total, pois os fatores são multiplicativos e interdependentes. Para uma comparação confiável, duplique o cenário, altere uma variável por vez e recalcule.</p>
                </div>
              </details>
            </section>

            <section class="manual-section" data-manual-section="etapas" aria-labelledby="manualHeadingEtapas">
              <div class="manual-section-heading">
                <span class="manual-section-kicker">04 · Entradas</span>
                <h3 id="manualHeadingEtapas">O que significa cada etapa do formulário</h3>
                <p>Os campos foram separados conforme sua função no modelo. Alguns alteram diretamente o custo; outros registram contexto, selecionam a base ou qualificam a incerteza.</p>
              </div>

              <article class="manual-step-card" data-manual-search-block>
                <span class="manual-step-number">1</span>
                <span class="manual-step-kicker">Local</span>
                <h4>Identificação e localização</h4>
                <div class="manual-field-list">
                  <div class="manual-field-item"><strong>Nome da estimativa</strong><span>Identifica o resultado, o cenário salvo e o arquivo PDF. Use nomes que revelem a alternativa, como “Casa 160 m² — padrão médio — sem piscina”.</span></div>
                  <div class="manual-field-item"><strong>UF</strong><span>Participa da resolução da base de preços e aplica o fator regional configurado.</span></div>
                  <div class="manual-field-item"><strong>Município</strong><span>Permite localizar base municipal ativa. A correspondência é textual; grafias diferentes podem impedir o encontro.</span></div>
                  <div class="manual-field-item"><strong>Bairro ou região</strong><span>É informação descritiva na versão atual. Não cria fator de custo por si só.</span></div>
                  <div class="manual-field-item"><strong>Base de preços</strong><span>Em “Automática”, usa a versão ativa mais específica. A seleção manual fixa uma versão histórica ou alternativa para o cálculo.</span></div>
                </div>
                <div class="manual-actions"><button type="button" class="manual-action primary" data-manual-go-view="estimate" data-manual-go-step="0" data-manual-target="#priceBaseId">Abrir etapa 1</button></div>
              </article>

              <article class="manual-step-card" data-manual-search-block style="margin-top:14px">
                <span class="manual-step-number">2</span>
                <span class="manual-step-kicker">Terreno</span>
                <h4>Características da implantação</h4>
                <div class="manual-field-list">
                  <div class="manual-field-item"><strong>Área do terreno</strong><span>Registra o lote e passa por validação. No motor estático atual, ainda não compõe diretamente o núcleo de custo nem verifica taxa de ocupação, recuos ou coeficiente de aproveitamento.</span></div>
                  <div class="manual-field-item"><strong>Inclinação</strong><span>Aplica fator de declividade e influencia movimentação de terra, contingência e incerteza quando classificada como muito inclinada.</span></div>
                  <div class="manual-field-item"><strong>Condição aparente do solo</strong><span>Aplica fator preliminar. “Desconhecido” não significa solo ruim; significa falta de informação e deve ser tratado com prudência.</span></div>
                  <div class="manual-field-item"><strong>Acesso de caminhões e máquinas</strong><span>Aproxima efeitos de mobilização, produtividade, restrição de equipamentos, transporte e manuseio.</span></div>
                  <div class="manual-field-item"><strong>Demolição e contenção</strong><span>Entram como parcelas específicas por m² informado. Confirme se as áreas não já estão embutidas em outra referência.</span></div>
                  <div class="manual-field-item"><strong>Sondagem geotécnica</strong><span>Não escolhe fundação automaticamente. Reduz a margem de incerteza e contingência e melhora os indicadores simplificados de confiança/completude.</span></div>
                  <div class="manual-field-item"><strong>Indício de rocha</strong><span>Registra uma condição crítica que exige investigação. O efeito monetário deve ser conferido na versão parametrizada do motor; não substitui sondagem nem levantamento geológico.</span></div>
                </div>
                <div class="manual-actions"><button type="button" class="manual-action primary" data-manual-go-view="estimate" data-manual-go-step="1" data-manual-target="#slope">Abrir etapa 2</button></div>
              </article>

              <article class="manual-step-card" data-manual-search-block style="margin-top:14px">
                <span class="manual-step-number">3</span>
                <span class="manual-step-kicker">Casa e programa</span>
                <h4>Áreas, geometria e ambientes</h4>
                <div class="manual-field-list">
                  <div class="manual-field-item"><strong>Área principal</strong><span>É a entrada central. Exclui garagem, varanda/sacada, piscina e subsolo, que recebem tratamento próprio.</span></div>
                  <div class="manual-field-item"><strong>Número de pavimentos</strong><span>Aplica fator de custo e reduz a projeção aproximada da casa, afetando perímetro, cobertura e fundações paramétricas.</span></div>
                  <div class="manual-field-item"><strong>Subsolo</strong><span>Tem coeficiente equivalente superior a 1, pois normalmente envolve escavação, contenção, impermeabilização, estrutura e instalações especiais.</span></div>
                  <div class="manual-field-item"><strong>Varandas e sacadas</strong><span>São ponderadas abaixo da área principal, mas também influenciam cobertura, estrutura, impermeabilização e acabamentos.</span></div>
                  <div class="manual-field-item"><strong>Pé-direito duplo</strong><span>Acrescenta área equivalente e aumenta fachadas/estrutura. Informe apenas a projeção horizontal do trecho com dupla altura.</span></div>
                  <div class="manual-field-item"><strong>Forma da planta</strong><span>Compacta tende a reduzir perímetro; articulada e complexa ampliam recortes, encontros, vãos, fachadas e dificuldade executiva.</span></div>
                  <div class="manual-field-item"><strong>Garagem</strong><span>Cada vaga é convertida em área física padrão e depois ponderada conforme coberta ou descoberta.</span></div>
                  <div class="manual-field-item"><strong>Quartos, suítes, banheiros, lavabos e gourmet</strong><span>Alimentam a verificação de compatibilidade e os quantitativos de paredes, portas, áreas molhadas e instalações.</span></div>
                </div>
                <div class="manual-callout" style="margin-top:13px"><h4>Verificação automática</h4><p>O cartão de compatibilidade é recalculado enquanto você edita os campos. Em situação incompatível ou compacta, o botão “Usar área recomendada” ajusta a área principal para o início da faixa sugerida.</p></div>
                <div class="manual-actions"><button type="button" class="manual-action primary" data-manual-go-view="estimate" data-manual-go-step="2" data-manual-target="#builtArea">Abrir etapa 3</button></div>
              </article>

              <article class="manual-step-card" data-manual-search-block style="margin-top:14px">
                <span class="manual-step-number">4</span>
                <span class="manual-step-kicker">Solução</span>
                <h4>Sistema, cobertura e acabamentos</h4>
                <div class="manual-field-list">
                  <div class="manual-field-item"><strong>Sistema construtivo</strong><span>Selecione a tecnologia predominante. Sistemas híbridos devem ser representados pela solução dominante e avaliados em cenários alternativos.</span></div>
                  <div class="manual-field-item"><strong>Tipo de cobertura</strong><span>Influencia o fator global e a área efetiva paramétrica da cobertura e da impermeabilização.</span></div>
                  <div class="manual-field-item"><strong>Padrão construtivo</strong><span>Representa o nível geral da especificação. Não escolha “alto luxo” por causa de um único ambiente; use o padrão predominante.</span></div>
                  <div class="manual-field-item"><strong>Piso predominante</strong><span>Aplica fator à estimativa. Misturas por ambiente exigem aproximação ponderada ou cenários.</span></div>
                  <div class="manual-field-item"><strong>Esquadrias predominantes</strong><span>Afeta custo e relação paramétrica de área de vãos. Grandes vãos envidraçados elevam quantidade e especificação.</span></div>
                </div>
                <div class="manual-actions"><button type="button" class="manual-action primary" data-manual-go-view="estimate" data-manual-go-step="3" data-manual-target="#system">Abrir etapa 4</button></div>
              </article>

              <article class="manual-step-card" data-manual-search-block style="margin-top:14px">
                <span class="manual-step-number">5</span>
                <span class="manual-step-kicker">Extras e composição global</span>
                <h4>Complementos e investimento</h4>
                <div class="manual-field-list">
                  <div class="manual-field-item"><strong>Piscina e paisagismo</strong><span>Entram por área, com custos específicos. Piscina não integra a área equivalente da casa.</span></div>
                  <div class="manual-field-item"><strong>Fotovoltaico, automação, climatização, elevador, carregador e reúso</strong><span>São verbas paramétricas específicas. Confirme escopo, capacidade, quantidade e padrão antes de usar em decisão financeira.</span></div>
                  <div class="manual-field-item"><strong>Projetos e aprovações</strong><span>Parcela percentual sobre o custo técnico. Deve cobrir apenas o que não está incorporado na base ou em verba externa.</span></div>
                  <div class="manual-field-item"><strong>Indiretos e BDI</strong><span>Aproxima administração, mobilização e demais componentes globais. Não é um BDI analítico calculado para uma empresa específica.</span></div>
                  <div class="manual-field-item"><strong>Contingência</strong><span>Reserva percentual ajustada aos riscos simplificados do cenário.</span></div>
                  <div class="manual-field-item"><strong>Valor adicional</strong><span>Permite somar terreno, mobiliário, taxas ou outra verba não estimada. Descreva claramente para evitar dupla contagem. A verba não recebe fatores antes da soma; interprete separadamente sua participação na faixa consolidada.</span></div>
                </div>
                <div class="manual-actions"><button type="button" class="manual-action primary" data-manual-go-view="estimate" data-manual-go-step="4" data-manual-target="#pool">Abrir etapa 5</button></div>
              </article>
            </section>

            <section class="manual-section" data-manual-section="resultados" aria-labelledby="manualHeadingResultados">
              <div class="manual-section-heading">
                <span class="manual-section-kicker">05 · Saídas</span>
                <h3 id="manualHeadingResultados">Como interpretar os resultados</h3>
                <p>Leia o resultado em camadas. O valor provável não deve ser destacado sem a data-base, a faixa, as premissas e as limitações que o acompanham.</p>
              </div>

              <div class="manual-card is-accent" data-manual-search-block>
                <h4>Ordem de leitura recomendada</h4>
                <ol>
                  <li>Confirme nome, município, versão e data-base no cabeçalho.</li>
                  <li>Compare <strong>custo técnico</strong> e <strong>investimento total provável</strong>.</li>
                  <li>Observe mínimo, máximo e percentual de incerteza.</li>
                  <li>Verifique compatibilidade entre área e programa.</li>
                  <li>Leia a ponte do investimento para saber o que está incluído.</li>
                  <li>Examine maiores impactos, alertas, recomendações e premissas.</li>
                  <li>Só depois use custo/m², prazo e quantitativos como referências auxiliares.</li>
                </ol>
              </div>

              <div class="manual-table-wrap" data-manual-search-block style="margin-top:14px">
                <div class="manual-table-title"><h4>Cartões e indicadores principais</h4><p>O significado de cada saída do cabeçalho do resultado.</p></div>
                <div class="manual-table-scroll"><table class="manual-table">
                  <thead><tr><th>Saída</th><th>Interpretação</th><th>Cuidado</th></tr></thead>
                  <tbody>
                    <tr><td>Custo técnico da execução</td><td>Núcleo paramétrico mais itens físicos específicos.</td><td>Não inclui automaticamente todas as despesas do empreendimento.</td></tr>
                    <tr><td>Investimento total provável</td><td>Custo técnico + parcelas globais selecionadas + verba adicional.</td><td>Confira a ponte para saber o que foi ativado.</td></tr>
                    <tr><td>Mínimo e máximo</td><td>Faixa simétrica em torno do investimento provável, conforme incerteza do MVP.</td><td>Não é intervalo estatístico certificado nem garantia de preço.</td></tr>
                    <tr><td>Base de preços</td><td>Escopo e data da referência monetária utilizada.</td><td>Uma base antiga não é atualizada automaticamente pela inflação.</td></tr>
                    <tr><td>Custo-base</td><td>R$/m² inicial da versão de preços.</td><td>Não compare diretamente com custo técnico/m².</td></tr>
                    <tr><td>Área equivalente</td><td>Área ponderada usada na formação do núcleo.</td><td>Não corresponde à área legal, vendável ou de medição.</td></tr>
                    <tr><td>Prazo provável</td><td>Faixa aproximada derivada da área.</td><td>Não substitui cronograma, produtividade e caminho crítico.</td></tr>
                    <tr><td>Confiabilidade</td><td>Classificação simplificada das informações.</td><td>Não certifica qualidade dos projetos.</td></tr>
                    <tr><td>Completude</td><td>Índice indicativo do preenchimento/maturidade.</td><td>No MVP atual depende fortemente da sondagem.</td></tr>
                    <tr><td>Incerteza</td><td>Percentual que forma a faixa mínima–máxima.</td><td>Não deve ser somado à contingência.</td></tr>
                    <tr><td>Contingência</td><td>Reserva incluída quando selecionada.</td><td>Não substitui matriz de riscos nem análise probabilística.</td></tr>
                  </tbody>
                </table></div>
              </div>

              <div class="manual-grid" style="margin-top:14px">
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Compatibilidade da área com o programa</h4>
                  <p>Mostra classificação, área informada, mínimo, faixa recomendada, adequação e componentes da memória. Use-a para detectar um programa excessivo para a área ou uma casa superdimensionada.</p>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Custo técnico por subsistema</h4>
                  <p>Expõe quanto do núcleo foi atribuído a cada etapa e quais itens específicos foram somados. Passe o ponteiro sobre as linhas para ver o critério do direcionador.</p>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Ponte até o investimento total</h4>
                  <p>É a reconciliação mais importante: mostra custo técnico, projetos, indiretos/BDI, contingência e verba adicional, inclusive parcelas desativadas com valor zero.</p>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Quantitativos intermediários</h4>
                  <p>Registram a memória geométrica e de pontos. Servem para explicar e comparar o modelo, nunca para compra, medição ou dimensionamento.</p>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Maiores impactos</h4>
                  <p>Ordenam variáveis e extras pelo impacto aproximado. São úteis para priorizar verificações e criar cenários de economia.</p>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Fatores aplicados</h4>
                  <p>Mostram cada multiplicador e seu efeito sequencial aproximado. Um fator menor que 1 reduz; maior que 1 eleva.</p>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Alertas e recomendações</h4>
                  <p>Apontam lacunas, fallback de base, ausência de sondagem e ações para qualificar a próxima rodada.</p>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Premissas, base e limitações</h4>
                  <p>Este quadro deve acompanhar qualquer compartilhamento do valor. Ele registra exclusões, método, versões e natureza paramétrica.</p>
                </article>
              </div>

              <div class="manual-callout warning" data-manual-search-block style="margin-top:14px">
                <h4>Custo por m²: use o denominador correto</h4>
                <p>Os cartões dividem custo técnico e investimento pela <strong>área principal</strong>. Como garagem, varanda, subsolo, piscina e outros itens estão no numerador, duas casas com a mesma área principal podem ter custos por m² muito diferentes. Sempre compare também o escopo.</p>
              </div>

              <div class="manual-actions">
                <button type="button" class="manual-action primary" data-manual-go-view="estimate" data-manual-target="#resultPanel">Ir ao resultado atual</button>
                <button type="button" class="manual-action" data-manual-go-view="estimate" data-manual-go-step="4" data-manual-target="#calculateButton">Calcular um resultado</button>
              </div>
            </section>

            <section class="manual-section" data-manual-section="cenarios" aria-labelledby="manualHeadingCenarios">
              <div class="manual-section-heading">
                <span class="manual-section-kicker">06 · Histórico local</span>
                <h3 id="manualHeadingCenarios">Cenários salvos e comparação</h3>
                <p>O melhor uso de um modelo paramétrico é comparar alternativas coerentes. O sistema permite criar uma pequena biblioteca local de simulações.</p>
              </div>

              <div class="manual-table-wrap" data-manual-search-block>
                <div class="manual-table-title"><h4>Ações disponíveis</h4><p>Os cenários só são gravados quando você clica em “Salvar cenário”.</p></div>
                <div class="manual-table-scroll"><table class="manual-table">
                  <thead><tr><th>Ação</th><th>O que faz</th><th>Observação</th></tr></thead>
                  <tbody>
                    <tr><td>Salvar cenário</td><td>Cria um registro local com entradas, resultado e versões.</td><td>Se um cenário já estiver aberto, o botão atualiza aquele registro.</td></tr>
                    <tr><td>Atualizar lista</td><td>Relê o armazenamento local e ordena os registros.</td><td>Útil após criar, editar, duplicar ou excluir.</td></tr>
                    <tr><td>Abrir</td><td>Carrega entradas e resultado no formulário.</td><td>O cenário passa a ser o registro ativo para eventual atualização.</td></tr>
                    <tr><td>Duplicar</td><td>Cria uma cópia independente.</td><td>Recomendado antes de alterar uma única hipótese para comparar.</td></tr>
                    <tr><td>PDF</td><td>Gera o relatório do cenário salvo.</td><td>O relatório é recriado no navegador.</td></tr>
                    <tr><td>Excluir</td><td>Remove definitivamente o registro local após confirmação.</td><td>Não há lixeira ou restauração no MVP.</td></tr>
                    <tr><td>Comparar</td><td>Exibe diferenças entre dois cenários em custo, área, prazo e base.</td><td>Escolha bases/data-base equivalentes para comparação econômica justa.</td></tr>
                  </tbody>
                </table></div>
              </div>

              <div class="manual-grid" style="margin-top:14px">
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Método de comparação recomendado</h4>
                  <ol>
                    <li>Calcule e salve um cenário-base.</li>
                    <li>Duplique-o.</li>
                    <li>Altere apenas uma decisão: área, acabamento, piscina, pavimentos etc.</li>
                    <li>Recalcule e salve a cópia.</li>
                    <li>Compare A e B e leia também os impactos e premissas.</li>
                  </ol>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Nomes que facilitam auditoria</h4>
                  <p>Prefira nomes autoexplicativos e padronizados:</p>
                  <ul>
                    <li>“Base — 180 m² — superior — piscina”</li>
                    <li>“Alternativa A — 160 m² — médio — sem piscina”</li>
                    <li>“Alternativa B — 2 pavimentos — steel frame”</li>
                  </ul>
                </article>
              </div>

              <div class="manual-callout warning" data-manual-search-block style="margin-top:14px">
                <h4>Armazenamento local não é banco corporativo</h4>
                <p>Os registros ficam associados ao navegador e à origem usada para abrir o sistema. Abrir por endereço diferente, limpar dados do site, navegar em modo privado ou trocar de computador pode resultar em uma lista vazia.</p>
              </div>

              <div class="manual-actions">
                <button type="button" class="manual-action primary" data-manual-go-view="scenarios" data-manual-target="#scenariosBody">Abrir cenários salvos</button>
                <button type="button" class="manual-action" data-manual-go-view="scenarios" data-manual-target="#compareA">Abrir comparação</button>
              </div>
            </section>

            <section class="manual-section" data-manual-section="parametros" aria-labelledby="manualHeadingParametros">
              <div class="manual-section-heading">
                <span class="manual-section-kicker">07 · Governança</span>
                <h3 id="manualHeadingParametros">Parâmetros, bases de preços e versões</h3>
                <p>A rastreabilidade é tão importante quanto o número calculado. Toda base deve ter local, data, versão, fonte e observações; todo conjunto de parâmetros deve ter revisão identificável.</p>
              </div>

              <div class="manual-grid">
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Nova versão de preços</h4>
                  <p>Escolha escopo municipal ou estadual, local, data-base, custo-base, identificador, fonte e observações. Em uma implantação com backend, ativar a versão torna-a elegível para seleção automática e preserva a anterior como histórica.</p>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Histórico e ativação</h4>
                  <p>O histórico permite consultar versões antigas e reativar uma referência. Isso torna possível reproduzir um estudo na data-base original em vez de sobrescrever valores.</p>
                </article>
              </div>

              <div class="manual-table-wrap" data-manual-search-block style="margin-top:14px">
                <div class="manual-table-title"><h4>Principais grupos do JSON do motor</h4><p>O editor exibe o conjunto completo de parâmetros em formato estruturado.</p></div>
                <div class="manual-table-scroll"><table class="manual-table">
                  <thead><tr><th>Grupo</th><th>Função</th><th>Exemplos</th></tr></thead>
                  <tbody>
                    <tr><td><code>region_factors</code></td><td>Diferenças regionais por UF.</td><td>SP, SC, DF, AC etc.</td></tr>
                    <tr><td><code>finish_factors</code></td><td>Padrão global de acabamento.</td><td>Econômico, médio, superior, alto luxo.</td></tr>
                    <tr><td><code>system_factors</code></td><td>Tecnologia construtiva predominante.</td><td>Alvenaria, paredes de concreto, steel frame, modular.</td></tr>
                    <tr><td><code>roof_factors</code></td><td>Solução predominante de cobertura.</td><td>Cerâmica, termoacústica, laje, cobertura verde.</td></tr>
                    <tr><td><code>flooring_factors</code> e <code>window_factors</code></td><td>Pisos e esquadrias predominantes.</td><td>Porcelanato, madeira, PVC, grandes vãos.</td></tr>
                    <tr><td><code>slope_factors</code>, <code>soil_factors</code>, <code>access_factors</code></td><td>Condições de implantação.</td><td>Plano/inclinado, firme/mole, fácil/difícil.</td></tr>
                    <tr><td><code>floors_factors</code> e <code>complexity_factors</code></td><td>Verticalização e forma da planta.</td><td>1 a 4 pavimentos; compacta a complexa.</td></tr>
                    <tr><td><code>equivalent_area_coefficients</code></td><td>Conversão de áreas complementares.</td><td>Garagem, varanda, subsolo, pé-direito duplo.</td></tr>
                    <tr><td><code>specific_costs</code></td><td>Custos de itens que entram separadamente.</td><td>Piscina, paisagismo, contenção, demolição.</td></tr>
                    <tr><td><code>rates</code></td><td>Percentuais globais e de automação.</td><td>Projetos, indiretos/BDI, contingência.</td></tr>
                    <tr><td><code>quantity_coefficients</code></td><td>Coeficientes geométricos e de pontos.</td><td>Pé-direito, paredes, cobertura, instalações.</td></tr>
                    <tr><td><code>program_area_compatibility</code></td><td>Parâmetros para área × programa.</td><td>Áreas por ambiente e faixas recomendadas.</td></tr>
                  </tbody>
                </table></div>
              </div>

              <details class="manual-details" data-manual-search-block>
                <summary>Como editar o JSON com segurança?</summary>
                <div class="manual-details-body">
                  <ol>
                    <li>Use <strong>Recarregar parâmetros</strong> antes de editar.</li>
                    <li>Copie o JSON para um arquivo de segurança.</li>
                    <li>Altere um grupo por vez, mantendo aspas, vírgulas, chaves e tipos numéricos.</li>
                    <li>Atualize <code>version</code>, <code>date_base</code> e a observação da revisão.</li>
                    <li>Salve e execute cenários de teste conhecidos.</li>
                    <li>Compare resultados e verifique se as mudanças ocorreram apenas onde esperado.</li>
                  </ol>
                  <p>JSON inválido é bloqueado antes do envio. JSON válido, porém tecnicamente incoerente, pode produzir resultados incorretos; a validação técnica continua sendo responsabilidade do administrador.</p>
                </div>
              </details>

              <div class="manual-callout warning" data-manual-search-block style="margin-top:14px">
                <h4>Limitação do modo estático deste pacote</h4>
                <p>O arquivo <code>static-api.js</code> simula uma API no navegador. Cenários são persistidos localmente, mas alterações administrativas e novas bases operam em caráter demonstrativo e podem não sobreviver ao recarregamento. Para uso institucional, conecte o painel a um backend com banco de dados, autenticação, trilha de auditoria e backup.</p>
              </div>

              <div class="manual-callout warning" data-manual-search-block style="margin-top:14px">
                <h4>Chave “admin-demo” não é segurança real</h4>
                <p>Em aplicação totalmente estática, código e credenciais do lado do cliente podem ser inspecionados. A chave padrão existe apenas para demonstrar o fluxo. Proteção efetiva requer autenticação e autorização verificadas no servidor.</p>
              </div>

              <div class="manual-actions">
                <button type="button" class="manual-action primary" data-manual-go-view="admin" data-manual-target="#priceBaseScope">Abrir bases de preços</button>
                <button type="button" class="manual-action" data-manual-go-view="admin" data-manual-target="#parametersEditor">Abrir editor de parâmetros</button>
              </div>
            </section>

            <section class="manual-section" data-manual-section="dados" aria-labelledby="manualHeadingDados">
              <div class="manual-section-heading">
                <span class="manual-section-kicker">08 · Operação</span>
                <h3 id="manualHeadingDados">PDF, dados locais e execução do sistema</h3>
                <p>O aplicativo foi empacotado como publicação web estática. O navegador executa o motor, monta o relatório e guarda os cenários locais.</p>
              </div>

              <div class="manual-grid">
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Relatório PDF</h4>
                  <p>O botão <strong>Gerar PDF</strong> recria a estimativa e gera um documento com resumo executivo, base de preços, premissas, compatibilidade, ponte do investimento, subsistemas, quantitativos, fatores, impactos, alertas e limitações.</p>
                  <p>O nome do arquivo é derivado do nome da estimativa. Revise o PDF antes de compartilhar e mantenha a data-base visível.</p>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Indicador do motor</h4>
                  <p>O selo no canto superior direito consulta a rota de saúde. Verde indica que o motor e a versão de parâmetros foram carregados; vermelho indica falha de acesso aos arquivos ou de execução.</p>
                  <p>Esse selo verifica disponibilidade, não a qualidade técnica da calibração.</p>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Dados dos cenários</h4>
                  <p>São guardados em <code>localStorage</code>, incluindo entradas, resultado, identificador e datas. Eles permanecem após fechar o navegador, salvo limpeza de dados ou mudança de origem.</p>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Tela de abertura</h4>
                  <p>A aceitação do aviso é lembrada em <code>sessionStorage</code>: normalmente permanece apenas enquanto a sessão do navegador estiver aberta. “Tela inicial” reabre a apresentação em modo resumido.</p>
                </article>
              </div>

              <div class="manual-callout" data-manual-search-block style="margin-top:14px">
                <h4>Abra por um servidor web local</h4>
                <p>Como o sistema carrega JSON e scripts por caminhos relativos, o modo mais confiável é servir a pasta por HTTP, e não abrir <code>index.html</code> diretamente como <code>file://</code>. Exemplo: na pasta do sistema, execute <code>python -m http.server 8000</code> e abra <code>http://localhost:8000</code>.</p>
              </div>

              <div class="manual-table-wrap" data-manual-search-block style="margin-top:14px">
                <div class="manual-table-title"><h4>Diagnóstico rápido de problemas</h4></div>
                <div class="manual-table-scroll"><table class="manual-table">
                  <thead><tr><th>Sintoma</th><th>Causa provável</th><th>Ação</th></tr></thead>
                  <tbody>
                    <tr><td>Motor indisponível</td><td>Arquivos JSON não carregados, caminho alterado ou bloqueio do modo <code>file://</code>.</td><td>Use servidor HTTP e preserve a estrutura de pastas.</td></tr>
                    <tr><td>Cenários desapareceram</td><td>Limpeza de dados, navegador/origem diferente ou modo privado.</td><td>Volte à mesma origem; no MVP não há restauração automática.</td></tr>
                    <tr><td>Município usa base estadual</td><td>Não há correspondência municipal ativa exata.</td><td>Revise grafia, UF, status e versão cadastrada.</td></tr>
                    <tr><td>PDF não baixa</td><td>Política de downloads ou pop-ups do navegador.</td><td>Permita downloads para a origem e tente novamente.</td></tr>
                    <tr><td>Resultado parece muito alto/baixo</td><td>Área complementar duplicada, fator extremo, base inadequada ou extra ativado.</td><td>Leia a ponte, fatores e maiores impactos; duplique o cenário e teste uma variável por vez.</td></tr>
                    <tr><td>JSON não salva</td><td>Sintaxe inválida ou chave administrativa incorreta.</td><td>Valide chaves, vírgulas, aspas, tipos e credencial.</td></tr>
                  </tbody>
                </table></div>
              </div>

              <div class="manual-callout warning" data-manual-search-block style="margin-top:14px">
                <h4>Privacidade e backup</h4>
                <p>Processamento local reduz o envio de dados, mas não elimina riscos do dispositivo. Não insira informações pessoais desnecessárias. Para operação real, implemente exportação estruturada, backups, controle de acesso, retenção e registro de alterações.</p>
              </div>

              <div class="manual-actions">
                <button type="button" class="manual-action primary" data-manual-go-view="estimate" data-manual-target="#pdfButton">Ir ao botão de PDF</button>
                <button type="button" class="manual-action" data-manual-go-view="estimate" data-manual-target="#healthBadge">Ver estado do motor</button>
              </div>
            </section>

            <section class="manual-section" data-manual-section="boas-praticas" aria-labelledby="manualHeadingBoasPraticas">
              <div class="manual-section-heading">
                <span class="manual-section-kicker">09 · Uso responsável</span>
                <h3 id="manualHeadingBoasPraticas">Boas práticas e limites de decisão</h3>
                <p>A qualidade da estimativa depende mais da consistência das premissas e da calibração do que da aparência de precisão dos valores monetários.</p>
              </div>

              <div class="manual-grid">
                <article class="manual-card is-accent manual-col-4" data-manual-search-block>
                  <h4>1. Rastreie a fonte</h4>
                  <p>Registre origem, data-base, local, escopo, unidade, tributos e condições da referência. Não use um número sem saber o que ele inclui.</p>
                </article>
                <article class="manual-card is-accent manual-col-4" data-manual-search-block>
                  <h4>2. Compare com coerência</h4>
                  <p>Mantenha a mesma base e altere uma variável por vez. Comparar cenários de datas ou escopos diferentes pode produzir conclusão falsa.</p>
                </article>
                <article class="manual-card is-accent manual-col-4" data-manual-search-block>
                  <h4>3. Aumente a maturidade</h4>
                  <p>À medida que surgirem projetos, sondagem, topografia e cotações, substitua fatores genéricos por dados específicos e migre para orçamento analítico.</p>
                </article>
              </div>

              <div class="manual-table-wrap" data-manual-search-block style="margin-top:14px">
                <div class="manual-table-title"><h4>Escada de maturidade da estimativa</h4><p>O sistema ocupa a primeira faixa; as etapas seguintes exigem aprofundamento técnico.</p></div>
                <div class="manual-table-scroll"><table class="manual-table">
                  <thead><tr><th>Nível</th><th>Informação disponível</th><th>Uso adequado</th></tr></thead>
                  <tbody>
                    <tr><td>Paramétrico preliminar</td><td>Área, programa, terreno aparente, padrão e referências gerais.</td><td>Viabilidade, comparação de alternativas e teto inicial.</td></tr>
                    <tr><td>Paramétrico calibrado</td><td>Base regional auditável, tipologia definida e riscos identificados.</td><td>Planejamento preliminar e seleção de solução.</td></tr>
                    <tr><td>Anteprojeto / estimativa por sistemas</td><td>Geometria, soluções principais, sondagem e quantitativos por sistema.</td><td>Decisão de investimento e contratação de projetos.</td></tr>
                    <tr><td>Orçamento sintético</td><td>Projetos com quantitativos consolidados e preços de referência.</td><td>Controle de escopo e avaliação orçamentária.</td></tr>
                    <tr><td>Orçamento analítico</td><td>Serviços, composições, cotações, encargos, BDI, cronograma e riscos.</td><td>Contratação, negociação, execução, medição e controle.</td></tr>
                  </tbody>
                </table></div>
              </div>

              <div class="manual-grid" style="margin-top:14px">
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Crie famílias de cenário</h4>
                  <ul>
                    <li>Área: compacta, base e ampliada.</li>
                    <li>Padrão: econômico, médio e superior.</li>
                    <li>Implantação: sem e com subsolo/contenção.</li>
                    <li>Fases: núcleo da casa e complementos futuros.</li>
                    <li>Solução: comparar sistemas construtivos viáveis para a região.</li>
                  </ul>
                </article>
                <article class="manual-card manual-col-6" data-manual-search-block>
                  <h4>Evite falsa precisão</h4>
                  <ul>
                    <li>Arredonde valores para comunicação executiva.</li>
                    <li>Apresente sempre faixa, data-base e premissas.</li>
                    <li>Não transforme quantitativos paramétricos em listas de compra.</li>
                    <li>Não trate prazo indicativo como compromisso contratual.</li>
                    <li>Não escolha solução apenas pelo menor resultado sem analisar desempenho e riscos.</li>
                  </ul>
                </article>
              </div>

              <div class="manual-checklist" data-manual-search-block style="margin-top:14px">
                <h4>Checklist para compartilhar o resultado</h4>
                <div class="manual-checklist-grid">
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="share-date"><span>O documento mostra versão e data-base.</span></label>
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="share-range"><span>Apresentei provável, mínimo e máximo — não só um número.</span></label>
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="share-scope"><span>Expliquei o que está incluído no custo técnico e no investimento.</span></label>
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="share-assumptions"><span>Anexei premissas, alertas e limitações.</span></label>
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="share-source"><span>A fonte da base de preços é identificável.</span></label>
                  <label class="manual-check-item"><input type="checkbox" data-manual-check="share-professional"><span>Indiquei necessidade de validação por profissional habilitado.</span></label>
                </div>
              </div>

              <div class="manual-callout warning" data-manual-search-block style="margin-top:14px">
                <h4>Não use o resultado isoladamente para</h4>
                <p>Assinar contrato, fixar preço fechado, comprar materiais, obter financiamento, dimensionar estrutura ou instalações, aprovar projeto, medir serviço, definir aditivo, emitir laudo ou assumir responsabilidade técnica.</p>
              </div>
            </section>

            <section class="manual-section" data-manual-section="glossario" aria-labelledby="manualHeadingGlossario">
              <div class="manual-section-heading">
                <span class="manual-section-kicker">10 · Consulta rápida</span>
                <h3 id="manualHeadingGlossario">Glossário dos termos do sistema</h3>
                <p>Use a busca no topo para filtrar rapidamente conceitos, campos e funcionalidades.</p>
              </div>

              <dl class="manual-glossary">
                <div class="manual-glossary-item" data-manual-search-block><dt>Área principal</dt><dd>Área-base da casa informada pelo usuário, sem garagem, varanda/sacada, piscina e subsolo.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Área física estimada</dt><dd>Soma aproximada da casa, garagem física, varandas e subsolo. Não é área legal certificada.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Área equivalente</dt><dd>Conversão de áreas com custos relativos diferentes para uma unidade comum usada no núcleo paramétrico.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Base de preços</dt><dd>Registro versionado de custo-base, local, data, fonte e observações.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Custo-base</dt><dd>Referência inicial em R$/m² antes da área equivalente, fatores e itens específicos.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Fator multiplicador</dt><dd>Coeficiente que aumenta, mantém ou reduz uma parcela do modelo. Fatores compostos são multiplicados.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Núcleo paramétrico</dt><dd>Área equivalente multiplicada pelo custo-base e por todos os fatores principais.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Item específico</dt><dd>Parcela somada separadamente, como piscina, demolição, paisagismo ou elevador.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Custo técnico</dt><dd>Estimativa da execução física: núcleo paramétrico mais itens físicos específicos.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Investimento total provável</dt><dd>Custo técnico acrescido de projetos, indiretos/BDI, contingência e verba adicional selecionada.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>BDI / indiretos</dt><dd>Parcela global simplificada para custos e componentes que não aparecem diretamente nos subsistemas. Não é BDI empresarial analítico.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Contingência</dt><dd>Reserva monetária incluída no provável para riscos e indefinições compatíveis com o nível do estudo.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Incerteza</dt><dd>Amplitude usada para formar a faixa mínima e máxima em torno do investimento provável.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Compatibilidade área × programa</dt><dd>Teste preliminar entre área principal e quantidade de ambientes, pavimentos e complexidade.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Programa de necessidades</dt><dd>Conjunto de ambientes, capacidades e relações funcionais desejadas para a residência.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Quantitativo paramétrico</dt><dd>Grandeza aproximada derivada de relações geométricas ou funcionais, usada para explicar e direcionar o modelo.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Subsistema</dt><dd>Grupo técnico da obra, como fundações, estrutura, cobertura, instalações ou acabamentos.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Custo efetivo do subsistema</dt><dd>Parcela monetária do subsistema dividida por seu quantitativo direcionador; não é preço unitário de contratação.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Sensibilidade / impacto</dt><dd>Efeito monetário aproximado de um fator ou item, usado para ordenar prioridades de revisão.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Confiabilidade</dt><dd>Classificação qualitativa simplificada da robustez das informações do cenário.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Completude</dt><dd>Indicador simplificado da quantidade/maturidade de informações disponíveis.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Fallback</dt><dd>Base alternativa usada quando não há referência municipal ou estadual específica disponível.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Versão ativa</dt><dd>Registro que participa da escolha automática para um local.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Versão histórica</dt><dd>Registro preservado para consulta e reprodução de estudos passados, mas não escolhido automaticamente.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>Cenário</dt><dd>Conjunto salvo de entradas, resultado, base e versão de parâmetros.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>LocalStorage</dt><dd>Armazenamento persistente do navegador usado pelo MVP para guardar cenários.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>SessionStorage</dt><dd>Armazenamento da sessão usado para lembrar que a tela de abertura já foi concluída.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>JSON</dt><dd>Formato textual estruturado usado para editar e versionar os parâmetros do motor.</dd></div>
                <div class="manual-glossary-item" data-manual-search-block><dt>MVP</dt><dd>Produto mínimo viável: versão demonstrativa destinada a validar fluxos e conceitos antes da implantação produtiva.</dd></div>
              </dl>

              <div class="manual-actions" style="margin-top:18px">
                <button type="button" class="manual-action primary" data-manual-section-link="inicio">Voltar ao início do manual</button>
                <button type="button" class="manual-action" data-manual-clear-search>Limpar pesquisa</button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>`;

  let overlay;
  let dialog;
  let content;
  let nav;
  let searchInput;
  let searchStatus;
  let searchEmpty;
  let previousFocus = null;
  let activeSection = "inicio";
  let readSections = new Set();
  let checkState = {};
  let equivalentCoefficients = {
    garage_covered: 0.48,
    garage_uncovered: 0.22,
    balcony: 0.58,
    basement: 1.30,
    double_height_extra: 0.27,
    garage_area_per_space: 13.5
  };

  document.addEventListener("DOMContentLoaded", initManual);

  function initManual() {
    document.body.insertAdjacentHTML("beforeend", manualMarkup);
    overlay = document.getElementById("interactiveManual");
    dialog = overlay?.querySelector(".manual-dialog");
    content = document.getElementById("manualContent");
    nav = document.getElementById("manualNav");
    searchInput = document.getElementById("manualSearch");
    searchStatus = document.getElementById("manualSearchStatus");
    searchEmpty = document.getElementById("manualSearchEmpty");
    if (!overlay || !dialog || !content || !nav || !searchInput) return;

    readSections = new Set(readJson(storageKeys.read, []));
    checkState = readJson(storageKeys.checks, {});
    const savedSection = safeStorageGet(storageKeys.last);
    activeSection = sectionMeta.some((item) => item.id === savedSection) ? savedSection : "inicio";

    buildNavigation();
    buildSectionFooters();
    restoreChecklist();
    bindManualEvents();
    updateReadProgress();
    setActiveSection(activeSection, { focus: false, scroll: false });
    loadEquivalentCoefficients();
    updateEquivalentSimulator();
    updateInvestmentSimulator();
  }

  function buildNavigation() {
    nav.innerHTML = sectionMeta.map((item, index) => `
      <button type="button" class="manual-nav-button" data-manual-nav="${item.id}" aria-controls="manual-section-${item.id}">
        <span class="manual-nav-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="manual-nav-label">${item.label}</span>
        <span class="manual-nav-state" aria-label="Tópico não concluído">✓</span>
      </button>`).join("");

    document.querySelectorAll("[data-manual-section]").forEach((section) => {
      section.id = `manual-section-${section.dataset.manualSection}`;
    });
  }

  function buildSectionFooters() {
    const sections = [...document.querySelectorAll("[data-manual-section]")];
    sections.forEach((section, index) => {
      if (section.querySelector(".manual-section-footer")) return;
      const meta = sectionMeta[index];
      const previous = sectionMeta[index - 1];
      const next = sectionMeta[index + 1];
      const footer = document.createElement("div");
      footer.className = "manual-section-footer";
      footer.innerHTML = `
        <button type="button" class="manual-action manual-read-button" data-manual-read="${meta.id}">Marcar tópico como lido</button>
        <div class="manual-pager">
          ${previous ? `<button type="button" class="manual-action" data-manual-section-link="${previous.id}">← ${previous.label}</button>` : ""}
          ${next ? `<button type="button" class="manual-action primary" data-manual-section-link="${next.id}">${next.label} →</button>` : ""}
        </div>`;
      section.appendChild(footer);
    });
  }

  function bindManualEvents() {
    document.getElementById("openManualButton")?.addEventListener("click", () => openManual());
    document.getElementById("closeManualButton")?.addEventListener("click", closeManual);
    document.getElementById("manualResetProgress")?.addEventListener("click", resetProgress);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeManual();
    });

    nav.addEventListener("click", (event) => {
      const button = event.target.closest("[data-manual-nav]");
      if (!button) return;
      clearSearch();
      setActiveSection(button.dataset.manualNav);
    });

    content.addEventListener("click", handleManualContentClick);
    searchInput.addEventListener("input", () => filterManual(searchInput.value));

    document.querySelectorAll("[data-manual-check]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        checkState[checkbox.dataset.manualCheck] = checkbox.checked;
        writeJson(storageKeys.checks, checkState);
      });
    });

    [
      "manualEqMain", "manualEqGarageSpaces", "manualEqGarageCovered",
      "manualEqBalcony", "manualEqBasement", "manualEqDoubleHeight"
    ].forEach((id) => document.getElementById(id)?.addEventListener("input", updateEquivalentSimulator));
    document.getElementById("manualEqGarageCovered")?.addEventListener("change", updateEquivalentSimulator);
    document.getElementById("manualApplyEqDemo")?.addEventListener("click", applyEquivalentDemoToForm);

    [
      "manualInvTechnical", "manualInvDesigns", "manualInvIndirects",
      "manualInvContingency", "manualInvContingencyRate", "manualInvOther"
    ].forEach((id) => {
      const element = document.getElementById(id);
      element?.addEventListener("input", updateInvestmentSimulator);
      element?.addEventListener("change", updateInvestmentSimulator);
    });

    document.addEventListener("keydown", handleKeyboard);
  }

  function handleManualContentClick(event) {
    const sectionLink = event.target.closest("[data-manual-section-link]");
    if (sectionLink) {
      clearSearch();
      setActiveSection(sectionLink.dataset.manualSectionLink);
      return;
    }

    const readButton = event.target.closest("[data-manual-read]");
    if (readButton) {
      toggleSectionRead(readButton.dataset.manualRead);
      return;
    }

    const clearButton = event.target.closest("[data-manual-clear-search]");
    if (clearButton) {
      clearSearch(true);
      return;
    }

    const appTarget = event.target.closest("[data-manual-go-view]");
    if (appTarget) {
      goToApplication(
        appTarget.dataset.manualGoView,
        appTarget.dataset.manualGoStep,
        appTarget.dataset.manualTarget
      );
    }
  }

  function openManual(sectionId = activeSection) {
    if (!overlay) return;
    previousFocus = document.activeElement;
    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("manual-open");
    clearSearch();
    setActiveSection(sectionId, { focus: false, scroll: true });
    window.setTimeout(() => searchInput.focus({ preventScroll: true }), 40);
  }

  function closeManual() {
    if (!overlay || overlay.classList.contains("hidden")) return;
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("manual-open");
    if (previousFocus && typeof previousFocus.focus === "function") {
      window.setTimeout(() => previousFocus.focus({ preventScroll: true }), 20);
    }
  }

  function setActiveSection(sectionId, options = {}) {
    const target = document.querySelector(`[data-manual-section="${cssEscape(sectionId)}"]`);
    if (!target) return;
    activeSection = sectionId;
    safeStorageSet(storageKeys.last, sectionId);

    document.querySelectorAll("[data-manual-section]").forEach((section) => {
      section.classList.toggle("active", section === target);
    });
    document.querySelectorAll("[data-manual-nav]").forEach((button) => {
      const isActive = button.dataset.manualNav === sectionId;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });

    if (options.scroll !== false) content.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    if (options.focus !== false) content.focus({ preventScroll: true });
    updateReadProgress();
  }

  function filterManual(query) {
    const normalizedQuery = normalizeText(query);
    const searching = normalizedQuery.length > 0;
    content.classList.toggle("is-searching", searching);
    searchStatus.classList.toggle("hidden", !searching);

    if (!searching) {
      document.querySelectorAll(".manual-search-hidden, .is-search-hidden").forEach((element) => {
        element.classList.remove("manual-search-hidden", "is-search-hidden");
      });
      searchEmpty.classList.add("hidden");
      searchStatus.textContent = "";
      setActiveSection(activeSection, { focus: false, scroll: false });
      return;
    }

    let matchingBlocks = 0;
    let matchingSections = 0;
    document.querySelectorAll("[data-manual-section]").forEach((section) => {
      const heading = normalizeText(section.querySelector(".manual-section-heading")?.textContent || "");
      const headingMatches = heading.includes(normalizedQuery);
      const blocks = [...section.querySelectorAll("[data-manual-search-block]")];
      let sectionMatches = 0;
      blocks.forEach((block) => {
        const matches = headingMatches || normalizeText(block.textContent).includes(normalizedQuery);
        block.classList.toggle("manual-search-hidden", !matches);
        if (matches) {
          matchingBlocks += 1;
          sectionMatches += 1;
        }
      });
      const hasMatch = headingMatches || sectionMatches > 0;
      section.classList.toggle("is-search-hidden", !hasMatch);
      if (hasMatch) matchingSections += 1;
    });

    searchEmpty.classList.toggle("hidden", matchingBlocks > 0);
    searchStatus.textContent = matchingBlocks
      ? `${matchingBlocks} resultado${matchingBlocks === 1 ? "" : "s"} em ${matchingSections} tópico${matchingSections === 1 ? "" : "s"}`
      : "Nenhum resultado";
    content.scrollTo({ top: 0, behavior: "auto" });
  }

  function clearSearch(focus = false) {
    if (!searchInput) return;
    searchInput.value = "";
    filterManual("");
    if (focus) searchInput.focus();
  }

  function toggleSectionRead(sectionId) {
    if (readSections.has(sectionId)) readSections.delete(sectionId);
    else readSections.add(sectionId);
    writeJson(storageKeys.read, [...readSections]);
    updateReadProgress();
  }

  function updateReadProgress() {
    const completed = sectionMeta.filter((item) => readSections.has(item.id)).length;
    const percent = Math.round((completed / sectionMeta.length) * 100);
    const progressText = document.getElementById("manualProgressText");
    const progressBar = document.getElementById("manualProgressBar");
    const progressDetail = document.getElementById("manualProgressDetail");
    if (progressText) progressText.textContent = `${percent}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressDetail) {
      progressDetail.textContent = completed === 0
        ? "Nenhum tópico marcado como lido."
        : completed === sectionMeta.length
          ? "Manual concluído. Você pode reiniciar o progresso a qualquer momento."
          : `${completed} de ${sectionMeta.length} tópicos concluídos.`;
    }

    document.querySelectorAll("[data-manual-nav]").forEach((button) => {
      const isRead = readSections.has(button.dataset.manualNav);
      button.classList.toggle("is-read", isRead);
      button.querySelector(".manual-nav-state")?.setAttribute("aria-label", isRead ? "Tópico concluído" : "Tópico não concluído");
    });
    document.querySelectorAll("[data-manual-read]").forEach((button) => {
      const isRead = readSections.has(button.dataset.manualRead);
      button.classList.toggle("is-read", isRead);
      button.textContent = isRead ? "✓ Tópico marcado como lido" : "Marcar tópico como lido";
    });
  }

  function resetProgress() {
    readSections.clear();
    writeJson(storageKeys.read, []);
    updateReadProgress();
  }

  function restoreChecklist() {
    document.querySelectorAll("[data-manual-check]").forEach((checkbox) => {
      checkbox.checked = Boolean(checkState[checkbox.dataset.manualCheck]);
    });
  }

  function goToApplication(viewName, stepValue, targetSelector) {
    closeManual();
    window.setTimeout(() => {
      if (typeof window.switchView === "function") window.switchView(viewName);
      else fallbackSwitchView(viewName);

      const step = Number(stepValue);
      if (Number.isFinite(step) && typeof window.showStep === "function") window.showStep(step);

      window.setTimeout(() => {
        let target = targetSelector ? document.querySelector(targetSelector) : null;
        if (target?.classList.contains("hidden") || target?.closest(".hidden")) {
          if (targetSelector === "#resultPanel") {
            if (typeof window.showStep === "function") window.showStep(4);
            target = document.querySelector("#calculateButton");
            notify("Calcule uma estimativa para abrir o painel de resultados.", "error");
          }
        }
        if (!target) return;
        const highlightTarget = target.closest(".field, .check-card, .panel, .wizard-card, .result-heading, .hero, .health") || target;
        highlightTarget.classList.add("manual-focus-pulse");
        target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
        if (typeof target.focus === "function" && !target.disabled) {
          window.setTimeout(() => target.focus({ preventScroll: true }), 320);
        }
        window.setTimeout(() => highlightTarget.classList.remove("manual-focus-pulse"), 1900);
      }, 260);
    }, 100);
  }

  function fallbackSwitchView(viewName) {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewName));
    document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === `view-${viewName}`));
  }

  function handleKeyboard(event) {
    const manualIsOpen = overlay && !overlay.classList.contains("hidden");
    const targetIsEditable = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement;

    if (!manualIsOpen && event.key === "F1") {
      const appVisible = document.getElementById("applicationRoot")?.getAttribute("aria-hidden") !== "true";
      if (appVisible) {
        event.preventDefault();
        openManual();
      }
      return;
    }
    if (!manualIsOpen) return;

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
      return;
    }
    if (event.key === "/" && !targetIsEditable) {
      event.preventDefault();
      searchInput.focus();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      if (searchInput.value) clearSearch(true);
      else closeManual();
      return;
    }
    if (event.altKey && event.key === "ArrowRight") {
      event.preventDefault();
      navigateRelative(1);
      return;
    }
    if (event.altKey && event.key === "ArrowLeft") {
      event.preventDefault();
      navigateRelative(-1);
      return;
    }
    if (event.key === "Tab") trapFocus(event);
  }

  function navigateRelative(direction) {
    clearSearch();
    const index = sectionMeta.findIndex((item) => item.id === activeSection);
    const nextIndex = Math.max(0, Math.min(sectionMeta.length - 1, index + direction));
    if (nextIndex !== index) setActiveSection(sectionMeta[nextIndex].id);
  }

  function trapFocus(event) {
    const focusable = [...dialog.querySelectorAll(
      "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], details > summary, [tabindex]:not([tabindex='-1'])"
    )].filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function loadEquivalentCoefficients() {
    try {
      const response = await fetch("/api/parameters");
      if (!response.ok) return;
      const parameters = await response.json();
      equivalentCoefficients = {
        ...equivalentCoefficients,
        ...(parameters.equivalent_area_coefficients || {})
      };
      updateEquivalentSimulator();
    } catch {
      // Mantém os coeficientes demonstrativos incorporados ao manual.
    }
  }

  function updateEquivalentSimulator() {
    const main = numberValue("manualEqMain");
    const spaces = numberValue("manualEqGarageSpaces");
    const balcony = numberValue("manualEqBalcony");
    const basement = numberValue("manualEqBasement");
    const doubleHeight = numberValue("manualEqDoubleHeight");
    const covered = document.getElementById("manualEqGarageCovered")?.checked;
    const garagePhysical = spaces * Number(equivalentCoefficients.garage_area_per_space || 13.5);
    const garageCoefficient = covered
      ? Number(equivalentCoefficients.garage_covered || 0.48)
      : Number(equivalentCoefficients.garage_uncovered || 0.22);
    const weightedGarage = garagePhysical * garageCoefficient;
    const weightedBalcony = balcony * Number(equivalentCoefficients.balcony || 0.58);
    const weightedBasement = basement * Number(equivalentCoefficients.basement || 1.30);
    const weightedDouble = doubleHeight * Number(equivalentCoefficients.double_height_extra || 0.27);
    const total = main + weightedGarage + weightedBalcony + weightedBasement + weightedDouble;

    const output = document.getElementById("manualEqResult");
    const breakdown = document.getElementById("manualEqBreakdown");
    if (output) output.textContent = `${formatNumber(total)} m²-eq`;
    if (breakdown) {
      breakdown.textContent = `Principal ${formatNumber(main)} + garagem ${formatNumber(weightedGarage)} + varandas ${formatNumber(weightedBalcony)} + subsolo ${formatNumber(weightedBasement)} + pé-direito duplo ${formatNumber(weightedDouble)}.`;
    }
  }

  function applyEquivalentDemoToForm() {
    const values = {
      builtArea: numberValue("manualEqMain"),
      garageSpaces: numberValue("manualEqGarageSpaces"),
      balconiesArea: numberValue("manualEqBalcony"),
      basementArea: numberValue("manualEqBasement"),
      doubleHeightArea: numberValue("manualEqDoubleHeight")
    };
    Object.entries(values).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (!element) return;
      element.value = String(value);
      element.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const garageCovered = document.getElementById("garageCovered");
    if (garageCovered) {
      garageCovered.checked = Boolean(document.getElementById("manualEqGarageCovered")?.checked);
      garageCovered.dispatchEvent(new Event("change", { bubbles: true }));
    }
    goToApplication("estimate", "2", "#builtArea");
    notify("Valores do simulador aplicados à etapa Casa.", "success");
  }

  function updateInvestmentSimulator() {
    const technical = numberValue("manualInvTechnical");
    const designsEnabled = document.getElementById("manualInvDesigns")?.checked;
    const indirectsEnabled = document.getElementById("manualInvIndirects")?.checked;
    const contingencyEnabled = document.getElementById("manualInvContingency")?.checked;
    const contingencyRate = numberValue("manualInvContingencyRate");
    const other = numberValue("manualInvOther");
    const designs = designsEnabled ? technical * 0.055 : 0;
    const indirects = indirectsEnabled ? technical * 0.12 : 0;
    const contingency = contingencyEnabled ? technical * contingencyRate / 100 : 0;
    const total = technical + designs + indirects + contingency + other;
    const output = document.getElementById("manualInvResult");
    const breakdown = document.getElementById("manualInvBreakdown");
    if (output) output.textContent = formatMoney(total);
    if (breakdown) {
      breakdown.textContent = `Técnico ${formatMoney(technical)} + projetos ${formatMoney(designs)} + indiretos/BDI ${formatMoney(indirects)} + contingência ${formatMoney(contingency)} + adicional ${formatMoney(other)}.`;
    }
  }

  function notify(message, type = "") {
    if (typeof window.toast === "function") window.toast(message, type);
  }

  function numberValue(id) {
    const value = Number(document.getElementById(id)?.value || 0);
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  }

  function formatMoney(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(Number(value || 0));
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function cssEscape(value) {
    if (window.CSS?.escape) return window.CSS.escape(value);
    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function readJson(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* armazenamento indisponível */ }
  }

  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); } catch { /* armazenamento indisponível */ }
  }

  function prefersReducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  }
})();
