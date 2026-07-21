# Documentacao completa do site Obras Inteligentes

Atualizado em: 19/07/2026  
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

A tela inicial possui atualmente 20 cards de aplicativos. Cada card aponta para uma rota estatica dentro do dominio. A regra geral e:

```text
https://www.obrasinteligentes.ia.br/nome-da-rota/
C:\Obras Inteligentes\nome-da-rota\index.html
```

Excecoes/observacoes:

- Alguns cards usam URL absoluta no `href`, mas a rota final continua dentro do mesmo dominio.
- A pasta `casa-parametrica` tem arquivos auxiliares em `data/` e `static/`.
- A pasta `manutencao` tem `index.html` e `mp_backend.js`.
- As pastas antigas `Sistema Manutenção Predial` e `Gestão e Fiscalização de Contratos` sao fontes/backup historicos e estao ignoradas pelo Git.

## Inventario verificado dos aplicativos

Verificacao feita em 21/07/2026. Todos os cards da home possuem arquivo local correspondente e todas as rotas publicadas responderam HTTP `200`.

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

## Tamanhos verificados

Estes tamanhos ajudam a identificar se uma rota local foi substituida corretamente. Pequenas diferencas entre bytes locais e comprimento de texto baixado podem ocorrer por codificacao.

| Rota | Tamanho local aproximado | Tamanho publicado verificado |
|---|---:|---:|
| `/manutencao/` | 278361 bytes | 274136 caracteres |
| `/fiscalizacao/` | 354221 bytes | 354221 caracteres |
| `/estrutural/` | 989496 bytes | 989496 caracteres |
| `/pavimentos/` | 102865 bytes | 102865 caracteres |
| `/riscos/` | 582771 bytes | 582771 caracteres |
| `/administracao-canteiro/` | 480651 bytes | 480651 caracteres |
| `/memorial-descritivo/` | 6349 bytes | 6349 caracteres |
| `/sispav-reabilitacao/` | 147360 bytes | 147360 caracteres |
| `/muros-arrimo/` | 91962 bytes | 91962 caracteres |
| `/casa-parametrica/` | 38883 bytes | 38883 caracteres |
| `/termopro/` | 205855 bytes | 205855 caracteres |
| `/circuitopro/` | 236513 bytes | 236513 caracteres |
| `/reservatoriopro/` | 161199 bytes | 161199 caracteres |
| `/bombapro/` | 128127 bytes | 128127 caracteres |
| `/paraboltpro/` | 1147646 bytes | 1147646 caracteres |
| `/steelpro/` | 229160 bytes | 229160 caracteres |
| `/cronogramapro/` | 505340 bytes | 505340 caracteres |
| `/drenapro/` | 185925 bytes | 185925 caracteres |
| `/taludepro/` | 97674 bytes | 97674 caracteres |
| `/solarpro/` | 205028 bytes | 205028 caracteres |

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

Atualizacao posterior: tambem existem as pastas `C:\Obras Inteligentes\reservatoriopro\index.html`, correspondente ao card 13 / RESERVATORIO, `C:\Obras Inteligentes\bombapro\index.html`, correspondente ao card 14 / BOMBAS, `C:\Obras Inteligentes\paraboltpro\index.html`, correspondente ao card 15 / CHUMBADORES, `C:\Obras Inteligentes\steelpro\index.html`, correspondente ao card 16 / ACO, `C:\Obras Inteligentes\cronogramapro\index.html`, correspondente ao card 17 / CRONOGRAMA, `C:\Obras Inteligentes\drenapro\index.html`, correspondente ao card 18 / DRENAGEM, `C:\Obras Inteligentes\taludepro\index.html`, correspondente ao card 19 / TALUDES, e `C:\Obras Inteligentes\solarpro\index.html`, correspondente ao card 20 / SOLAR.

## Estado funcional importante por modulo

### Manutencao Predial

Rota: `/manutencao/`  
Arquivos: `manutencao/index.html`, `manutencao/mp_backend.js`

Observacoes:

- Foi ajustado para acesso livre, sem exigir login.
- O backend e simulado/local em JavaScript, adequado a hospedagem estatica.
- A pasta antiga `Sistema Manutenção Predial` existe como historico, mas esta ignorada no Git.

### Fiscalizacao de Contratos

Rota: `/fiscalizacao/`  
Arquivo: `fiscalizacao/index.html`

Observacoes:

- Card e rota publicados e funcionais.
- Existe pasta historica `Gestão e Fiscalização de Contratos`, ignorada pelo Git.

### Calculadora Estrutural

Rota: `/estrutural/`  
Arquivo: `estrutural/index.html`  
Copia local historica: `C:\Obras Inteligentes\Calculadora Estrutural.html`

Observacoes:

- Em atualizacoes futuras, preservar/forcar o aviso legal quando o usuario pedir nova versao.
- Em alteracoes com JavaScript ou aceite legal, usar cache busting se necessario.

### Calculadora de Pavimentos

Rota: `/pavimentos/`  
Arquivo: `pavimentos/index.html`

Observacoes:

- Recebeu aviso legal equivalente ao da Calculadora Estrutural.
- Relatorios devem conter aviso resumido de responsabilidade tecnica.

### Mapa & Matriz de Riscos

Rota: `/riscos/`  
Arquivo: `riscos/index.html`  
Fontes historicas no diretorio raiz:

```text
Abertura - Mapa e Matriz de Riscos.html
mapa_matriz_riscos_pro_v4.html
```

### Administracao Local e Canteiro de Obra

Rota: `/administracao-canteiro/`  
Arquivo: `administracao-canteiro/index.html`

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

- Substituido por `SisPav_Reabilitacao_de_Pavimentos_v2026-07.html`.
- Commit historico: `9b71144` - `Atualiza modulo SisPav`.

### Calculadora de Muros de Arrimo

Rota: `/muros-arrimo/`  
Arquivo: `muros-arrimo/index.html`

Ultima atualizacao:

- Fonte: `Calculadora de Muros de Arrimo -completo-.html`.
- Commit historico: `a3ee841` - `Adiciona calculadora de muros de arrimo`.

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
static/static-api.js?v=pdf-formatado-20260719-1
static/app.js?v=pdf-formatado-20260719-1
```

Sempre que alterar `static-api.js` ou `app.js`, atualize tambem a query string no `casa-parametrica/index.html` para evitar cache do Chrome.

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

- Fonte: `C:\Users\ACER\Documents\Downloads\TermoPro_3_2.html`
- Commit: `4acef8c` - `Atualiza TermoPro para versao 3.2`

Observacoes:

- O titulo interno ainda aparece como `TermoPro 3.0`, mas o arquivo publicado e o anexo mais recente `TermoPro_3_2.html`.
- Validado com abertura, aceite, calculo e abas de dimensionamento/catalogo/documentacao.

### CircuitoPro

Rota: `/circuitopro/`  
Arquivo: `circuitopro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\CircuitoPro (4).html`
- Data: 19/07/2026
- Alteracao: substituicao integral de `circuitopro/index.html` pela nova versao do aplicativo.

Observacoes:

- Aplicativo standalone.
- Validado com carregamento da tela legal e presenca da interface principal.

### ReservatorioPro

Rota: `/reservatoriopro/`  
Arquivo: `reservatoriopro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\ReservatorioPro (2).html`
- Data: 19/07/2026
- Alteracao: substituicao integral de `reservatoriopro/index.html` pela nova versao do aplicativo.

Observacoes:

- Aplicativo standalone.
- Tela inicial do site aponta para `/reservatoriopro/`.
- Validar apos futuras alteracoes se a tela de abertura, calculos, exportacoes e relatorios continuam carregando sem dependencias externas.

### BombaPro

Rota: `/bombapro/`  
Arquivo: `bombapro/index.html`

Ultima atualizacao:

- Fonte: `C:\Users\ACER\Documents\Downloads\BombaPro (7).html`
- Data: 20/07/2026
- Alteracao: substituicao integral de `bombapro/index.html` pela nova versao do aplicativo.

Observacoes:

- Aplicativo standalone.
- Usa bibliotecas via CDN: Chart.js, xlsx e jsPDF.
- Tela inicial do site aponta para `/bombapro/`.
- Validar apos futuras alteracoes se graficos, exportacao Excel e relatorios PDF continuam carregando corretamente.

### ParaboltPro

Rota: `/paraboltpro/`  
Arquivo: `paraboltpro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\ParaboltPro-v2.7.1-exemplos-corrigidos.html`
- Data: 20/07/2026
- Alteracao: substituicao integral de `paraboltpro/index.html` pela versao 2.7.1 com exemplos corrigidos.

Observacoes:

- Aplicativo standalone em HTML unico.
- Tela inicial do site aponta para `/paraboltpro/`.
- Validar apos futuras alteracoes se a abertura, calculos, exportacoes e relatorios continuam carregando corretamente.

### SteelPro

Rota: `/steelpro/`  
Arquivo: `steelpro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\SteelPro - offline (1).html`
- Data: 20/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

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

### DrenaPro

Rota: `/drenapro/`  
Arquivo: `drenapro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\DrenaPro (standalone).html`
- Data: 21/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/drenapro/`.
- Validar apos futuras alteracoes se a abertura, os calculos hidrologicos/hidraulicos, as exportacoes e os relatorios continuam carregando corretamente.

### TaludePro

Rota: `/taludepro/`  
Arquivo: `taludepro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\TaludePro Standalone.html`
- Data: 21/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/taludepro/`.
- Validar apos futuras alteracoes se a abertura, os calculos geotecnicos, as verificacoes de estabilidade e os relatorios continuam carregando corretamente.

### SolarPro

Rota: `/solarpro/`  
Arquivo: `solarpro/index.html`

Ultima inclusao:

- Fonte: `C:\Users\ACER\Documents\Downloads\SolarPro - Geracao Fotovoltaica.html`
- Data: 21/07/2026
- Alteracao: inclusao de novo card na home e publicacao do aplicativo como HTML standalone.

Observacoes:

- Aplicativo standalone empacotado em HTML unico.
- Tela inicial do site aponta para `/solarpro/`.
- Validar apos futuras alteracoes se a abertura, os calculos de geracao fotovoltaica, economia, payback, exportacoes e relatorios continuam carregando corretamente.

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
  '/solarpro/'
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
