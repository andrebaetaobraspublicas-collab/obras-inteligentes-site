# Publicacao do site e do sistema

Este diretorio ficou preparado para preservar a pagina inicial da Hostinger e abrir o
sistema de Manutencao Predial em um clique.

## O que foi alterado na pagina inicial

- O card "Manutencao Predial" em `index.html` agora abre:
  `https://manutencao.obrasinteligentes.ia.br`
- O link de rodape "Manutencao Predial" aponta para o mesmo endereco.
- A tela inicial foi preservada; nao houve mudanca de layout estrutural.

## Repositorio 1: pagina inicial na Hostinger

Use este diretorio (`C:\Obras Inteligentes`) como repositorio do site estatico.
A raiz contem o `index.html` que a Hostinger deve publicar.

Comandos, depois de criar um repositorio vazio no GitHub:

```bash
cd "C:/Obras Inteligentes"
git init
git add index.html .gitignore PUBLICACAO_GITHUB_HOSTINGER.md
git commit -m "Vincula sistema de manutencao predial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/obras-inteligentes-site.git
git push -u origin main
```

Na Hostinger, conecte esse repositorio ao deploy do site
`www.obrasinteligentes.ia.br`.

## Repositorio 2: sistema Flask

Use a pasta `C:\Obras Inteligentes\Sistema Manutenção Predial` como repositorio do
sistema.

Comandos, depois de criar um repositorio vazio no GitHub:

```bash
cd "C:/Obras Inteligentes/Sistema Manutenção Predial"
git init
git add .
git commit -m "Publica sistema de manutencao predial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/manutencao-predial.git
git push -u origin main
```

O `.gitignore` dessa pasta ja exclui `database.db` e `uploads/`, para nao enviar
dados operacionais ao GitHub.

## Hospedagem do sistema

Como a Hostinger compartilhada normalmente nao executa Flask/Python, hospede o
sistema em um ambiente Python, como PythonAnywhere, e configure o subdominio:

```text
manutencao.obrasinteligentes.ia.br
```

No DNS da Hostinger, crie o CNAME `manutencao` apontando para o destino informado
pelo PythonAnywhere.

Quando o subdominio estiver ativo, o clique na home ja abrira o sistema.
