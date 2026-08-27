# Documentacao completa do site Obras Inteligentes

Atualizado em: 05/08/2026  
Dominio publicado: https://www.obrasinteligentes.ia.br/  
Diretorio local principal: `C:\Obras Inteligentes`  
Repositorio GitHub: `https://github.com/andrebaetaobraspublicas-collab/obras-inteligentes-site.git`  
Branch de publicacao: `main`  
Ultimo commit base verificado nesta documentacao: `c2d2bf7` - `Documenta site Obras Inteligentes`

## Objetivo deste documento

Este arquivo registra o estado atual do site, dos aplicativos publicados, da estrutura local e do fluxo de publicacao. Ele deve ser lido por qualquer novo prompt/atendimento antes de continuar alteracoes no site.

## Resumo do site

O site `www.obrasinteligentes.ia.br` e uma pagina estatica hospedada na Hostinger, publicada a partir do repositorio GitHub indicado acima. A tela inicial fica em:

```text
C:\Obras Inteligentes\index.html
```

A tela inicial possui atualmente 60 cards de aplicativos. Cada card aponta para uma rota estatica dentro do dominio. A regra geral e:

```text
https://www.obrasinteligentes.ia.br/nome-da-rota/
C:\Obras Inteligentes\nome-da-rota\index.html
```

Em 05/08/2026, a tela inicial recebeu novo hero visual com imagem 3D de obra em execucao e camada de inteligencia artificial, animacoes leves em CSS e preservacao integral dos cards, artigos, textos e rotas existentes. O asset principal da home e:

```text
C:\Obras Inteligentes\assets\hero-obras-ai-3d.png
```

Em 05/08/2026, o link `Contato` no rodape passou a apontar para `https://www.instagram.com/andrebeta.obraspublicas/`.

Excecoes/observacoes:

- Alguns cards usam URL absoluta no `href`, mas a rota final continua dentro do mesmo dominio.
- A pasta `casa-parametrica` tem arquivos auxiliares em `data/` e `static/`.
- A pasta `manutencao` tem `index.html` e `mp_backend.js`.
- As pastas antigas `Sistema Manutenção Predial` e `Gestão e Fiscalização de Contratos` sao fontes/backup historicos e estao ignoradas pelo Git.

## Inventario verificado dos aplicativos

Inventario originalmente verificado em 21/07/2026 e atualizado em 27/08/2026 para inclusao do IcamentoPro no filtro Estruturas. Todos os cards listados possuem arquivo local correspondente.

| Card | Aplicativo | Rota publicada | Arquivo local principal | Status local | Status site |
|---|---|---|---|---|---|
| 01 / MANUTENCAO | Manutencao Predial | `/manutencao/` | `C:\Obras Inteligentes\manutencao\index.html` | existe | 200 |
| 02 / FISCALIZACAO | Fiscalizacao de Contratos | `/fiscalizacao/` | `C:\Obras Inteligentes\fiscalizacao\index.html` | existe | 200 |
| 03 / ESTRUTURAL | Calculadora de Estrutural | `/estrutural/` | `C:\Obras Inteligentes\estrutural\index.html` | existe | 200 |
| 04 / PAVIMENTOS | Calculadora de Pavimentos | `/pavimentos/` | `C:\Obras Inteligentes\pavimentos\index.html` | existe | 200 |
| 05 / RISCOS | Mapa & Matriz de Riscos | `/riscos/` | `C:\Obras Inteligentes\riscos\index.html` | existe | 200 |
| 06 / CANTEIRO | Administracao Local e Canteiro de Obra | `/administracao-canteiro/` | `C:\Obras Inteligentes\administracao-canteiro\index.html` | existe | 200 |
| 07 / MEMORIAL | Gerador Automatico de Memorial Descritivo | `/memorial-descritivo/` | `C:\Obras Inteligentes\memorial-descritivo\index.html` | existe | 200 |
| 08 / SISPAV | Sispav - Sistema de Reabilitacao e Gestao de Pavimentos | `/sispav-reabilitacao/` | `C:\Obras Inteligentes\sispav-reabilitacao\index.html` | existe | 200 |
| 09 / ARRIMO | Calculadora de Muros de Arrimo | `/muros-arrimo/` | `C:\Obras Inteligentes\muros-arrimo\index.html` | existe | 200 |
| 10 / CASA | Casa Parametrica | `/casa-parametrica/` | `C:\Obras Inteligentes\casa-parametrica\index.html` | existe | 200 |
| 11 / TERMOPRO | TermoPro | `/termopro/` | `C:\Obras Inteligentes\termopro\index.html` | existe | 200 |
| 12 / CIRCUITOS | CircuitoPro | `/circuitopro/` | `C:\Obras Inteligentes\circuitopro\index.html` | existe | 200 |
| 13 / RESERVATORIO | ReservatorioPro | `/reservatoriopro/` | `C:\Obras Inteligentes\reservatoriopro\index.html` | existe | 200 |
| 14 / BOMBAS | BombaPro | `/bombapro/` | `C:\Obras Inteligentes\bombapro\index.html` | existe | 200 |
| 15 / CHUMBADORES | ParaboltPro | `/paraboltpro/` | `C:\Obras Inteligentes\paraboltpro\index.html` | existe | 200 |
| 16 / ACO | SteelPro | `/steelpro/` | `C:\Obras Inteligentes\steelpro\index.html` | existe | 200 |
| 17 / CRONOGRAMA | CronogramaPro | `/cronogramapro/` | `C:\Obras Inteligentes\cronogramapro\index.html` | existe | 200 |
| 18 / DRENAGEM | DrenaPro | `/drenapro/` | `C:\Obras Inteligentes\drenapro\index.html` | existe | 200 |
| 19 / TALUDES | TaludePro | `/taludepro/` | `C:\Obras Inteligentes\taludepro\index.html` | existe | 200 |
| 20 / SOLAR | SolarPro | `/solarpro/` | `C:\Obras Inteligentes\solarpro\index.html` | existe | 200 |
| 21 / RESIDUOS | Calculadora de Residuos e PGRCC | `/pgrcc/` | `C:\Obras Inteligentes\pgrcc\index.html` | existe | 200 |
| 22 / VENTO | VentoPro | `/ventopro/` | `C:\Obras Inteligentes\ventopro\index.html` | existe | 200 |
| 23 / CONCRETO | ConcretoPro | `/concretopro/` | `C:\Obras Inteligentes\concretopro\index.html` | existe | 200 |
| 24 / ATERRAMENTO | AterramentoPro | `/aterramentopro/` | `C:\Obras Inteligentes\aterramentopro\index.html` | existe | 200 |
| 25 / PARAFUSOS | ParafusoPro | `/parafusopro/` | `C:\Obras Inteligentes\parafusopro\index.html` | existe | 200 |
| 26 / CAMBIO | Simulador de Risco Cambial | `/risco-cambial/` | `C:\Obras Inteligentes\risco-cambial\index.html` | existe | 200 |
| 27 / PROTENSAO | ProtendPro | `/protendpro/` | `C:\Obras Inteligentes\protendpro\index.html` | existe | 200 |
| 28 / EVENTOGRAMA | EventogramaPro | `/eventogramapro/` | `C:\Obras Inteligentes\eventogramapro\index.html` | existe | 200 |
| 29 / TERMO MASSA | Termo Massa | `/termo-massa/` | `C:\Obras Inteligentes\termo-massa\index.html` | existe | 200 |
| 30 / CABOS | CaboCalc | `/cabocalc/` | `C:\Obras Inteligentes\cabocalc\index.html` | existe | 200 |
| 31 / SUBESTACAO | SubestacaoPro | `/subestacaopro/` | `C:\Obras Inteligentes\subestacaopro\index.html` | existe | 200 |
| 32 / TERRAPLENAGEM | BrucknerCalc | `/brucknercalc/` | `C:\Obras Inteligentes\brucknercalc\index.html` | existe | 200 |
| 33 / MOLAS | MolaPro | `/molapro/` | `C:\Obras Inteligentes\molapro\index.html` | existe | 200 |
| 34 / EIXOS | Calculadora de Eixos | `/calculadora-eixos/` | `C:\Obras Inteligentes\calculadora-eixos\index.html` | existe | 200 |
| 35 / MANCAIS | MancalPro | `/mancalpro/` | `C:\Obras Inteligentes\mancalpro\index.html` | existe | 200 |
| 36 / ENGRENAGENS | Calculadora de Engrenagens | `/engrenagecalc/` | `C:\Obras Inteligentes\engrenagecalc\index.html` | existe | 200 |
| 37 / VOLANTES | VolantePro | `/volantepro/` | `C:\Obras Inteligentes\volantepro\index.html` | existe | 200 |
| 38 / TRANSMISSAO | TransmissaoPro | `/transmissaopro/` | `C:\Obras Inteligentes\transmissaopro\index.html` | existe | 200 |
| 39 / TUBULACOES | TuboCalc | `/tubocalc/` | `C:\Obras Inteligentes\tubocalc\index.html` | existe | 200 |
| 40 / COMPRESSORES | CompressorSelect Pro | `/compressorselect-pro/` | `C:\Obras Inteligentes\compressorselect-pro\index.html` | existe | 200 |
| 41 / VENTILADORES | VentiladorPro | `/ventiladorpro/` | `C:\Obras Inteligentes\ventiladorpro\index.html` | existe | 200 |
| 42 / HIDROLOGIA | HidroCalc | `/hidrocalc/` | `C:\Obras Inteligentes\hidrocalc\index.html` | existe | 200 |
| 43 / ELEVADORES | ElevadorCalc Pro | `/elevadorcalc/` | `C:\Obras Inteligentes\elevadorcalc\index.html` | existe | 200 |
| 44 / TROCAD. CALOR | ThermoX Pro | `/thermox-pro/` | `C:\Obras Inteligentes\thermox-pro\index.html` | existe | 200 |
| 45 / HONORARIOS | Comparador de Honorarios de Projetos | `/comparador-honorarios-projetos/` | `C:\Obras Inteligentes\comparador-honorarios-projetos\index.html` | existe | 200 |
| 46 / CONSULTORIA | ConsultoriaPro | `/consultoriapro-rodoviario/` | `C:\Obras Inteligentes\consultoriapro-rodoviario\index.html` | existe | 200 |
| 47 / GERADORES | GeradorPro | `/geradorpro/` | `C:\Obras Inteligentes\geradorpro\index.html` | existe | 200 |
| 48 / SPDA | SPDAPro | `/spdapro/` | `C:\Obras Inteligentes\spdapro\index.html` | existe | 200 |
| 49 / ILUMINACAO | LumiPro | `/lumipro/` | `C:\Obras Inteligentes\lumipro\index.html` | existe | 200 |
| 50 / SANEAMENTO | EsgotoCalc Pro | `/esgotocalcpro/` | `C:\Obras Inteligentes\esgotocalcpro\index.html` | existe | 200 |
| 51 / CLT-PJ | EquivaleCLT | `/equivaleclt/` | `C:\Obras Inteligentes\equivaleclt\index.html` | existe | 200 |
| 52 / HIDROSSANITARIO | HidroSan Pro | `/hidrosan-pro/` | `C:\Obras Inteligentes\hidrosan-pro\index.html` | existe | 200 |
| 53 / TERCEIRIZACAO | TerceirizaPro | `/terceirizapro/` | `C:\Obras Inteligentes\terceirizapro\index.html` | existe | 200 |
| 54 / CIMBRES | CimbrePro | `/cimbrepro/` | `C:\Obras Inteligentes\cimbrepro\index.html` | existe | 200 |
| 55 / ALVENARIA | AlvenariaPro | `/alvenariapro/` | `C:\Obras Inteligentes\alvenariapro\index.html` | existe | 200 |
| 56 / ANDAIMES | AndaimeFach Pro | `/andaimefach-pro/` | `C:\Obras Inteligentes\andaimefach-pro\index.html` | existe | 200 |
| 57 / RECEBIMENTO | RecebeObra Pro | `/recebeobra-pro/` | `C:\Obras Inteligentes\recebeobra-pro\index.html` | existe | 200 |
| 58 / OPEX PREDIAL | CriticaOpex | `/criticaopex/` | `C:\Obras Inteligentes\criticaopex\index.html` | existe | 200 |
| 59 / PMOC | PMOC Manager | `/pmoc-manager/` | `C:\Obras Inteligentes\pmoc-manager\index.html` | existe | 200 |
| 60 / MOBILIZACAO | MobilizaSICRO | `/mobilizasicro/` | `C:\Obras Inteligentes\mobilizasicro\index.html` | existe | 200 |
| 61 / ACESSIBILIDADE | AcessCheck | `/acesscheck/` | `C:\Obras Inteligentes\acesscheck\index.html` | existe | 200 |
| 62 / CANTEIRO SICRO | Canteiro de Obras - Sicro | `/canteiro-sicro/` | `C:\Obras Inteligentes\canteiro-sicro\index.html` | existe | 200 |
| 63 / GRUAS | GruaPro | `/gruapro/` | `C:\Obras Inteligentes\gruapro\index.html` | existe | 200 |
| 64 / ICAMENTO | IcamentoPro | `/icamento-pro/` | `C:\Obras Inteligentes\icamento-pro\index.html` | existe | 200 |
| 65 / LOCAR OU COMPRAR | Locar ou Comprar Pro | `/locar-ou-comprar-pro/` | `C:\Obras Inteligentes\locar-ou-comprar-pro\index.html` | existe | 200 |

## Tamanhos verificados

Estes tamanhos ajudam a identificar se uma rota local foi substituida corretamente. Pequenas diferencas entre bytes locais e comprimento de texto baixado podem ocorrer por codificacao.

| Rota | Tamanho local aproximado | Tamanho publicado verificado |
|---|---:|---:|
| `/manutencao/` | 278361 bytes | 274136 caracteres |
| `/fiscalizacao/` | 354221 bytes | 354221 caracteres |
| `/estrutural/` | 989496 bytes | 989496 caracteres |
| `/pavimentos/` | 271969 bytes | 271969 caracteres |
| `/riscos/` | 963063 bytes | 940336 caracteres |
| `/administracao-canteiro/` | 480651 bytes | 480651 caracteres |
| `/memorial-descritivo/` | 6349 bytes | 6349 caracteres |
| `/sispav-reabilitacao/` | 205135 bytes | 198981 caracteres |
| `/muros-arrimo/` | 527416 bytes | 527416 caracteres |
| `/casa-parametrica/` | 38883 bytes | 38883 caracteres |
| `/termopro/` | 550398 bytes | 550398 caracteres |
| `/circuitopro/` | 287904 bytes | 287904 caracteres |
| `/reservatoriopro/` | 209145 bytes | 206623 caracteres |
| `/bombapro/` | 788470 bytes | 779784 caracteres |
| `/paraboltpro/` | 1203461 bytes | 1183789 caracteres |
| `/steelpro/` | 278012 bytes | 275650 caracteres |
| `/cronogramapro/` | 402158 bytes | 402158 caracteres |
| `/drenapro/` | 249087 bytes | 249037 caracteres |
| `/taludepro/` | 182065 bytes | 179465 caracteres |
| `/solarpro/` | 557283 bytes | 551659 caracteres |
| `/pgrcc/` | 95310 bytes | 94583 caracteres |
| `/ventopro/` | 283733 bytes | 283626 caracteres |
| `/concretopro/` | 646687 bytes | 646598 caracteres |
| `/aterramentopro/` | 350011 bytes | 349919 caracteres |
| `/parafusopro/` | 292299 bytes | 288543 caracteres |
| `/risco-cambial/` | 154065 bytes | 152257 caracteres |
| `/protendpro/` | 915441 bytes | 915441 caracteres |
| `/eventogramapro/` | 728843 bytes | 728843 caracteres |
| `/termo-massa/` | 199232 bytes | 196348 caracteres |
| `/cabocalc/` | 129693 bytes | 129693 caracteres |
| `/subestacaopro/` | 730239 bytes | 730239 caracteres |
| `/brucknercalc/` | 1479721 bytes | 1475264 caracteres |
| `/molapro/` | 304857 bytes | 304857 caracteres |
| `/calculadora-eixos/` | 231280 bytes | 228654 caracteres |
| `/mancalpro/` | 1138677 bytes | 1138677 caracteres |
| `/engrenagecalc/` | 683617 bytes | 678412 caracteres |
| `/volantepro/` | 104335 bytes | 104335 caracteres |
| `/transmissaopro/` | 317190 bytes | 317190 caracteres |
| `/tubocalc/` | 256920 bytes | 256920 caracteres |
| `/compressorselect-pro/` | 1267287 bytes | 1260281 caracteres |
| `/ventiladorpro/` | 669301 bytes | 669301 caracteres |
| `/hidrocalc/` | 567089 bytes | 565179 caracteres |
| `/elevadorcalc/` | 386384 bytes | 382143 caracteres |
| `/thermox-pro/` | 428015 bytes | 428015 caracteres |
| `/comparador-honorarios-projetos/` | 525309 bytes | 525309 caracteres |
| `/consultoriapro-rodoviario/` | 284681 bytes | 284681 caracteres |
| `/geradorpro/` | 265143 bytes | 265143 caracteres |
| `/spdapro/` | 709941 bytes | 709941 caracteres |
| `/lumipro/` | 756040 bytes | 756040 caracteres |
| `/esgotocalcpro/` | 1037879 bytes | 1032140 caracteres |
| `/equivaleclt/` | 107244 bytes | 106067 caracteres |
| `/hidrosan-pro/` | 290818 bytes | 290818 caracteres |
| `/terceirizapro/` | 723110 bytes | 723110 caracteres |
| `/cimbrepro/` | 188067 bytes | 188067 caracteres |
| `/alvenariapro/` | 474835 bytes | 474835 caracteres |
| `/andaimefach-pro/` | 227525 bytes | 224792 caracteres |
| `/recebeobra-pro/` | 617407 bytes | 617407 caracteres |
| `/criticaopex/` | 631053 bytes | 631053 caracteres |
| `/pmoc-manager/` | 604647 bytes | 604647 caracteres |
| `/mobilizasicro/` | 1337033 bytes | 1337033 caracteres |
| `/acesscheck/` | 200004 bytes | 197102 caracteres |
| `/canteiro-sicro/` | 246827 bytes | 244312 caracteres |
| `/gruapro/` | 607247 bytes | 602186 caracteres |
| `/icamento-pro/` | 1073180 bytes | 1062059 caracteres |
| `/locar-ou-comprar-pro/` | 372920 bytes | 370117 caracteres |

## Estrutura local principal

```text
C:\Obras Inteligentes
├─ index.html
├─ manutencao\
│  ├─ index.html
│  └─ mp_backend.js
├─ fiscalizacao\
│  └─ index.html
├─ estrutural\
│  └─ index.html
├─ pavimentos\
│  └─ index.html
├─ riscos\
│  └─ index.html
├─ administracao-canteiro\
│  └─ index.html
├─ memorial-descritivo\
│  └─ index.html
├─ sispav-reabilitacao\
│  └─ index.html
├─ muros-arrimo\
│  └─ index.html
├─ casa-parametrica\
│  ├─ index.html
│  ├─ data\
│  │  ├─ default_parameters.json
│  │  └─ default_price_bases.json
│  └─ static\
│     ├─ app.js
│     ├─ favicon.svg
│     ├─ static-api.js
│     └─ styles.css
├─ termopro\
│  └─ index.html
└─ circuitopro\
   └─ index.html
```

Atualizacao posterior: tambem existem as pastas `C:\Obras Inteligentes\reservatoriopro\index.html`, correspondente ao card 13 / RESERVATORIO, `C:\Obras Inteligentes\bombapro\index.html`, correspondente ao card 14 / BOMBAS, `C:\Obras Inteligentes\paraboltpro\index.html`, correspondente ao card 15 / CHUMBADORES, `C:\Obras Inteligentes\steelpro\index.html`, correspondente ao card 16 / ACO, `C:\Obras Inteligentes\cronogramapro\index.html`, correspondente ao card 17 / CRONOGRAMA, `C:\Obras Inteligentes\drenapro\index.html`, correspondente ao card 18 / DRENAGEM, `C:\Obras Inteligentes\taludepro\index.html`, correspondente ao card 19 / TALUDES, `C:\Obras Inteligentes\solarpro\index.html`, correspondente ao card 20 / SOLAR, `C:\Obras Inteligentes\pgrcc\index.html`, correspondente ao card 21 / RESIDUOS, `C:\Obras Inteligentes\ventopro\index.html`, correspondente ao card 22 / VENTO, `C:\Obras Inteligentes\concretopro\index.html`, correspondente ao card 23 / CONCRETO, `C:\Obras Inteligentes\aterramentopro\index.html`, correspondente ao card 24 / ATERRAMENTO, `C:\Obras Inteligentes\parafusopro\index.html`, correspondente ao card 25 / PARAFUSOS, `C:\Obras Inteligentes\risco-cambial\index.html`, correspondente ao card 26 / CAMBIO, `C:\Obras Inteligentes\protendpro\index.html`, correspondente ao card 27 / PROTENSAO, `C:\Obras Inteligentes\eventogramapro\index.html`, correspondente ao card 28 / EVENTOGRAMA, `C:\Obras Inteligentes\termo-massa\index.html`, correspondente ao card 29 / TERMO MASSA, `C:\Obras Inteligentes\cabocalc\index.html`, correspondente ao card 30 / CABOS, `C:\Obras Inteligentes\subestacaopro\index.html`, correspondente ao card 31 / SUBESTACAO, `C:\Obras Inteligentes\brucknercalc\index.html`, correspondente ao card 32 / TERRAPLENAGEM, `C:\Obras Inteligentes\molapro\index.html`, correspondente ao card 33 / MOLAS, `C:\Obras Inteligentes\calculadora-eixos\index.html`, correspondente ao card 34 / EIXOS, `C:\Obras Inteligentes\mancalpro\index.html`, correspondente ao card 35 / MANCAIS, `C:\Obras Inteligentes\engrenagecalc\index.html`, correspondente ao card 36 / ENGRENAGENS, `C:\Obras Inteligentes\volantepro\index.html`, correspondente ao card 37 / VOLANTES, `C:\Obras Inteligentes\transmissaopro\index.html`, correspondente ao card 38 / TRANSMISSAO, `C:\Obras Inteligentes\tubocalc\index.html`, correspondente ao card 39 / TUBULACOES, `C:\Obras Inteligentes\compressorselect-pro\index.html`, correspondente ao card 40 / COMPRESSORES, `C:\Obras Inteligentes\ventiladorpro\index.html`, correspondente ao card 41 / VENTILADORES, `C:\Obras Inteligentes\hidrocalc\index.html`, correspondente ao card 42 / HIDROLOGIA, `C:\Obras Inteligentes\elevadorcalc\index.html`, correspondente ao card 43 / ELEVADORES, `C:\Obras Inteligentes\thermox-pro\index.html`, correspondente ao card 44 / TROCAD. CALOR, e `C:\Obras Inteligentes\comparador-honorarios-projetos\index.html`, correspondente ao card 45 / HONORARIOS.

## Estado funcional importante por modulo

### Manutencao Predial

Rota: `/manutencao/`  
Arquivos: `manutencao/index.html`, `manutencao/mp_backend.js`

Observacoes:

- Foi ajustado para acesso livre, sem exigir login.
- O backend e simulado/local em JavaScript, adequado a hospedagem estatica.
- Em 21/07/2026, recebeu tela inicial com aviso de uso demonstrativo, isencao de responsabilidade e botao de concordancia antes de liberar o aplicativo.
- Em 15/08/2026, o card foi remanejado para o novo filtro `Manutencao Predial`.
- A pasta antiga `Sistema Manutenção Predial` existe como historico, mas esta ignorada no Git.

### Fiscalizacao de Contratos

Rota: `/fiscalizacao/`  
Arquivo: `fiscalizacao/index.html`

Observacoes:

- Card e rota publicados e funcionais.
- Em 21/07/2026, recebeu tela inicial com aviso de uso demonstrativo, isencao de responsabilidade e botao de concordancia antes de liberar o aplicativo.
- Existe pasta historica `Gestão e Fiscalização de Contratos`, ignorada pelo Git.

### Calculadora Estrutural

Rota: `/estrutural/`  
Arquivo: `estrutural/index.html`  
Copia local historica: `C:\Obras Inteligentes\Calculadora Estrutural.html`

Observacoes:

- Em atualizacoes futuras, preservar/forcar o aviso legal quando o usuario pedir nova versao.
- Em alteracoes com JavaScript ou aceite legal, usar cache busting se necessario.
- Em 22/07/2026, foi ajustada para exibir o aviso legal a cada novo acesso ao modulo, sem pular a tela por aceite antigo salvo no `localStorage`.

### Calculadora de Pavimentos

Rota: `/pavimentos/`  
Arquivo: `pavimentos/index.html`

Observacoes:

- Recebeu aviso legal equivalente ao da Calculadora Estrutural.
- Relatorios devem conter aviso resumido de responsabilidade tecnica.
- Em 16/08/2026, foi atualizada com nova versao enviada como `index (31).html`, incorporando recursos de orcamento detalhado SINAPI.
- Backup anterior salvo em `C:\Obras Inteligentes\backups\pavimentos-index-before-update-20260816-20260816-135250.html`.
- Em 20/08/2026, foi atualizada com nova versao enviada como `index (32).html`.
- Backup anterior salvo em `C:\Obras Inteligentes\backups\pavimentos-index-before-update-20260820-0045.html`.

### Mapa & Matriz de Riscos

Rota: `/riscos/`  
Arquivo: `riscos/index.html`  
Fontes historicas no diretorio raiz:

```text
Abertura - Mapa e Matriz de Riscos.html
mapa_matriz_riscos_pro_v4.html
```

Observacoes:

- Em 21/07/2026, recebeu tela inicial com aviso de uso demonstrativo, isencao de responsabilidade e botao de concordancia antes de iniciar a abertura do sistema.
- Em 21/08/2026, foi atualizado com a nova versao `Mapa_Matriz_Riscos_Pro_v4_5_Unificado.html`, identificada como v4.5, com quantificacao profissional em arquivo unificado.
- Backup da versao anterior: `C:\Obras Inteligentes\backups\riscos-index-before-v4-5-unificado-20260821-0747.html`
- Em 21/08/2026, foi atualizado novamente com a nova versao `Mapa_Matriz_Riscos_Pro_v4_6_DNIT_CBIC_Consolidado.html`, identificada como v4.6, com bibliotecas DNIT/CBIC e consolidacao.
- Backup da versao anterior: `C:\Obras Inteligentes\backups\riscos-index-before-v4-6-dnit-cbic-20260821-1012.html`

### Administracao Local e Canteiro de Obra

Rota: `/administracao-canteiro/`  
Arquivo de abertura: `administracao-canteiro/index.html`  
Arquivo do sistema: `administracao-canteiro/calculadora.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\ALC_Sistema_com_Manual.zip`
- Data: 25/08/2026
- Alteracao: substituicao de `administracao-canteiro/calculadora.html` pela versao com manual interativo. O `index.html` do pacote era identico ao arquivo ja publicado e foi preservado.
- Backup da calculadora anterior salvo em `C:\Obras Inteligentes\backups\administracao-canteiro-calculadora-before-alc-manual-20260825-061436.html`.

Observacao:

- Ha arquivo solto nao versionado `calculadora_administracao_local_atualizada.html`. Nao incluir em commits se nao for solicitado.

### Gerador Automatico de Memorial Descritivo

Rota: `/memorial-descritivo/`  
Arquivo: `memorial-descritivo/index.html`

Observacao:

- Ha arquivo solto nao versionado `GeradorMemorialDescritivo (4).html`. Nao incluir em commits se nao for solicitado.

### Sispav - Reabilitacao e Gestao de Pavimentos

Rota: `/sispav-reabilitacao/`  
Arquivo: `sispav-reabilitacao/index.html`

Ultima atualizacao relevante:

- Em 21/08/2026, substituido por `SisPav_com_manual_interativo.html`, com manual interativo incorporado.
- Backup anterior: `C:\Obras Inteligentes\backups\sispav-reabilitacao-index-before-manual-interativo-20260821-1935.html`.
- Substituido por `SisPav_Reabilitacao_de_Pavimentos_v2026-07.html`.
- Commit historico: `9b71144` - `Atualiza modulo SisPav`.

### Calculadora de Muros de Arrimo

Rota: `/muros-arrimo/`  
Arquivo: `muros-arrimo/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\ArrimoCalc_v2.4.html`.
- Data: 06/08/2026
- Alteracao: substituicao integral de `muros-arrimo/index.html` pela versao ArrimoCalc v2.4.
- Commit historico de inclusao: `a3ee841` - `Adiciona calculadora de muros de arrimo`.
- Em 20/08/2026, foi atualizado com a nova versao `ArrimoCalc_v2.4_com_manual_interativo.html`, com manual interativo incorporado.
- Backup anterior salvo em `C:\Obras Inteligentes\backups\muros-arrimo-index-before-v2-4-manual-20260820-0045.html`.

### Casa Parametrica

Rota: `/casa-parametrica/`  
Arquivos:

```text
casa-parametrica/index.html
casa-parametrica/data/default_parameters.json
casa-parametrica/data/default_price_bases.json
casa-parametrica/static/app.js
casa-parametrica/static/static-api.js
casa-parametrica/static/styles.css
casa-parametrica/static/favicon.svg
```

Observacoes criticas:

- O pacote original tinha backend Python/FastAPI. Para publicar no Hostinger compartilhado, foi criada uma camada estatica em `static/static-api.js`.
- A camada estatica intercepta chamadas `/api/...` no navegador e implementa:
  - parametros;
  - bases de preco demonstrativas;
  - compatibilidade area x programa;
  - estimativa;
  - cenarios em `localStorage`;
  - PDF local.
- A geracao de PDF passou por tres correcoes:
  - arquivo PDF valido em vez de texto com extensao `.pdf`;
  - restauracao das secoes detalhadas;
  - formatacao visual com cabecalho, rodape, caixas e tabelas.
- A versao atual da pagina usa cache busting:

```html
static/static-api.js?v=revisado-20260817-2
static/app.js?v=revisado-20260817-2
```

Sempre que alterar `static-api.js` ou `app.js`, atualize tambem a query string no `casa-parametrica/index.html` para evitar cache do Chrome.

Atualizacao de 17/08/2026:

- Fonte: `C:\Users\ACER\Documents\Downloads\casa_parametrica_revisado (1).zip`.
- Arquivos substituidos a partir da pasta `casa` do ZIP: `data/default_parameters.json` e `static/static-api.js`; a query string de `index.html` foi atualizada para `revisado-20260817-1`.
- Backup da versao de producao Git salvo em `C:\Obras Inteligentes\backups\casa-parametrica-production-git-before-20260817-20260817-212510.zip`.
- Backup local dos arquivos substituidos salvo em `C:\Obras Inteligentes\backups\casa-parametrica-local-before-20260817-20260817-212510`.

Atualizacao de 17/08/2026 - revisao 2:

- Fonte: `C:\Users\ACER\Documents\Downloads\casa_parametrica_revisado (2).zip`.
- Arquivos de execucao atualizados a partir da pasta `casa` do ZIP: `index.html`, `data/default_parameters.json`, `data/default_price_bases.json`, `static/app.js`, `static/static-api.js`, `static/styles.css` e `static/favicon.svg`.
- A nova revisao acrescenta geracao de modelo IFC conceitual no aplicativo; a query string de `index.html` foi atualizada para `revisado-20260817-2`.
- Backup da versao de producao Git salvo em `C:\Obras Inteligentes\backups\casa-parametrica-production-git-before-20260817-2159.zip`.
- Backup local dos arquivos substituidos salvo em `C:\Obras Inteligentes\backups\casa-parametrica-local-before-20260817-2159`.

Commits historicos relevantes:

- `172fa32` - `Adiciona modulo Casa Parametrica`
- `2a6a51b` - `Corrige PDF da Casa Parametrica`
- `d186a85` - `Forca atualizacao do PDF da Casa Parametrica`
- `254cddb` - `Restaura relatorio detalhado da Casa Parametrica`
- `612b05d` - `Formata relatorio PDF da Casa Parametrica`

### TermoPro

Rota: `/termopro/`  
Arquivo: `termopro/index.html`

Ultima versao publicada:

- Fonte: `C:\Users\ACER\Documents\Downloads\TermoPro_v3.7_rede_ramificada_balanceamento.html`
- Data: 02/08/2026
- Alteracao: substituicao integral de `termopro/index.html` pela versao TermoPro 3.7, com rede ramificada e balanceamento.
- Em 20/08/2026, foi atualizado com a nova versao `TermoPro_3.7_manual_interativo (1).html`, com manual interativo incorporado.
- Backup anterior salvo em `C:\Obras Inteligentes\backups\termopro-index-before-3-7-manual-20260820-0715.html`.

Observacoes:

- Aplicativo standalone com tela de abertura e aviso legal.
- Validar apos futuras alteracoes se abertura, aceite, calculo de carga termica, psicrometria, catalogo, documentacao, rede ramificada, balanceamento de dutos e exportacoes continuam carregando corretamente.

### CircuitoPro

Rota: `/circuitopro/`  
Arquivo: `circuitopro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\CircuitoPro (4).html`
- Data: 19/07/2026
- Alteracao: substituicao integral de `circuitopro/index.html` pela nova versao do aplicativo.
- Em 20/08/2026, foi atualizado com a nova versao `CircuitoPro_v2.1_com_manual_interativo.html`, com manual interativo incorporado.
- Backup anterior salvo em `C:\Obras Inteligentes\backups\circuitopro-index-before-v2-1-manual-20260820-0748.html`.

Observacoes:

- Aplicativo standalone.
- Validado com carregamento da tela legal e presenca da interface principal.

### ReservatorioPro

Rota: `/reservatoriopro/`  
Arquivo: `reservatoriopro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\ReservatorioPro_manual_interativo.html`
- Data: 20/08/2026
- Alteracao: substituicao integral de `reservatoriopro/index.html` pela nova versao do aplicativo, com manual interativo incorporado.
- Backup da versao anterior: `C:\Obras Inteligentes\backups\reservatoriopro-index-before-manual-interativo-20260820-0817.html`

Observacoes:

- Aplicativo standalone.
- Tela inicial do site aponta para `/reservatoriopro/`.
- Validar apos futuras alteracoes se a tela de abertura, calculos, exportacoes e relatorios continuam carregando sem dependencias externas.

### BombaPro

Rota: `/bombapro/`  
Arquivo: `bombapro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\BombaPro_3.5_com_manual_interativo (1).html`
- Data: 20/08/2026
- Alteracao: substituicao integral de `bombapro/index.html` pela versao BombaPro 3.5, com manual interativo incorporado.
- Backup da versao anterior: `C:\Obras Inteligentes\backups\bombapro-index-before-v3-5-manual-interativo-20260820-1214.html`

Observacoes:

- Aplicativo standalone com tela de abertura e aviso legal.
- Usa bibliotecas via CDN: Chart.js, xlsx e jsPDF.
- Tela inicial do site aponta para `/bombapro/`.
- Validar apos futuras alteracoes se graficos, catalogo de bombas, selecao inteligente, otimizacao tecnico-economica, memoria de calculo, especificacao profissional, exportacao Excel e relatorios PDF continuam carregando corretamente.

### ParaboltPro

Rota: `/paraboltpro/`  
Arquivo: `paraboltpro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\ParaboltPro_com_manual_interativo.html`
- Data: 20/08/2026
- Alteracao: substituicao integral de `paraboltpro/index.html` pela nova versao com manual interativo incorporado.
- Backup da versao anterior: `C:\Obras Inteligentes\backups\paraboltpro-index-before-manual-interativo-20260820-1739.html`

Observacoes:

- Aplicativo standalone em HTML unico.
- Tela inicial do site aponta para `/paraboltpro/`.
- Validar apos futuras alteracoes se a abertura, calculos, exportacoes e relatorios continuam carregando corretamente.

### SteelPro

Rota: `/steelpro/`  
Arquivo: `steelpro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\SteelPro_v1.1_Manual_Interativo.html`
- Data: 20/08/2026
- Alteracao: substituicao integral de `steelpro/index.html` pela versao 1.1, com manual interativo incorporado.
- Backup da versao anterior: `C:\Obras Inteligentes\backups\steelpro-index-before-v1-1-manual-interativo-20260820-1930.html`

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/steelpro/`.
- Validar apos futuras alteracoes se a abertura, calculos, exportacoes e relatorios continuam carregando corretamente.

### CronogramaPro

Rota: `/cronogramapro/`  
Arquivo: `cronogramapro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\CronogramaPro (standalone).html`
- Data: 20/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/cronogramapro/`.
- Validar apos futuras alteracoes se a abertura, os calculos parametricos, os graficos de Gantt e os relatorios continuam carregando corretamente.
- Em 16/08/2026, foi atualizado com a nova versao `cronogramapro-v2.html` enviada pelo usuario, identificada no titulo como CronogramaPro v2.0.
- Backup anterior salvo em `C:\Obras Inteligentes\backups\cronogramapro-index-before-v2-20260816-20260816-150311.html`.
- Em 17/08/2026, foi atualizado com a nova versao `cronogramapro-v2.1.html` enviada pelo usuario.
- Backup anterior salvo em `C:\Obras Inteligentes\backups\cronogramapro-index-before-v2-1-20260817-20260817-080852.html`.
- Em 17/08/2026, foi atualizado com a nova versao `cronogramapro-v2.1 (1).html` enviada pelo usuario.
- Backup anterior salvo em `C:\Obras Inteligentes\backups\cronogramapro-index-before-v2-1-1-20260817-2216.html`.
- Em 19/08/2026, foi atualizado com a nova versao `cronogramapro-v2.2.html` enviada pelo usuario.
- Backup anterior salvo em `C:\Obras Inteligentes\backups\cronogramapro-index-before-v2-2-20260819-1918.html`.

### DrenaPro

Rota: `/drenapro/`  
Arquivo: `drenapro/index.html`

Ultima inclusao:

- Em 22/08/2026, atualizado com `DrenaPro_com_manual_interativo (1).html`, identificado como versao com manual interativo.
- Backup anterior: `C:\Obras Inteligentes\backups\drenapro-index-before-manual-interativo-20260822-1111.html`.
- Fonte: `C:\Users\ACER\Documents\Downloads\DrenaPro (standalone).html`
- Data: 21/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/drenapro/`.
- O card foi remanejado do filtro `Instalacoes` para `Pavimentacao, Saneamento e Infraestrutura` em 03/08/2026.
- Validar apos futuras alteracoes se a abertura, os calculos hidrologicos/hidraulicos, as exportacoes e os relatorios continuam carregando corretamente.

### TaludePro

Rota: `/taludepro/`  
Arquivo: `taludepro/index.html`

Ultima inclusao:

- Em 22/08/2026, atualizado com `index (36).html`, identificado como nova versao do TaludePro com manual interativo.
- Backup anterior: `C:\Obras Inteligentes\backups\taludepro-index-before-update-20260822-1022.html`.
- Fonte: `C:\Users\ACER\Documents\Downloads\TaludePro Standalone.html`
- Data: 21/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/taludepro/`.
- O card foi remanejado do filtro `Estruturas` para `Pavimentacao, Saneamento e Infraestrutura` em 03/08/2026.
- Validar apos futuras alteracoes se a abertura, os calculos geotecnicos, as verificacoes de estabilidade e os relatorios continuam carregando corretamente.

### SolarPro

Rota: `/solarpro/`  
Arquivo: `solarpro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\SolarPro_v2.3_manual_interativo.html`
- Data: 20/08/2026
- Alteracao: atualizacao do aplicativo SolarPro para a versao 2.3, com manual interativo incorporado.
- Backup da versao anterior: `C:\Obras Inteligentes\backups\solarpro-index-before-v2-3-manual-interativo-20260820-1739.html`

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/solarpro/`.
- Validar apos futuras alteracoes se a abertura, os calculos de geracao fotovoltaica, economia, payback, exportacoes e relatorios continuam carregando corretamente.

### Calculadora de Residuos e PGRCC

Rota: `/pgrcc/`  
Arquivo: `pgrcc/index.html`

Ultima inclusao:

- Em 21/08/2026, atualizado com `index (34).html`, identificado como nova versao da Calculadora de Residuos de Construcao Civil e Gerador de PGRCC.
- Backup anterior: `C:\Obras Inteligentes\backups\pgrcc-index-before-update-20260821-1935.html`.
- Fonte: `C:\Users\ACER\Documents\Downloads\Calculadora de Resíduos e PGRCC.html`
- Data: 21/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/pgrcc/`.
- Validar apos futuras alteracoes se a abertura, estimativas de residuos, classes, destinacao e geracao do PGRCC continuam carregando corretamente.

### VentoPro

Rota: `/ventopro/`  
Arquivo: `ventopro/index.html`

Ultima inclusao:

- Em 21/08/2026, atualizado com `index (35).html`, identificado como nova versao do VentoPro.
- Backup anterior: `C:\Obras Inteligentes\backups\ventopro-index-before-update-20260821-1935.html`.
- Fonte: `C:\Users\ACER\Documents\Downloads\VentoPro Abertura.html`
- Data: 21/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/ventopro/`.
- Validar apos futuras alteracoes se a abertura, o calculo de forcas devidas ao vento, os parametros, os coeficientes, as pressoes e os relatorios continuam carregando corretamente.

### ConcretoPro

Rota: `/concretopro/`  
Arquivo: `concretopro/index.html`

Ultima inclusao:

- Em 22/08/2026, atualizado com `ConcretoPro_com_Manual_Interativo.html`, identificado como versao com manual interativo.
- Ajuste tecnico local: o placeholder interno `sistemaUrl` foi apontado para o HTML embutido do proprio pacote, permitindo abrir o sistema apos o aceite legal.
- Backup anterior: `C:\Obras Inteligentes\backups\concretopro-index-before-manual-interativo-20260822-1022.html`.
- Fonte: `C:\Users\ACER\Documents\Downloads\ConcretoPro - Abertura e Sistema.html`
- Data: 22/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/concretopro/`.
- Validar apos futuras alteracoes se a abertura, a dosagem, o traco do concreto, os ajustes de materiais e os relatorios continuam carregando corretamente.

### AterramentoPro

Rota: `/aterramentopro/`  
Arquivo: `aterramentopro/index.html`

Ultima inclusao:

- Em 23/08/2026, atualizado com `AterramentoPro_v1.6_Manual_Interativo.html`, identificado como versao com manual interativo.
- Backup anterior: `C:\Obras Inteligentes\backups\aterramentopro-index-before-manual-interativo-20260823-1122.html`.
- Fonte: `C:\Users\ACER\Documents\Downloads\AterramentoPro_v1.6.html`
- Data: 26/07/2026
- Alteracao: atualizacao do aplicativo AterramentoPro para nova versao standalone v1.6.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/aterramentopro/`.
- Validar apos futuras alteracoes se a abertura, os calculos de aterramento, resistividade do solo, hastes, malhas, resistencia equivalente e relatorios continuam carregando corretamente.

### ParafusoPro

Rota: `/parafusopro/`  
Arquivo: `parafusopro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\ParafusoPro_com_Manual_Interativo.html`
- Data: 20/08/2026
- Alteracao: substituicao integral de `parafusopro/index.html` pela nova versao com manual interativo incorporado.
- Backup da versao anterior: `C:\Obras Inteligentes\backups\parafusopro-index-before-manual-interativo-20260820-1930.html`

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/parafusopro/`.
- Validar apos futuras alteracoes se a abertura, os calculos de parafusos, ligacoes, esforcos, resistencias, verificacoes e relatorios continuam carregando corretamente.

### Simulador de Risco Cambial

Rota: `/risco-cambial/`  
Arquivo: `risco-cambial/index.html`

Ultima inclusao:

- Em 23/08/2026, atualizado com `index (37).html`, identificado como nova versao do Simulador de Risco Cambial com manual interativo.
- Backup anterior: `C:\Obras Inteligentes\backups\risco-cambial-index-before-update-20260823-1122.html`.
- Fonte: `C:\Users\ACER\Documents\Downloads\Simulador_de_Risco_Cambial_v2026.09.html`
- Data: 24/07/2026
- Alteracao: atualizacao do aplicativo Simulador de Risco Cambial para nova versao standalone v2026.09.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/risco-cambial/`.
- Validar apos futuras alteracoes se a abertura, os cenarios de cambio, contingencias, simulacoes de risco e relatorios continuam carregando corretamente.

### ProtendPro

Rota: `/protendpro/`  
Arquivo: `protendpro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\ProtendPro_Aprimorado_v1_10_0_FINAL.html`
- Data: 06/08/2026
- Alteracao: atualizacao do aplicativo ProtendPro para nova versao standalone 1.10.0.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/protendpro/`.
- Validar apos futuras alteracoes se a abertura, o dimensionamento de vigas protendidas, tracado de cabos, perdas, verificacoes de servico e relatorios continuam carregando corretamente.

### EventogramaPro

Rota: `/eventogramapro/`  
Arquivo: `eventogramapro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\EventogramaPro - sistema completo com nova abertura.html`
- Data: 25/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/eventogramapro/`.
- Validar apos futuras alteracoes se a abertura, geracao de eventograma, etapas, marcos, dependencias e relatorios continuam carregando corretamente.

### Termo Massa

Rota: `/termo-massa/`  
Arquivo: `termo-massa/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\index (42).html`
- Data: 26/08/2026
- Alteracao: substituicao integral de `termo-massa/index.html` pela nova versao enviada, identificada como `TermoMassa — Controle térmico de concreto massa`, com manual interativo.
- Backup da versao anterior salvo em `C:\Obras Inteligentes\backups\termo-massa-index-before-index42-20260826-172542.html`.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/termo-massa/`.
- Validar apos futuras alteracoes se a abertura, analise de temperatura de concretagem, gradientes termicos, limites, riscos e relatorios continuam carregando corretamente.

### CaboCalc

Rota: `/cabocalc/`  
Arquivo: `cabocalc/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\CaboCalc - Standalone.html`
- Data: 25/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/cabocalc/`.
- Validar apos futuras alteracoes se a abertura, calculos de cabos de aco estruturais e estacionarios, resistencias, flechas, seguranca e relatorios continuam carregando corretamente.

### SubestacaoPro

Rota: `/subestacaopro/`  
Arquivo: `subestacaopro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\SubestacaoPro_v1_2.html`
- Data: 25/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/subestacaopro/`.
- Validar apos futuras alteracoes se a abertura, dimensionamento de subestacoes prediais, demandas, transformadores, protecoes e relatorios continuam carregando corretamente.

### BrucknerCalc

Rota: `/brucknercalc/`  
Arquivo: `brucknercalc/index.html`

Ultima inclusao:

- Em 23/08/2026, atualizado com `BruecknerCalc_Pro_v2.3_com_manual_interativo.html`, identificado como v2.3 com manual interativo.
- Backup anterior: `C:\Obras Inteligentes\backups\brucknercalc-index-before-manual-interativo-20260823-1221.html`.
- Fonte: `C:\Users\ACER\Documents\Downloads\BrucknerCalc_Pro_v2.3_SICRO_DF_04-2026.html`
- Data: 26/07/2026
- Alteracao: atualizacao do aplicativo BrucknerCalc para nova versao standalone v2.3 com SICRO DF 04/2026.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/brucknercalc/`.
- O card foi classificado no filtro `Pavimentacao, Saneamento e Infraestrutura`.
- Validar apos futuras alteracoes se o otimizador de terraplenagem por curva de massas, cortes, aterros, volumes, distancias de transporte, orcamento e dados SICRO continuam carregando corretamente.

### MolaPro

Rota: `/molapro/`  
Arquivo: `molapro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\MolaPro_v1.5.html`
- Data: 31/07/2026
- Alteracao: atualizacao do aplicativo MolaPro para a versao standalone v1.5, com tela de abertura e aceite legal.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/molapro/`.
- O card foi classificado no filtro `Engenharia Mecanica`, novo menu criado para aplicativos mecanicos.
- Validar apos futuras alteracoes se a calculadora de molas helicoidais de compressao, tracao, torcao, rigidez, esforcos, fabricacao, inspecao, fadiga, tolerancias e verificacoes tecnicas continua carregando corretamente.

### Calculadora de Eixos

Rota: `/calculadora-eixos/`  
Arquivo: `calculadora-eixos/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\index (43).html`
- Data: 27/08/2026
- Alteracao: substituicao integral de `calculadora-eixos/index.html` pela nova versao enviada, identificada como `Calculadora de Eixos v3.0 — Dimensionamento, Verificação e Eixo Escalonado`, com manual interativo.
- Backup da versao anterior salvo em `C:\Obras Inteligentes\backups\calculadora-eixos-index-before-index43-20260827-003823.html`.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/calculadora-eixos/`.
- O card foi classificado no filtro `Engenharia Mecanica`.
- Validar apos futuras alteracoes se o dimensionamento, verificacao, eixo escalonado, torcao, flexao, tensoes e criterios de projeto continuam carregando corretamente.

### MancalPro

Rota: `/mancalpro/`  
Arquivo: `mancalpro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\MancalPro v0.6 - abertura (offline) (1).html`
- Data: 30/07/2026
- Alteracao: atualizacao do aplicativo MancalPro para a versao standalone v0.6, com tela de abertura.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/mancalpro/`.
- O card foi classificado no filtro `Engenharia Mecanica`.
- Validar apos futuras alteracoes se a engenharia de mancais e rolamentos, selecao, vida util, arranjos, lubrificacao, cargas, ajustes, projeto termico, TEHD e rotodinamica continuam carregando corretamente.

### Calculadora de Engrenagens

Rota: `/engrenagecalc/`  
Arquivo: `engrenagecalc/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\index (45).html`
- Data: 27/08/2026
- Alteracao: substituicao integral de `engrenagecalc/index.html` pela nova versao EngrenageCalc Pro v2.0 enviada, com manual interativo.
- Backup da versao anterior salvo em `C:\Obras Inteligentes\backups\engrenagecalc-index-before-v20-20260827-081521.html`.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura animada e aceite legal.
- Tela inicial do site aponta para `/engrenagecalc/`.
- O card foi classificado no filtro `Engenharia Mecanica`.
- Validar apos futuras alteracoes se o dimensionamento de engrenagens cilindricas e conicas, verificacoes geometricas, resistencia, fatores normativos e memorial de calculo continuam carregando corretamente.

### VolantePro

Rota: `/volantepro/`  
Arquivo: `volantepro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\VolantePro_v4.3_com_abertura.html`
- Data: 31/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura e aviso legal.
- Tela inicial do site aponta para `/volantepro/`.
- O card foi classificado no filtro `Engenharia Mecanica`.
- Validar apos futuras alteracoes se o dimensionamento energetico, integridade mecanica, otimizacao multiobjetivo, diagramas torque-angulo, inercia e verificacoes de volantes de inercia continuam carregando corretamente.

### TransmissaoPro

Rota: `/transmissaopro/`  
Arquivo: `transmissaopro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\TransmissaoPro_v6.0_vida_dinamica_alinhamento_desenho.html`
- Data: 03/08/2026
- Alteracao: substituicao integral de `transmissaopro/index.html` pela versao 6.0, com vida dinamica, alinhamento e desenho de conjunto.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura e aviso legal.
- Tela inicial do site aponta para `/transmissaopro/`.
- O card foi classificado no filtro `Engenharia Mecanica`.
- Validar apos futuras alteracoes se os calculos de transmissoes por correias em V, correias sincronizadas, correntes, geometria, capacidade transmissivel, vida dinamica, alinhamento, desenho de conjunto, exportacoes e relatorios continuam carregando corretamente.

### TuboCalc

Rota: `/tubocalc/`  
Arquivo: `tubocalc/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\TuboCalc-2.0-abertura.html`
- Data: 01/08/2026
- Alteracao: substituicao integral de `tubocalc/index.html` pela versao TuboCalc 2.0, com tela de abertura e aviso legal.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura e aviso legal.
- Tela inicial do site aponta para `/tubocalc/`.
- O card foi classificado no filtro `Engenharia Mecanica`.
- Validar apos futuras alteracoes se dimensionamento de tubulacoes industriais, perdas de carga, espessuras, materiais, suportes, expansao termica, novos modulos da versao 2.0 e relatorios continuam carregando corretamente.

### CompressorSelect Pro

Rota: `/compressorselect-pro/`  
Arquivo: `compressorselect-pro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\CompressorSelect_Pro_v2.4.html`
- Data: 27/08/2026
- Alteracao: substituicao integral de `compressorselect-pro/index.html` pela versao CompressorSelect Pro v2.4 enviada.
- Backup da versao anterior salvo em `C:\Obras Inteligentes\backups\compressorselect-pro-index-before-v24-20260827-063425.html`.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/compressorselect-pro/`.
- O card foi classificado no filtro `Engenharia Mecanica`.
- Validar apos futuras alteracoes se selecao e dimensionamento de compressores de ar, catalogo de modelos, demanda pneumatica, reservatorio, rede de ar comprimido, qualidade do ar, analise energetica e relatorios continuam carregando corretamente.

### VentiladorPro

Rota: `/ventiladorpro/`  
Arquivo: `ventiladorpro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\VentiladorPro_v4.1_abertura.html`
- Data: 02/08/2026
- Alteracao: substituicao integral de `ventiladorpro/index.html` pela nova versao do aplicativo.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura e aviso legal.
- Tela inicial do site aponta para `/ventiladorpro/`.
- O card foi classificado no filtro `Engenharia Mecanica`.
- Validar apos futuras alteracoes se dimensionamento, selecao e otimizacao tecnico-economica de ventiladores, cenarios, sensibilidade, energia, acustica, vibracao e memoria tecnica continuam carregando corretamente.

### HidroCalc

Rota: `/hidrocalc/`  
Arquivo: `hidrocalc/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\HidroCalc_v2.0_com_Manual_Interativo.html`
- Data: 20/08/2026
- Alteracao: substituicao integral de `hidrocalc/index.html` pela versao 2.0, com manual interativo incorporado.
- Backup da versao anterior: `C:\Obras Inteligentes\backups\hidrocalc-index-before-v2-0-manual-interativo-20260820-2039.html`

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura.
- Tela inicial do site aponta para `/hidrocalc/`.
- O card foi classificado no filtro `Pavimentacao, Saneamento e Infraestrutura`.
- Validar apos futuras alteracoes se delimitacao de bacias, morfometria, tempo de concentracao, IDF, vazoes de projeto, mapas e memoria de calculo continuam carregando corretamente.

### ElevadorCalc Pro

Rota: `/elevadorcalc/`  
Arquivo: `elevadorcalc/index.html`

Ultima inclusao:

- Em 23/08/2026, atualizado com `index (39).html`, identificado como nova versao do ElevadorCalc Pro v2.0 com manual.
- Backup anterior: `C:\Obras Inteligentes\backups\elevadorcalc-index-before-update-20260823-1652.html`.
- Fonte: `C:\Users\ACER\Documents\Downloads\ElevadorCalc_Pro_v2.0.html`
- Data: 05/08/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/elevadorcalc/`.
- O card foi classificado no filtro `Engenharia Mecanica`.
- Validar apos futuras alteracoes se especificacao, dimensionamento, trafego vertical, ciclo de vida, otimizacao e estimativa de custos de elevadores continuam carregando corretamente.

### ThermoX Pro

Rota: `/thermox-pro/`  
Arquivo: `thermox-pro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\ThermoX_Pro_v5.0_Abertura_3D.html`
- Data: 04/08/2026
- Alteracao: substituicao integral de `thermox-pro/index.html` pela versao 5.0, com abertura 3D e recursos ampliados.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura 3D.
- Tela inicial do site aponta para `/thermox-pro/`.
- O card foi classificado no filtro `Engenharia Mecanica`.
- Validar apos futuras alteracoes se dimensionamento e verificacao de trocadores de calor, balanco termico, LMTD, epsilon-NTU, perdas hidraulicas, custos, catalogo comercial, RFQ, mudanca de fase, otimizacao e abertura 3D continuam carregando corretamente.

### Comparador de Honorarios de Projetos

Rota: `/comparador-honorarios-projetos/`  
Arquivo: `comparador-honorarios-projetos/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\Comparador_Honorarios_Projetos_v8_1_Manual.html`
- Data: 15/08/2026
- Alteracao: substituicao integral de `comparador-honorarios-projetos/index.html` pela versao 8.1 com analise, auditoria, relatorio profissional, CUB, produtividade e manual integrado.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/comparador-honorarios-projetos/`.
- O card foi classificado no filtro `Orcamento`.
- Validar apos futuras alteracoes se a comparacao de honorarios de projetos por IOPES, SENGE-BA, CEHOP, CAIXA e CAU/BR Modulos I e II, analise, auditoria, relatorio profissional, CUB, produtividade e manual integrado continuam carregando corretamente.

### ConsultoriaPro

Rota: `/consultoriapro-rodoviario/`  
Arquivo: `consultoriapro-rodoviario/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\consultoria_pro_engenharia_consultiva_rodoviaria_v5_1_2_relatorio_corrigido.html`
- Data: 05/08/2026
- Alteracao: substituicao integral de `consultoriapro-rodoviario/index.html` pela versao 5.1.2, com relatorio profissional corrigido.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/consultoriapro-rodoviario/`.
- O card foi classificado no filtro `Orcamento`.
- A versao publicada inclui abertura, governanca, rastreabilidade, cronogramas e aba de relatorio profissional.
- Validar apos futuras alteracoes se orcamento parametrico de engenharia consultiva rodoviaria, supervisao, equipes, custos, desapropriacao, reassentamento, gestao ambiental, gerenciamento e BDI continuam carregando corretamente.

### GeradorPro

Rota: `/geradorpro/`  
Arquivo: `geradorpro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\GeradorPro_v1.2_Abertura_3D.html`
- Data: 06/08/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo GeradorPro v1.2 como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura 3D.
- Tela inicial do site aponta para `/geradorpro/`.
- O card foi classificado no filtro `Instalacoes`.
- Validar apos futuras alteracoes se selecao, dimensionamento, autonomia de grupos geradores, cargas prioritarias, partida de motores, curto-circuito, catalogo e relatorios continuam carregando corretamente.

### SPDAPro

Rota: `/spdapro/`  
Arquivo: `spdapro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\SPDAPro_v1.7_abertura_3D.zip`
- Data: 07/08/2026
- Alteracao: substituicao integral de `spdapro/index.html` pela versao SPDAPro v1.7 com abertura 3D.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, extraido do ZIP enviado.
- Tela inicial do site aponta para `/spdapro/`.
- O card foi classificado no filtro `Instalacoes`.
- Validar apos futuras alteracoes se analise de risco, SPDA externo, aterramento, equipotencializacao, potenciais preliminares, otimizacao tecnico-economica, abertura 3D e relatorios continuam carregando corretamente.

### LumiPro

Rota: `/lumipro/`  
Arquivo: `lumipro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\LumiPro_v1.5(1).html`
- Data: 09/08/2026
- Alteracao: substituicao integral de `lumipro/index.html` pela nova versao enviada.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/lumipro/`.
- O card foi classificado no filtro `Instalacoes`.
- Validar apos futuras alteracoes se dimensionamento luminotecnico, ambientes, luminarias, iluminancia, catalogo e relatorios continuam carregando corretamente.

### EsgotoCalc Pro

Rota: `/esgotocalcpro/`  
Arquivo: `esgotocalcpro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\index (41).html`
- Data: 25/08/2026
- Alteracao: substituicao integral de `esgotocalcpro/index.html` pela nova versao enviada, identificada como `EsgotoCalc Pro — Dimensionamento de Redes Coletoras de Esgoto Sanitário`, com manual interativo.
- Backup da versao anterior salvo em `C:\Obras Inteligentes\backups\esgotocalcpro-index-before-index41-20260825-060826.html`.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/esgotocalcpro/`.
- O card foi classificado no filtro `Pavimentacao, Saneamento e Infraestrutura`.
- O menu/filtro antes chamado `Pavimentacao e Infraestrutura` foi renomeado para `Pavimentacao, Saneamento e Infraestrutura`.
- Validar apos futuras alteracoes se o dimensionamento de redes coletoras de esgoto sanitario, vazoes, declividades, diametros, tensao trativa, laminas e memoria tecnica continuam carregando corretamente.

### EquivaleCLT

Rota: `/equivaleclt/`  
Arquivo: `equivaleclt/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\EquivaleCLT_v1.2_manual_interativo.html`
- Data: 25/08/2026
- Alteracao: substituicao integral de `equivaleclt/index.html` pela versao EquivaleCLT v1.2 com manual interativo, preservando o card existente.
- Backup da versao anterior salvo em `C:\Obras Inteligentes\backups\equivaleclt-index-before-v12-20260825-030207.html`.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/equivaleclt/`.
- O card foi classificado no filtro `Orcamento`.
- Verificar em futuras versoes se o link interno de download do HTML continua apontando para o arquivo standalone correto.
- Validar apos futuras alteracoes se a simulacao CLT/PJ, encargos SINAPI, beneficios, tributos, reservas, cenarios comparativos e relatorio continuam carregando corretamente.

### HidroSan Pro

Rota: `/hidrosan-pro/`  
Arquivo: `hidrosan-pro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\HidroSan_Pro_v1.5_Offline.html`
- Data: 09/08/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo HidroSan Pro v1.5 como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura e aviso de responsabilidade.
- Tela inicial do site aponta para `/hidrosan-pro/`.
- O card foi classificado no filtro `Instalacoes`.
- Validar apos futuras alteracoes se os modulos de agua fria, esgoto sanitario, ventilacao sanitaria, reservatorios, criterios normativos, exemplos, relatorios e memorias de calculo continuam carregando corretamente.

### TerceirizaPro

Rota: `/terceirizapro/`  
Arquivo: `terceirizapro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\TerceirizaPro_v2.0_Conta_Vinculada_Consolidado (1) (1).html`
- Data: 11/08/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo TerceirizaPro v2.0 como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/terceirizapro/`.
- O card foi classificado no filtro `Gestao de Obras e de Contratos`.
- O menu/filtro antes chamado `Gestao de Obras` foi renomeado para `Gestao de Obras e de Contratos`.
- Validar apos futuras alteracoes se os modulos de fato gerador, conta vinculada, provisoes trabalhistas, medicoes, glosas, conciliacao, riscos e relatorios continuam carregando corretamente.

### CimbrePro

Rota: `/cimbrepro/`  
Arquivo: `cimbrepro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\CimbrePro (standalone).html`
- Data: 12/08/2026
- Alteracao: substituicao do HTML publicado pela nova versao standalone do CimbrePro.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/cimbrepro/`.
- O card foi classificado no filtro `Estruturas`.
- Validar apos futuras alteracoes se os modulos de cargas, malha de torres, longarinas, prazos de desforma, verificacoes tecnicas, relatorio e exportacao IFC continuam carregando corretamente.

### AlvenariaPro

Rota: `/alvenariapro/`  
Arquivo: `alvenariapro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\AlvenariaPro_v1.4.html`
- Data: 12/08/2026
- Alteracao: substituicao do HTML publicado pela nova versao AlvenariaPro v1.4 como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/alvenariapro/`.
- O card foi classificado no filtro `Estruturas`.
- Validar apos futuras alteracoes se os modulos de materiais, blocos, editor CAD, importacao DXF/PDF, planta estrutural, cargas verticais, flexo-compressao, cisalhamento, graute, armaduras, cintas, modulacao construtiva, amarracoes, quantitativos e relatorios continuam carregando corretamente.

### AndaimeFach Pro

Rota: `/andaimefach-pro/`  
Arquivo: `andaimefach-pro/index.html`

Ultima inclusao:

- Em 23/08/2026, atualizado com `index (38).html`, identificado como nova versao do AndaimeFach Pro com manual.
- Backup anterior: `C:\Obras Inteligentes\backups\andaimefach-pro-index-before-update-20260823-1122.html`.
- Fonte: `C:\Users\ACER\Documents\Downloads\AndaimeFach Pro - abertura.html`
- Data: 13/08/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo AndaimeFach Pro como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura e aviso legal.
- Tela inicial do site aponta para `/andaimefach-pro/`.
- O card foi classificado no filtro `Estruturas`.
- Validar apos futuras alteracoes se os modulos de geometria da fachada, cargas, vento, ancoragens, verificacao estrutural, otimizacao, cronograma, orcamento, memorial e exportacoes continuam carregando corretamente.

### GruaPro

Rota: `/gruapro/`  
Arquivo: `gruapro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\GruaPro_v1.4.html`
- Data: 26/08/2026
- Alteracao: inclusao de novo card na home, no filtro `Estruturas`, e publicacao do aplicativo GruaPro v1.4 como HTML standalone.
- Backup da home anterior salvo em `C:\Obras Inteligentes\backups\index-before-gruapro-20260826-170750.html`.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura e manual.
- Tela inicial do site aponta para `/gruapro/`.
- O card foi classificado no filtro `Estruturas`.
- Validar apos futuras alteracoes se os modulos de IFC/BIM, planejamento de gruas, documentacao, raio de operacao, interferencias, produtividade, seguranca e relatorios continuam carregando corretamente.

### IcamentoPro

Rota: `/icamento-pro/`  
Arquivo: `icamento-pro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\IcamentoPro_v2.0.html`
- Data: 27/08/2026
- Alteracao: substituicao integral de `icamento-pro/index.html` pela versao IcamentoPro v2.0 Engineering enviada, preservando o card existente no filtro `Estruturas`.
- Backup da versao anterior salvo em `C:\Obras Inteligentes\backups\icamento-pro-index-before-v20-20260827-130122.html`.
- Backup da home anterior a inclusao original salvo em `C:\Obras Inteligentes\backups\index-before-icamento-pro-20260827-004151.html`.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura e manual.
- Tela inicial do site aponta para `/icamento-pro/`.
- O card foi classificado no filtro `Estruturas`.
- Validar apos futuras alteracoes se os modulos de cargas, raio de operacao, acessorios, estabilidade, interferencias, seguranca, planejamento e relatorios continuam carregando corretamente.

### RecebeObra Pro

Rota: `/recebeobra-pro/`  
Arquivo: `recebeobra-pro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\RecebeObraPro_v1.2B (1) (1).html`
- Data: 14/08/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo RecebeObra Pro v1.2B como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura e avisos legais.
- Tela inicial do site aponta para `/recebeobra-pro/`.
- O card foi classificado no filtro `Gestao de Obras e de Contratos`.
- Validar apos futuras alteracoes se os modulos de contrato e obra, tipo de obra, documentos, ensaios, vistoria, punch list, prontidao, recebimento provisorio, recebimento definitivo, garantia, relatorios e armazenamento local continuam carregando corretamente.

### CriticaOpex

Rota: `/criticaopex/`  
Arquivo: `criticaopex/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\CriticaOpex_v2.1.html`
- Data: 15/08/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo CriticaOpex v2.1 como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura e aviso de responsabilidade.
- Tela inicial do site aponta para `/criticaopex/`.
- O card foi classificado no novo filtro `Manutencao Predial`.
- O filtro `Manutencao Predial` tambem passou a agrupar o modulo original `/manutencao/`.
- Validar apos futuras alteracoes se os modulos de vistoria predial, matriz GOS, biblioteca de patologias, catalogo de servicos, Opex imediato, otimizacao sob teto orcamentario, relatorios e armazenamento local continuam carregando corretamente.
- Em 16/08/2026, foi atualizado com a nova versao `CriticaOpex_v2.6.1_Manual.html`, identificada no titulo como CriticaOpex 2.6.1, com manual integrado.
- Backup anterior salvo em `C:\Obras Inteligentes\backups\criticaopex-index-before-v2-6-1-20260816-20260816-194624.html`.
- Em 16/08/2026, foi atualizado novamente com a nova versao `CriticaOpex_v3.1(1).html`, identificada no titulo como CriticaOpex 3.1, com gestao patrimonial, banco de ensaios e mapa de patologias.
- Backup anterior salvo em `C:\Obras Inteligentes\backups\criticaopex-index-before-v3-1-20260816-20260816-225156.html`.

### PMOC Manager

Rota: `/pmoc-manager/`  
Arquivo: `pmoc-manager/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\PMOC_Manager_v2.2_Visual_Manual_offline.html`
- Data: 17/08/2026
- Alteracao: inclusao de novo card na home, no filtro `Manutencao Predial`, e publicacao do aplicativo PMOC Manager v2.2 como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com tela de abertura 3D, aviso legal e manual visual offline.
- Tela inicial do site aponta para `/pmoc-manager/`.
- Backup da home anterior salvo em `C:\Obras Inteligentes\backups\index-before-pmoc-manager-20260817-20260817-073334.html`.
- Validar apos futuras alteracoes se os modulos de edificacao, equipamentos, plano PMOC, ordens de servico, QAI, ensaios, energia, pecas, indicadores, relatorios, anexos e armazenamento local continuam carregando corretamente.

### MobilizaSICRO

Rota: `/mobilizasicro/`  
Arquivo: `mobilizasicro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\MobilizaSICRO_v1.2.1.html`
- Data: 18/08/2026
- Alteracao: inclusao de novo card na home, no filtro `Orcamento`, e publicacao do aplicativo MobilizaSICRO v1.2.1 como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico, com calculadora offline de mobilizacao e desmobilizacao baseada no SICRO, Volume 08.
- Tela inicial do site aponta para `/mobilizasicro/`.
- Backup da home anterior salvo em `C:\Obras Inteligentes\backups\index-before-mobilizasicro-20260818-0725.html`.
- Validar apos futuras alteracoes se abertura, banco SICRO, servicos, planejamento, rotas, composicoes, cronograma, custos e relatorios continuam carregando corretamente.

### Canteiro de Obras - Sicro

Rota: `/canteiro-sicro/`  
Arquivo: `canteiro-sicro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\CanteiroSICRO_v4.0_Etapas1a10 (5).html`
- Data: 23/08/2026
- Alteracao: substituicao do aplicativo pelo CanteiroSICRO v4.0.0, etapas 1 a 10, mantendo a rota `/canteiro-sicro/` e o card independente no filtro `Orcamento`.
- Backup da versao anterior do aplicativo salvo em `C:\Obras Inteligentes\backups\canteiro-sicro-index-before-v4-20260823-185959.html`.

Observacoes:

- Este modulo e independente do card `Administracao Local e Canteiro de Obra`, cuja rota continua em `/administracao-canteiro/` e nao foi substituida.
- Aplicativo standalone em HTML unico, com calculadora offline de canteiro de obras baseada no SICRO.
- Tela inicial do site aponta para `/canteiro-sicro/`.
- Backup da home anterior salvo em `C:\Obras Inteligentes\backups\index-before-canteiro-sicro-20260823-1705.html`.
- Validar apos futuras alteracoes se projetos, canteiros moveis, fatores SICRO, autotestes, custos e memoria de calculo continuam carregando corretamente.

### Locar ou Comprar Pro

Rota: `/locar-ou-comprar-pro/`  
Arquivo: `locar-ou-comprar-pro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\LocarOuComprarPro_v1.4.html`
- Data: 27/08/2026
- Alteracao: inclusao de novo card na home, no filtro `Orcamento`, e publicacao do aplicativo Locar ou Comprar Pro v1.4 como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/locar-ou-comprar-pro/`.
- O card foi classificado no filtro `Orcamento`.
- Backup da home anterior salvo em `C:\Obras Inteligentes\backups\index-before-locar-ou-comprar-pro-20260827-202628.html`.
- Validar apos futuras alteracoes se a comparacao economica entre locacao e compra, custos, produtividade, prazos, valor residual, cenarios e relatorios continuam carregando corretamente.

### AcessCheck

Rota: `/acesscheck/`  
Arquivo: `acesscheck/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\AcessCheck (2).html`
- Data: 21/08/2026
- Alteracao: substituicao integral de `acesscheck/index.html` pela nova versao do aplicativo.
- Backup da versao anterior: `C:\Obras Inteligentes\backups\acesscheck-index-before-v2-20260821-0747.html`

Observacoes:

- Aplicativo de vistoria de acessibilidade conforme NBR 9050, com splash screen, aviso legal, checklist, registro fotografico e emissao de laudo tecnico.
- Tela inicial do site aponta para `/acesscheck/`.
- Backup da home anterior salvo em `C:\Obras Inteligentes\backups\index-before-acesscheck-20260820-2034.html`.
- Validar apos futuras alteracoes se a tela de abertura, aviso legal, checklist de acessibilidade, registro fotografico, armazenamento local e laudos continuam carregando corretamente.

## Artigos publicados na home

Em 20/07/2026, os tres cards iniciais do bloco `Conteudo` da home foram substituidos por artigos reais enviados em PDF. Em 21/07/2026, foi incluido um quarto artigo. A estrategia adotada foi renderizar cada pagina do PDF como PNG dentro de uma pagina HTML propria, preservando a diagramacao original, tabelas, figuras e paginacao. Cada pagina tambem oferece link para abrir/baixar o PDF original.

| Card | Titulo | Rota publicada | PDF original | Paginas |
|---|---|---|---|---:|
| Licitacao | O uso dos concursos para a contratacao de projetos | `/artigos/concursos-projetos/` | `artigos/pdfs/concursos-projetos.pdf` | 20 |
| Contratos | A remuneracao variavel nos contratos administrativos | `/artigos/remuneracao-variavel-obras-publicas/` | `artigos/pdfs/remuneracao-variavel-obras-publicas.pdf` | 33 |
| Orcamento | Calculando contingencias em orcamentos de obras publicas | `/artigos/contingencias-obras-publicas/` | `artigos/pdfs/contingencias-obras-publicas.pdf` | 11 |
| Tributacao | Reforma Tributaria e o IVA Equivalente | `/artigos/reforma-tributaria-iva-equivalente/` | `artigos/pdfs/reforma-tributaria-iva-equivalente.pdf` | 28 |

Arquivos de apoio:

- CSS comum: `artigos/artigo.css`
- Imagens renderizadas: `artigos/<slug>/pages/page-XX.png`

Backup antes desta alteracao:

- `C:\Obras Inteligentes\backups\site-b66b9dd-before-artigos-20260720-071940.zip`

## Fluxo padrao para atualizar um modulo

1. Verificar o estado do Git:

```powershell
git status --short --branch
```

2. Copiar o arquivo novo para a rota correta:

```powershell
Copy-Item -LiteralPath 'C:\Users\ACER\Documents\Downloads\arquivo_novo.html' -Destination 'C:\Obras Inteligentes\nome-da-rota\index.html' -Force
```

3. Validar scripts embutidos quando for HTML standalone:

```powershell
$html = Get-Content -LiteralPath 'C:\Obras Inteligentes\nome-da-rota\index.html' -Raw -Encoding UTF8
$matches = [regex]::Matches($html, '<script(?![^>]*type="(?:__bundler|application/json)"|[^>]*type=''(?:__bundler|application/json)'')[^>]*>([\s\S]*?)</script>')
$i = 0
foreach ($m in $matches) {
  $code = $m.Groups[1].Value
  if ($code.Trim().Length -gt 0) {
    $i++
    $path = Join-Path $env:TEMP "modulo-script-$i.js"
    [System.IO.File]::WriteAllText($path, $code, [System.Text.UTF8Encoding]::new($false))
    node --check $path
  }
}
"scripts_checked=$i"
```

4. Testar localmente com servidor HTTP, pois alguns modulos usam `fetch`:

```powershell
cd "C:\Obras Inteligentes"
python -m http.server 8094 --bind 127.0.0.1
```

URL local:

```text
http://127.0.0.1:8094/nome-da-rota/
```

5. Adicionar somente arquivos relacionados:

```powershell
git add index.html nome-da-rota/index.html
```

Para Casa Parametrica, normalmente:

```powershell
git add casa-parametrica/index.html casa-parametrica/static/static-api.js casa-parametrica/static/app.js
```

6. Commitar e enviar:

```powershell
git commit -m "Mensagem objetiva"
git push
```

7. Conferir publicacao:

```powershell
$headers = @{ 'User-Agent'='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36'; 'Accept'='text/html,*/*' }
Invoke-WebRequest -UseBasicParsing -Headers $headers -Uri 'https://www.obrasinteligentes.ia.br/nome-da-rota/?v=HASH_DO_COMMIT' -TimeoutSec 30
```

## Fluxo padrao para incluir um novo card

1. Criar pasta da rota:

```powershell
New-Item -ItemType Directory -Path 'C:\Obras Inteligentes\nova-rota' -Force
```

2. Copiar o HTML:

```powershell
Copy-Item -LiteralPath 'C:\Users\ACER\Documents\Downloads\arquivo.html' -Destination 'C:\Obras Inteligentes\nova-rota\index.html' -Force
```

3. Editar `C:\Obras Inteligentes\index.html`:

- adicionar novo `<a class="app" href="/nova-rota/">...`;
- usar a proxima numeracao;
- adicionar link no rodape em `<h4>Aplicativos</h4>`.

4. Validar, commitar e publicar como acima.

## Cuidados recorrentes

- Nao usar `git reset --hard` nem reverter alteracoes do usuario.
- Ha arquivos nao versionados persistentes no diretorio raiz:

```text
GeradorMemorialDescritivo (4).html
calculadora_administracao_local_atualizada.html
```

Eles devem ser ignorados, a menos que o usuario peca explicitamente.

- `.gitignore` ignora:
  - `Sistema Manutenção Predial/`
  - `Gestão e Fiscalização de Contratos/`
  - arquivos soltos historicos como `Calculadora Estrutural.html`, `Abertura - Mapa e Matriz de Riscos.html`, `mapa_matriz_riscos_pro_v4.html`.

- Para alteracoes em JavaScript ja publicado, usar query string de cache no HTML quando o usuario relatar que Chrome nao atualiza.
- A Hostinger pode levar alguns segundos para sincronizar apos `git push`.
- Usar parametro `?v=<hash>` ao testar no navegador/publicacao.
- Se `Invoke-WebRequest` retornar 403 em algum momento, testar com `User-Agent` de navegador ou via Chrome/Playwright.

## Comandos uteis de inventario

Listar cards na home:

```powershell
Select-String -Path 'C:\Obras Inteligentes\index.html' -Pattern '<a class="app"|app-num|<h3>|href='
```

Verificar rotas publicadas:

```powershell
$headers=@{ 'User-Agent'='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36'; 'Accept'='text/html,*/*' }
@(
  '/manutencao/',
  '/fiscalizacao/',
  '/estrutural/',
  '/pavimentos/',
  '/riscos/',
  '/administracao-canteiro/',
  '/memorial-descritivo/',
  '/sispav-reabilitacao/',
  '/muros-arrimo/',
  '/casa-parametrica/',
  '/termopro/',
  '/circuitopro/',
  '/reservatoriopro/',
  '/bombapro/',
  '/paraboltpro/',
  '/steelpro/',
  '/cronogramapro/',
  '/drenapro/',
  '/taludepro/',
  '/solarpro/',
  '/pgrcc/',
  '/ventopro/',
  '/concretopro/',
  '/aterramentopro/',
  '/parafusopro/',
  '/risco-cambial/',
  '/protendpro/',
  '/eventogramapro/',
  '/termo-massa/',
  '/cabocalc/',
  '/subestacaopro/',
  '/brucknercalc/',
  '/molapro/',
  '/calculadora-eixos/',
  '/mancalpro/',
  '/engrenagecalc/',
  '/volantepro/',
  '/transmissaopro/',
  '/tubocalc/',
  '/compressorselect-pro/',
  '/ventiladorpro/',
  '/hidrocalc/',
  '/elevadorcalc/',
  '/thermox-pro/',
  '/comparador-honorarios-projetos/',
  '/consultoriapro-rodoviario/',
  '/geradorpro/',
  '/spdapro/',
  '/lumipro/',
  '/esgotocalcpro/',
  '/equivaleclt/',
  '/hidrosan-pro/',
  '/terceirizapro/',
  '/cimbrepro/',
  '/alvenariapro/',
  '/andaimefach-pro/',
  '/gruapro/',
  '/icamento-pro/',
  '/recebeobra-pro/',
  '/criticaopex/',
  '/pmoc-manager/',
  '/mobilizasicro/',
  '/canteiro-sicro/',
  '/acesscheck/'
) | ForEach-Object {
  $url = "https://www.obrasinteligentes.ia.br$_?v=check"
  $r = Invoke-WebRequest -UseBasicParsing -Headers $headers -Uri $url -TimeoutSec 30
  [pscustomobject]@{ Rota=$_; Status=$r.StatusCode; Tamanho=$r.Content.Length }
}
```

## Prompt de continuidade recomendado

Use este contexto em novas conversas:

```text
Estamos trabalhando no site estatico www.obrasinteligentes.ia.br, cujo repositorio local fica em C:\Obras Inteligentes e publica na Hostinger via push para o GitHub https://github.com/andrebaetaobraspublicas-collab/obras-inteligentes-site.git, branch main. Leia primeiro C:\Obras Inteligentes\DOCUMENTACAO_COMPLETA_SITE.md. Nao inclua arquivos nao versionados soltos do diretorio raiz, salvo pedido expresso. Para alterar modulo, copie o HTML para a pasta da rota, valide scripts, teste localmente, faca commit e push. Para Casa Parametrica, preserve a camada estatica em static/static-api.js e atualize query string de cache no index.html quando mexer em JS.
```
