/* ============================================================================
   BACKEND CLIENT-SIDE — Sistema de Manutenção Predial (versão estática HTML+JS)
   Substitui o servidor Flask: guarda tudo no localStorage do navegador e
   intercepta as chamadas fetch('/api/...') para responder localmente.
   Anexos são guardados em base64 (data URL) junto com os dados.
   ============================================================================ */
(function () {
    'use strict';

    var STORE_KEY = 'mp_db_v1';
    var db = null;

    // ---------- Persistência ----------
    function save() { localStorage.setItem(STORE_KEY, JSON.stringify(db)); }
    function load() {
        try { db = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { db = null; }
        if (!db || !db.usuarios) { db = seed(); save(); }
    }
    function nextId(t) {
        var m = 0; (db[t] || []).forEach(function (r) { if (r.id > m) m = r.id; });
        return m + 1;
    }
    function tabela(t) { if (!db[t]) db[t] = []; return db[t]; }
    function acharIdx(t, id) { return tabela(t).findIndex(function (r) { return String(r.id) === String(id); }); }

    // ---------- Senhas (hash simples — gate client-side, não é segurança forte) ----------
    function hashSenha(s) {
        s = String(s); var h = 5381;
        for (var i = 0; i < s.length; i++) { h = ((h << 5) + h) + s.charCodeAt(i); h = h & 0xffffffff; }
        return (h >>> 0).toString(16);
    }

    // ---------- Datas ----------
    function nowStr() { return new Date().toISOString().slice(0, 19).replace('T', ' '); }
    function d(off) { var x = new Date(); x.setDate(x.getDate() + off); return x.toISOString().slice(0, 10); }
    function soData(v) { return v ? String(v).split('T')[0].split(' ')[0] : null; }

    // ---------- Sessão / Login ----------
    var _sessao = null;
    try { _sessao = JSON.parse(sessionStorage.getItem('mp_sessao') || 'null'); } catch (e) { _sessao = null; }
    window.MPAuth = {
        login: function (email, senha) {
            var u = tabela('usuarios').find(function (x) { return (x.email || '').toLowerCase() === String(email).toLowerCase(); });
            if (u && u.senha_hash && u.senha_hash === hashSenha(senha)) {
                _sessao = { user_id: u.id, nome: u.nome, perfil: u.perfil };
                sessionStorage.setItem('mp_sessao', JSON.stringify(_sessao));
                return true;
            }
            return false;
        },
        logout: function () { _sessao = null; sessionStorage.removeItem('mp_sessao'); },
        session: function () { return _sessao; }
    };

    // ---------- Sub-entidades de contrato (CRUD genérico) ----------
    var SUB = {
        aditivos: 'contrato_aditivos', prorrogacoes: 'contrato_prorrogacoes',
        apostilamentos: 'contrato_apostilamentos', empenhos: 'contrato_empenhos',
        subcontratacoes: 'contrato_subcontratacoes', medicoes: 'contrato_medicoes',
        garantias: 'contrato_garantias', reajustes: 'contrato_reajustes',
        cronograma: 'contrato_cronograma', riscos: 'contrato_riscos',
        penalidades: 'contrato_penalidades', recebimentos: 'contrato_recebimentos',
        fiscais: 'contrato_fiscais'
    };

    // ---------- Helpers de cálculo (dashboard / relatórios) ----------
    function num(v) { return Number(v) || 0; }
    function vigenciaAtual(c) {
        var datas = [c.data_termino];
        tabela('contrato_prorrogacoes').forEach(function (p) { if (p.contrato_id === c.id) datas.push(p.nova_vigencia); });
        tabela('contrato_aditivos').forEach(function (a) { if (a.contrato_id === c.id) datas.push(a.nova_vigencia_fim); });
        datas = datas.filter(Boolean).map(soData);
        return datas.length ? datas.sort().slice(-1)[0] : null;
    }
    function resumoContrato(c) {
        var ad = tabela('contrato_aditivos').filter(function (a) { return a.contrato_id === c.id; });
        var acr = ad.reduce(function (s, a) { return s + num(a.valor_acrescido); }, 0);
        var sup = ad.reduce(function (s, a) { return s + num(a.valor_suprimido); }, 0);
        var valor = num(c.valor);
        var emp = tabela('contrato_empenhos').filter(function (e) { return e.contrato_id === c.id; });
        return {
            valor: valor, acr: acr, sup: sup, valor_atualizado: valor + acr - sup,
            perc: valor ? (acr / valor * 100) : 0,
            empenhado: emp.reduce(function (s, e) { return s + num(e.valor_empenhado); }, 0),
            liquidado: emp.reduce(function (s, e) { return s + num(e.valor_liquidado); }, 0),
            pago: emp.reduce(function (s, e) { return s + num(e.valor_pago); }, 0),
            medido: tabela('contrato_medicoes').filter(function (m) { return m.contrato_id === c.id; }).reduce(function (s, m) { return s + num(m.valor); }, 0)
        };
    }
    function diasRestantes(vig) {
        if (!vig) return null;
        var hoje = new Date(new Date().toISOString().slice(0, 10));
        var dt = new Date(vig);
        return Math.round((dt - hoje) / 86400000);
    }

    // ---------- Manutenção preventiva ----------
    function calcularProximaData(base, valor, unidade) {
        var x = new Date(base); valor = Number(valor);
        if (unidade === 'dias') x.setDate(x.getDate() + valor);
        else if (unidade === 'semanas') x.setDate(x.getDate() + valor * 7);
        else if (unidade === 'meses') x.setMonth(x.getMonth() + valor);
        else if (unidade === 'anos') x.setFullYear(x.getFullYear() + valor);
        return x;
    }

    // ---------- Leitura de arquivos (base64) ----------
    function fileToDataURL(file) {
        return new Promise(function (res) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = function () { res(null); }; r.readAsDataURL(file); });
    }

    // ---------- Respostas ----------
    function R(status, body) { return { status: status, body: body }; }
    function ok(body) { return R(200, body); }
    function criado(id, msg) { return R(201, { message: msg || 'Registro salvo com sucesso!', id: id }); }
    function erro(msg, status) { return R(status || 400, { error: msg }); }

    // ============================ ROTEADOR DA API ============================
    async function handleApi(method, path, search, options) {
        var seg = path.split('/').filter(Boolean); // ex.: ['api','contratos','1','aditivos']
        var body = options.body;
        var isForm = (typeof FormData !== 'undefined') && (body instanceof FormData);
        var json = {};
        if (!isForm && typeof body === 'string') { try { json = JSON.parse(body); } catch (e) { json = {}; } }

        // ---- Autenticação ----
        if (path === '/login' && method === 'POST') {
            var em = isForm ? body.get('email') : json.email;
            var se = isForm ? body.get('senha') : json.senha;
            return window.MPAuth.login(em, se) ? ok({ ok: true }) : R(401, { error: 'E-mail ou senha inválidos.' });
        }
        if (path === '/logout') { window.MPAuth.logout(); return ok({ ok: true }); }
        if (path === '/api/me') {
            return ok(_sessao ? { id: _sessao.user_id, nome: _sessao.nome, perfil: _sessao.perfil } : { id: null, nome: null, perfil: null });
        }
        if (path === '/api/change_password' && method === 'POST') {
            var u = tabela('usuarios').find(function (x) { return x.id === (_sessao && _sessao.user_id); });
            if (!u || u.senha_hash !== hashSenha(json.senha_atual || '')) return erro('Senha atual incorreta.');
            if ((json.nova_senha || '').length < 4) return erro('A nova senha deve ter ao menos 4 caracteres.');
            u.senha_hash = hashSenha(json.nova_senha); save();
            return ok({ message: 'Senha alterada com sucesso!' });
        }

        // ---- KPI: TMA ----
        if (path === '/api/kpi/tma') return ok(calcTMA());

        // ---- Dashboard e relatórios de contratos ----
        if (path === '/api/contratos/dashboard') return ok(dashboardContratos());
        if (path === '/api/relatorios/contratos') return ok(relatorioContratos());

        // ---- Ordens de Serviço ----
        if (path === '/api/ordens_servico' && method === 'GET') {
            var cid = search.get('contrato_id');
            var lista = tabela('ordens_servico').slice().sort(function (a, b) { return b.id - a.id; });
            if (cid) lista = lista.filter(function (o) { return String(o.contrato_id) === String(cid); });
            return ok(lista.map(normOS));
        }
        if (path === '/api/ordens_servico' && method === 'POST') return await criarOS(body, isForm, json);
        if (seg[0] === 'api' && seg[1] === 'ordens_servico' && seg[2]) {
            var oid = seg[2];
            if (method === 'GET') { var o = tabela('ordens_servico')[acharIdx('ordens_servico', oid)]; return o ? ok(normOS(o)) : erro('OS não encontrada', 404); }
            if (method === 'PUT') return atualizarOS(oid, json);
            if (method === 'DELETE') return removerSimples('ordens_servico', oid, 'Ordem de serviço deletada com sucesso!');
        }

        // ---- Tipos de serviço ----
        if (path === '/api/tipos_servico') {
            if (method === 'GET') return ok(tabela('tipos_servico').slice().sort(porNome));
            if (method === 'POST') { if (!json.nome) return erro('O nome do tipo de serviço é obrigatório.'); return inserir('tipos_servico', { nome: json.nome, descricao: json.descricao }, 'Tipo de serviço cadastrado com sucesso!', 'nome'); }
        }

        // ---- Usuários ----
        if (path === '/api/usuarios') {
            if (method === 'GET') return ok(tabela('usuarios').slice().sort(porNome).map(function (u) { return { id: u.id, nome: u.nome, email: u.email, perfil: u.perfil }; }));
            if (method === 'POST') {
                if (!ehAdmin()) return erro('Acesso restrito a administradores.', 403);
                if (!json.nome || !json.email) return erro('Nome e e-mail do usuário são obrigatórios.');
                if ((json.senha || '').length < 4) return erro('Informe uma senha inicial com ao menos 4 caracteres.');
                if (tabela('usuarios').some(function (u) { return u.email === json.email; })) return erro('Já existe um usuário com este e-mail.', 409);
                return inserir('usuarios', { nome: json.nome, email: json.email, perfil: json.perfil || 'Solicitante', senha_hash: hashSenha(json.senha) }, 'Usuário cadastrado com sucesso!');
            }
        }
        if (seg[0] === 'api' && seg[1] === 'usuarios' && seg[2]) {
            if (!ehAdmin()) return erro('Acesso restrito a administradores.', 403);
            var uid = seg[2];
            if (method === 'PUT') {
                var i = acharIdx('usuarios', uid); if (i < 0) return erro('Usuário não encontrado para atualização.', 404);
                var reg = db.usuarios[i];
                if (tabela('usuarios').some(function (u) { return u.email === json.email && u.id !== reg.id; })) return erro('Já existe um usuário com este e-mail.', 409);
                reg.nome = json.nome; reg.email = json.email; reg.perfil = json.perfil;
                if (json.senha) reg.senha_hash = hashSenha(json.senha);
                save(); return ok({ message: 'Usuário atualizado com sucesso!' });
            }
            if (method === 'DELETE') {
                if (String(uid) === String(_sessao && _sessao.user_id)) return erro('Você não pode excluir o próprio usuário.');
                return removerSimples('usuarios', uid, 'Usuário excluído com sucesso!');
            }
        }

        // ---- Planos de manutenção ----
        if (path === '/api/planos_manutencao') {
            if (method === 'GET') return ok(tabela('planos_manutencao').slice().sort(function (a, b) { return (a.nome_plano || '').localeCompare(b.nome_plano || ''); }));
            if (method === 'POST') {
                if (!json.nome_plano || !json.unidade || !json.tipo_servico || !json.periodicidade_valor || !json.periodicidade_unidade)
                    return erro('Campos obrigatórios faltando para o plano de manutenção.');
                var prox = calcularProximaData(new Date(), json.periodicidade_valor, json.periodicidade_unidade).toISOString();
                return inserir('planos_manutencao', {
                    nome_plano: json.nome_plano, unidade: json.unidade, tipo_servico: json.tipo_servico,
                    periodicidade_valor: json.periodicidade_valor, periodicidade_unidade: json.periodicidade_unidade,
                    descricao_tarefa: json.descricao_tarefa, data_ultima_execucao: null, data_proxima_execucao: prox, status: 'Ativo'
                }, 'Plano de manutenção cadastrado com sucesso!');
            }
        }
        if (path === '/api/manutencao_preventiva/gerar_os' && method === 'POST') return gerarOsPreventivas();

        // ---- Edificações ----
        if (path === '/api/edificacoes') {
            if (method === 'GET') return ok(tabela('edificacoes').slice().sort(porNome));
            if (method === 'POST') { if (!json.nome) return erro('O nome da edificação é obrigatório.'); if (tabela('edificacoes').some(function (e) { return e.nome === json.nome; })) return erro('Já existe uma edificação com este nome.', 409); return inserir('edificacoes', json, 'Edificação cadastrada com sucesso!'); }
        }
        if (seg[1] === 'edificacoes' && seg[2] && !seg[3]) {
            var eid = seg[2];
            if (method === 'GET') { var e = tabela('edificacoes')[acharIdx('edificacoes', eid)]; return e ? ok(e) : erro('Edificação não encontrada', 404); }
            if (method === 'PUT') return atualizarCampos('edificacoes', eid, json, 'Edificação atualizada com sucesso!');
            if (method === 'DELETE') {
                db.edificacao_anexos = tabela('edificacao_anexos').filter(function (a) { return String(a.edificacao_id) !== String(eid); });
                db.edificacao_demandas = tabela('edificacao_demandas').filter(function (a) { return String(a.edificacao_id) !== String(eid); });
                return removerSimples('edificacoes', eid, 'Edificação excluída com sucesso!');
            }
        }
        if (seg[1] === 'edificacoes' && seg[3] === 'anexos') {
            var eaid = seg[2];
            if (method === 'GET') return ok(tabela('edificacao_anexos').filter(function (a) { return String(a.edificacao_id) === String(eaid); }).sort(porIdDesc));
            if (method === 'POST') { var arq = await primeiroArquivo(body, 'arquivo'); return inserir('edificacao_anexos', { edificacao_id: Number(eaid), categoria: body.get('categoria'), descricao: body.get('descricao'), data: body.get('data'), responsavel: body.get('responsavel'), arquivo: arq, observacoes: body.get('observacoes') }, 'Anexo registrado com sucesso!'); }
        }
        if (seg[1] === 'edificacao_anexos' && seg[2] && method === 'DELETE') return removerSimples('edificacao_anexos', seg[2], 'Anexo excluído com sucesso!');
        if (seg[1] === 'edificacoes' && seg[3] === 'demandas') {
            var edid = seg[2];
            if (method === 'GET') return ok(tabela('edificacao_demandas').filter(function (a) { return String(a.edificacao_id) === String(edid); }).sort(porIdDesc));
            if (method === 'POST') { var obj = Object.assign({ edificacao_id: Number(edid) }, json); return inserir('edificacao_demandas', obj, 'Demanda registrada com sucesso!'); }
        }
        if (seg[1] === 'edificacao_demandas' && seg[2]) {
            if (method === 'DELETE') return removerSimples('edificacao_demandas', seg[2], 'Demanda excluída com sucesso!');
            if (method === 'PUT') return atualizarCampos('edificacao_demandas', seg[2], json, 'Demanda atualizada com sucesso!');
        }

        // ---- Prestadores ----
        if (path === '/api/prestadores_servico') {
            if (method === 'GET') return ok(tabela('prestadores_servico').slice().sort(function (a, b) { return (a.nome_empresa || '').localeCompare(b.nome_empresa || ''); }).map(normPrest));
            if (method === 'POST') { if (!json.nome_empresa) return erro('O nome da empresa é obrigatório.'); if (tabela('prestadores_servico').some(function (p) { return p.nome_empresa === json.nome_empresa; })) return erro('Já existe um prestador de serviço com este nome de empresa.', 409); return inserir('prestadores_servico', json, 'Prestador de serviço cadastrado com sucesso!'); }
        }
        if (seg[1] === 'prestadores_servico' && seg[2] === 'id' && seg[3]) {
            var p = tabela('prestadores_servico')[acharIdx('prestadores_servico', seg[3])];
            return p ? ok(normPrest(p)) : erro('Prestador não encontrado', 404);
        }
        if (seg[1] === 'prestadores_servico' && seg[3] === 'documentos') {
            var pid = seg[2];
            if (method === 'GET') return ok(tabela('prestador_documentos').filter(function (a) { return String(a.prestador_id) === String(pid); }).sort(porIdDesc));
            if (method === 'POST') { var arqp = await primeiroArquivo(body, 'arquivo'); return inserir('prestador_documentos', { prestador_id: Number(pid), tipo: body.get('tipo'), descricao: body.get('descricao'), data: body.get('data'), validade: body.get('validade'), arquivo: arqp, observacoes: body.get('observacoes') }, 'Documento registrado com sucesso!'); }
        }
        if (seg[1] === 'prestador_documentos' && seg[2] && method === 'DELETE') return removerSimples('prestador_documentos', seg[2], 'Documento excluído com sucesso!');
        if (seg[1] === 'prestadores_servico' && seg[2] && !seg[3] && /^\d+$/.test(seg[2])) {
            if (method === 'PUT') return atualizarPrestador(seg[2], json);
            if (method === 'DELETE') {
                db.prestador_documentos = tabela('prestador_documentos').filter(function (a) { return String(a.prestador_id) !== String(seg[2]); });
                return removerSimples('prestadores_servico', seg[2], 'Prestador de serviço excluído com sucesso!');
            }
        }
        if (seg[1] === 'prestadores_servico' && seg[2] && !seg[3] && method === 'GET') {
            // filtro por tipo de serviço (texto)
            var tipo = decodeURIComponent(seg[2]);
            return ok(tabela('prestadores_servico').map(normPrest).filter(function (p) { return (p.tipos_servico_atendidos || []).indexOf(tipo) >= 0; }));
        }

        // ---- Contratos ----
        if (path === '/api/contratos') {
            if (method === 'GET') return ok(tabela('contratos').slice().sort(porIdDesc));
            if (method === 'POST') { if (!json.numero || !json.objeto) return erro('Número e objeto do contrato são obrigatórios.'); return inserir('contratos', json, 'Contrato cadastrado com sucesso!'); }
        }
        if (seg[1] === 'contratos' && seg[2] === 'dashboard') return ok(dashboardContratos());
        if (seg[1] === 'contratos' && seg[3] === 'relatorio') return ok(dossieContrato(seg[2]));
        if (seg[1] === 'contratos' && seg[3] === 'documentos') {
            var cdid = seg[2];
            if (method === 'GET') return ok(tabela('contrato_documentos').filter(function (a) { return String(a.contrato_id) === String(cdid); }).sort(porIdDesc));
            if (method === 'POST') { var arqc = await primeiroArquivo(body, 'arquivo'); return inserir('contrato_documentos', { contrato_id: Number(cdid), tipo: body.get('tipo'), descricao: body.get('descricao'), data: body.get('data'), arquivo: arqc, observacoes: body.get('observacoes') }, 'Documento registrado com sucesso!'); }
        }
        if (seg[1] === 'contrato_documentos' && seg[2] && method === 'DELETE') return removerSimples('contrato_documentos', seg[2], 'Documento excluído com sucesso!');
        if (seg[1] === 'contrato_item' && seg[2] && seg[3] && method === 'DELETE') {
            var tb = SUB[seg[2]]; if (!tb) return erro('Entidade inválida', 404);
            return removerSimples(tb, seg[3], 'Registro excluído com sucesso!');
        }
        if (seg[1] === 'contratos' && seg[2] && seg[3] && SUB[seg[3]]) {
            var tbl = SUB[seg[3]]; var ccid = seg[2];
            if (method === 'GET') return ok(tabela(tbl).filter(function (a) { return String(a.contrato_id) === String(ccid); }).sort(porIdDesc));
            if (method === 'POST') { var obj2 = Object.assign({ contrato_id: Number(ccid) }, json); return inserir(tbl, obj2, 'Registro salvo com sucesso!'); }
        }
        if (seg[1] === 'contratos' && seg[2] && !seg[3] && /^\d+$/.test(seg[2])) {
            var ctid = seg[2];
            if (method === 'GET') { var c = tabela('contratos')[acharIdx('contratos', ctid)]; return c ? ok(c) : erro('Contrato não encontrado', 404); }
            if (method === 'PUT') return atualizarCampos('contratos', ctid, json, 'Contrato atualizado com sucesso!');
            if (method === 'DELETE') {
                tabela('ordens_servico').forEach(function (o) { if (String(o.contrato_id) === String(ctid)) o.contrato_id = null; });
                Object.keys(SUB).forEach(function (k) { db[SUB[k]] = tabela(SUB[k]).filter(function (a) { return String(a.contrato_id) !== String(ctid); }); });
                db.contrato_documentos = tabela('contrato_documentos').filter(function (a) { return String(a.contrato_id) !== String(ctid); });
                return removerSimples('contratos', ctid, 'Contrato excluído com sucesso!');
            }
        }

        return erro('Rota não encontrada: ' + method + ' ' + path, 404);
    }

    // ---------- Funções auxiliares de rota ----------
    function porNome(a, b) { return (a.nome || '').localeCompare(b.nome || ''); }
    function porIdDesc(a, b) { return b.id - a.id; }
    function ehAdmin() { return _sessao && _sessao.perfil === 'Administrador'; }
    function inserir(t, obj, msg, unique) {
        obj = Object.assign({}, obj); obj.id = nextId(t);
        if (t === 'ordens_servico' && !obj.data_solicitacao) obj.data_solicitacao = nowStr();
        tabela(t).push(obj); save();
        return criado(obj.id, msg);
    }
    function atualizarCampos(t, id, campos, msg) {
        var i = acharIdx(t, id); if (i < 0) return erro('Registro não encontrado.', 404);
        Object.keys(campos).forEach(function (k) { db[t][i][k] = campos[k]; }); save();
        return ok({ message: msg });
    }
    function removerSimples(t, id, msg) {
        var i = acharIdx(t, id); if (i < 0) return erro('Registro não encontrado.', 404);
        db[t].splice(i, 1); save(); return ok({ message: msg });
    }
    async function primeiroArquivo(form, campo) {
        if (!(form instanceof FormData)) return null;
        var f = form.get(campo);
        if (f && typeof f !== 'string' && f.name) return await fileToDataURL(f);
        return null;
    }
    function normOS(o) { var x = Object.assign({}, o); x.anexos = Array.isArray(o.anexos) ? o.anexos : (o.anexos ? [o.anexos] : []); return x; }
    function normPrest(p) {
        var x = Object.assign({}, p);
        x.tipos_servico_atendidos = Array.isArray(p.tipos_servico_atendidos) ? p.tipos_servico_atendidos : (p.tipos_servico_atendidos ? String(p.tipos_servico_atendidos).split(',') : []);
        return x;
    }
    async function criarOS(body, isForm, json) {
        var get = isForm ? function (k) { return body.get(k); } : function (k) { return json[k]; };
        if (!get('unidade') || !get('tipo_servico') || !get('descricao') || !get('prioridade'))
            return erro('Campos obrigatórios faltando (unidade, tipo_servico, descricao, prioridade)');
        var anexos = [];
        if (isForm) { var files = body.getAll('anexos'); for (var i = 0; i < files.length; i++) { var f = files[i]; if (f && typeof f !== 'string' && f.name) { var du = await fileToDataURL(f); if (du) anexos.push(du); } } }
        var reg = {
            unidade: get('unidade'), tipo_servico: get('tipo_servico'), descricao: get('descricao'),
            prioridade: get('prioridade'), responsavel: get('responsavel') || 'Não Informado',
            status: get('status') || 'Aberta', data_solicitacao: nowStr(), data_conclusao: null,
            prestador_servico: get('prestador_servico') || null, contrato_id: get('contrato_id') || null, anexos: anexos
        };
        return inserir('ordens_servico', reg, 'Ordem de serviço criada com sucesso!');
    }
    function atualizarOS(id, data) {
        var i = acharIdx('ordens_servico', id); if (i < 0) return erro('OS não encontrada para atualização', 404);
        var reg = db.ordens_servico[i];
        var novo = data.status, atual = reg.status;
        ['unidade', 'tipo_servico', 'descricao', 'prioridade', 'responsavel', 'prestador_servico'].forEach(function (k) { if (k in data) reg[k] = data[k]; });
        if ('contrato_id' in data) reg.contrato_id = data.contrato_id || null;
        if (novo && novo !== atual) {
            reg.status = novo;
            if (novo === 'Finalizada') reg.data_conclusao = new Date().toISOString();
            else if (atual === 'Finalizada') reg.data_conclusao = null;
        } else if ('status' in data) reg.status = data.status;
        if ('data_conclusao' in data) reg.data_conclusao = data.data_conclusao;
        if ('anexos' in data && Array.isArray(data.anexos)) reg.anexos = data.anexos;
        save(); return ok({ message: 'Ordem de serviço atualizada com sucesso!' });
    }
    function atualizarPrestador(id, data) {
        var i = acharIdx('prestadores_servico', id); if (i < 0) return erro('Prestador de serviço não encontrado para atualização.', 404);
        if (data.nome_empresa && tabela('prestadores_servico').some(function (p) { return p.nome_empresa === data.nome_empresa && p.id !== db.prestadores_servico[i].id; })) return erro('Já existe um prestador de serviço com este nome de empresa.', 409);
        Object.keys(data).forEach(function (k) { db.prestadores_servico[i][k] = data[k]; }); save();
        return ok({ message: 'Prestador de serviço atualizado com sucesso!' });
    }

    function calcTMA() {
        var fin = tabela('ordens_servico').filter(function (o) { return o.status === 'Finalizada' && o.data_conclusao; });
        var total = 0, n = 0;
        fin.forEach(function (o) {
            var ini = new Date(String(o.data_solicitacao).replace(' ', 'T'));
            var fim = new Date(String(o.data_conclusao).replace(' ', 'T'));
            var dur = (fim - ini) / 1000;
            if (dur >= 0) { total += dur; n++; }
        });
        if (!n) return { tma: 'N/A', raw_seconds: 0 };
        var s = Math.floor(total / n);
        var dias = Math.floor(s / 86400); s %= 86400;
        var h = Math.floor(s / 3600); s %= 3600;
        var m = Math.floor(s / 60); var seg = s % 60;
        var p = [];
        if (dias) p.push(dias + 'd'); if (h) p.push(h + 'h'); if (m) p.push(m + 'm');
        if (!p.length && !seg) p.push('0s'); else if (seg) p.push(seg + 's');
        return { tma: p.join(' '), raw_seconds: total / n };
    }

    function dashboardContratos() {
        var contratos = tabela('contratos'); var hoje = new Date(new Date().toISOString().slice(0, 10));
        var valor_contratado = 0, total_ad = 0, valor_atualizado = 0, empenhado = 0, liquidado = 0, pago = 0, total_medido = 0;
        var por_situacao = {}, contratos_a_vencer = 0, contratos_vencidos = 0;
        contratos.forEach(function (c) {
            var r = resumoContrato(c);
            valor_contratado += r.valor; total_ad += (r.acr - r.sup); valor_atualizado += r.valor_atualizado;
            empenhado += r.empenhado; liquidado += r.liquidado; pago += r.pago; total_medido += r.medido;
            var s = c.situacao || 'Sem situação'; por_situacao[s] = (por_situacao[s] || 0) + 1;
            if (['Encerrado', 'Rescindido'].indexOf(c.situacao) < 0) {
                var dr = diasRestantes(vigenciaAtual(c));
                if (dr !== null) { if (dr < 0) contratos_vencidos++; else if (dr <= 60) contratos_a_vencer++; }
            }
        });
        var gv = 0, gvenc = 0;
        tabela('contrato_garantias').forEach(function (g) {
            if (!g.data_validade) return; var dr = diasRestantes(soData(g.data_validade));
            if (dr < 0) gvenc++; else if (dr <= 60) gv++;
        });
        var riscos_altos = tabela('contrato_riscos').filter(function (r) { return ['Alto', 'Alta', 'Muito alto', 'Crítico'].indexOf(r.nivel || r.impacto) >= 0; }).length;
        return {
            total_contratos: contratos.length, por_situacao: por_situacao, valor_contratado: valor_contratado,
            total_aditivos: total_ad, valor_atualizado: valor_atualizado, empenhado: empenhado, liquidado: liquidado,
            pago: pago, total_medido: total_medido, contratos_a_vencer: contratos_a_vencer, contratos_vencidos: contratos_vencidos,
            garantias_a_vencer: gv, garantias_vencidas: gvenc, penalidades: tabela('contrato_penalidades').length, riscos_altos: riscos_altos
        };
    }

    function relatorioContratos() {
        var osCount = {};
        tabela('ordens_servico').forEach(function (o) { if (o.contrato_id) osCount[o.contrato_id] = (osCount[o.contrato_id] || 0) + 1; });
        var out = tabela('contratos').map(function (c) {
            var r = resumoContrato(c); var vig = vigenciaAtual(c);
            return {
                id: c.id, numero: c.numero, objeto: c.objeto, contratada: c.contratada, situacao: c.situacao, modalidade: c.modalidade,
                valor: r.valor, total_acrescido: r.acr, total_suprimido: r.sup, valor_atualizado: r.valor_atualizado,
                perc_aditivo: r.perc, vigencia_atual: vig, dias_restantes: diasRestantes(vig),
                empenhado: r.empenhado, liquidado: r.liquidado, pago: r.pago, medido: r.medido, qtd_os: osCount[c.id] || 0
            };
        });
        out.sort(function (a, b) {
            var av = a.dias_restantes === null, bv = b.dias_restantes === null;
            if (av !== bv) return av ? 1 : -1;
            return (a.dias_restantes || 0) - (b.dias_restantes || 0);
        });
        return out;
    }

    function dossieContrato(id) {
        var c = tabela('contratos')[acharIdx('contratos', id)];
        if (!c) return { error: 'Contrato não encontrado' };
        var dossie = { contrato: c };
        Object.keys(SUB).forEach(function (k) { dossie[k] = tabela(SUB[k]).filter(function (a) { return String(a.contrato_id) === String(id); }); });
        dossie.documentos = tabela('contrato_documentos').filter(function (a) { return String(a.contrato_id) === String(id); });
        dossie.ordens_servico = tabela('ordens_servico').filter(function (a) { return String(a.contrato_id) === String(id); }).sort(porIdDesc);
        return dossie;
    }

    function gerarOsPreventivas() {
        var geradas = [], agora = new Date();
        tabela('planos_manutencao').filter(function (p) { return p.status === 'Ativo'; }).forEach(function (plano) {
            var prox = plano.data_proxima_execucao ? new Date(plano.data_proxima_execucao) : null;
            if (!prox || prox <= agora) {
                var base = plano.data_ultima_execucao ? new Date(plano.data_ultima_execucao) : agora;
                var nova = calcularProximaData(base, plano.periodicidade_valor, plano.periodicidade_unidade);
                while (nova <= agora) nova = calcularProximaData(nova, plano.periodicidade_valor, plano.periodicidade_unidade);
                var reg = {
                    unidade: plano.unidade, tipo_servico: plano.tipo_servico,
                    descricao: 'Manutenção Preventiva - ' + plano.nome_plano + ' - ' + (plano.descricao_tarefa || 'Verificar e manter.'),
                    prioridade: 'Média', responsavel: 'Sistema de Manutenção Preventiva', status: 'Aberta',
                    data_solicitacao: nowStr(), data_conclusao: null, prestador_servico: null, contrato_id: null, anexos: []
                };
                reg.id = nextId('ordens_servico'); tabela('ordens_servico').push(reg);
                plano.data_ultima_execucao = agora.toISOString(); plano.data_proxima_execucao = nova.toISOString();
                geradas.push({ plano_id: plano.id, os_gerada_id: reg.id, nome_plano: plano.nome_plano });
            }
        });
        save();
        return ok({ message: 'Processo de geração de OS preventivas concluído.', os_geradas: geradas, erros: [] });
    }

    // ============================ INTERCEPTAÇÃO DO FETCH ============================
    var _origFetch = window.fetch ? window.fetch.bind(window) : null;
    window.fetch = async function (input, options) {
        options = options || {};
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (!/^\/(api|login|logout)(\/|$|\?)/.test(url)) { return _origFetch ? _origFetch(input, options) : Promise.reject(new Error('offline')); }
        var u;
        try { u = new URL(url, location.origin); } catch (e) { u = { pathname: url.split('?')[0], searchParams: new URLSearchParams((url.split('?')[1] || '')) }; }
        var method = (options.method || 'GET').toUpperCase();
        var res;
        try { res = await handleApi(method, u.pathname, u.searchParams, options); }
        catch (e) { console.error('Erro no backend local:', e); res = R(500, { error: String(e && e.message || e) }); }
        return {
            ok: res.status >= 200 && res.status < 300, status: res.status,
            json: async function () { return res.body; },
            text: async function () { return (typeof res.body === 'string') ? res.body : JSON.stringify(res.body); }
        };
    };

    // ============================ DADOS DE EXEMPLO (SEED) ============================
    function seed() {
        var D = {};
        Object.keys(SUB).forEach(function (k) { D[SUB[k]] = []; });
        ['ordens_servico', 'edificacoes', 'tipos_servico', 'usuarios', 'planos_manutencao', 'prestadores_servico', 'contratos', 'contrato_documentos', 'edificacao_anexos', 'edificacao_demandas', 'prestador_documentos'].forEach(function (k) { D[k] = []; });
        var id = {}; function nid(t) { id[t] = (id[t] || 0) + 1; return id[t]; }
        function ins(t, o) { o.id = nid(t); D[t].push(o); return o.id; }

        // Usuários (login)
        [['André Baeta', 'andre.baeta@orgao.gov', 'Administrador', 'admin123'],
        ['Maria Souza', 'maria.souza@orgao.gov', 'Gestor', 'senha123'],
        ['Carlos Andrade', 'carlos.andrade@orgao.gov', 'Executor', 'senha123'],
        ['Fernanda Lima', 'fernanda.lima@orgao.gov', 'Solicitante', 'senha123']]
            .forEach(function (u) { ins('usuarios', { nome: u[0], email: u[1], perfil: u[2], senha_hash: hashSenha(u[3]) }); });

        // Tipos de serviço
        ['Elétrica', 'Hidráulica', 'Civil/Alvenaria', 'Pintura', 'Climatização (HVAC)', 'Elevadores', 'Combate a Incêndio', 'Limpeza Técnica', 'Jardinagem', 'Marcenaria']
            .forEach(function (n) { ins('tipos_servico', { nome: n, descricao: '' }); });

        // Edificações
        [['Sede Administrativa', 'Administrativa', 'Centro', 'Brasília', 'DF', 3200, 5, 'Em uso', 'João Pereira'],
        ['Anexo I - Secretaria de Obras', 'Administrativa', 'Centro', 'Brasília', 'DF', 1500, 3, 'Em uso', 'Maria Lima'],
        ['Anexo II - Almoxarifado Central', 'Almoxarifado/Depósito', 'Setor Industrial', 'Brasília', 'DF', 2200, 1, 'Em uso', 'Carlos Souza'],
        ['Centro de Saúde Municipal', 'Saúde', 'Vila Nova', 'Brasília', 'DF', 1800, 2, 'Em uso', 'Ana Costa'],
        ['Escola Municipal Dom Pedro II', 'Escolar', 'Jardim', 'Brasília', 'DF', 2600, 2, 'Em reforma', 'Paulo Reis'],
        ['Garagem e Pátio de Veículos', 'Garagem/Pátio', 'Zona Rural', 'Brasília', 'DF', 5000, 1, 'Em uso', 'Roberto Dias']]
            .forEach(function (e) { ins('edificacoes', { nome: e[0], tipo_edificacao: e[1], bairro: e[2], cidade: e[3], uf: e[4], area_construida: e[5], num_pavimentos: e[6], situacao: e[7], responsavel_local: e[8] }); });

        // Prestadores
        [['Construrepara Engenharia Ltda', 'Marcos Vinícius', '(61) 99999-0003', 'obras@construrepara.com', ['Civil/Alvenaria', 'Pintura', 'Marcenaria'], '12.345.678/0001-90', 'EPP'],
        ['ElétricaTotal Manutenção Ltda', 'Roberto Nunes', '(61) 99999-0001', 'contato@eletricatotal.com', ['Elétrica', 'Climatização (HVAC)'], '23.456.789/0001-01', 'ME'],
        ['HidroMax Serviços Prediais', 'Sandra Mota', '(61) 99999-0002', 'sac@hidromax.com', ['Hidráulica', 'Combate a Incêndio'], '34.567.890/0001-12', 'ME'],
        ['ClimaFrio Manutenção Ltda', 'Júlia Ferraz', '(61) 99999-0004', 'clima@climafrio.com', ['Climatização (HVAC)'], '45.678.901/0001-23', 'EPP'],
        ['Eleva Elevadores S.A.', 'Pedro Tavares', '(61) 99999-0005', 'eleva@eleva.com', ['Elevadores'], '56.789.012/0001-34', 'Demais'],
        ['LimpaVerde Facilities', 'Cláudia Reis', '(61) 99999-0006', 'contato@limpaverde.com', ['Limpeza Técnica', 'Jardinagem'], '67.890.123/0001-45', 'ME']]
            .forEach(function (p) { ins('prestadores_servico', { nome_empresa: p[0], contato: p[1], telefone: p[2], email: p[3], tipos_servico_atendidos: p[4], cnpj: p[5], porte: p[6], cidade: 'Brasília', uf: 'DF', situacao: 'Ativo' }); });

        // Contratos
        var c1 = ins('contratos', { numero: '001/2026', processo: '23456.000111/2026-10', modalidade: 'Pregão Eletrônico', objeto: 'Serviços continuados de manutenção predial preventiva e corretiva da Sede e Anexos', contratada: 'Construrepara Engenharia Ltda', cnpj: '12.345.678/0001-90', prestador_id: 1, valor: 1200000, data_inicio: d(-156), data_termino: d(194), fonte_recursos: 'Recursos Próprios', gestor: 'Maria Souza', fiscal: 'Carlos Andrade', situacao: 'Em execução', observacoes: 'Contrato principal.' });
        var c2 = ins('contratos', { numero: '002/2026', modalidade: 'Pregão Eletrônico', objeto: 'Manutenção dos sistemas de climatização (HVAC)', contratada: 'ClimaFrio Manutenção Ltda', cnpj: '45.678.901/0001-23', prestador_id: 4, valor: 480000, data_inicio: d(-140), data_termino: d(41), fonte_recursos: 'Recursos Próprios', gestor: 'André Baeta', fiscal: 'Carlos Andrade', situacao: 'Em execução' });
        var c3 = ins('contratos', { numero: '003/2025', modalidade: 'Pregão Eletrônico', objeto: 'Conservação e manutenção de elevadores', contratada: 'Eleva Elevadores S.A.', cnpj: '56.789.012/0001-34', prestador_id: 5, valor: 360000, data_inicio: d(-320), data_termino: d(51), fonte_recursos: 'Convênio', gestor: 'Maria Souza', fiscal: 'Fernanda Lima', situacao: 'Em execução' });
        ins('contratos', { numero: '004/2024', modalidade: 'Dispensa de Licitação', objeto: 'Reforma das instalações elétricas do Anexo I', contratada: 'ElétricaTotal Manutenção Ltda', cnpj: '23.456.789/0001-01', prestador_id: 2, valor: 250000, data_inicio: d(-600), data_termino: d(-180), fonte_recursos: 'Recursos Próprios', gestor: 'André Baeta', fiscal: 'Carlos Andrade', situacao: 'Encerrado' });

        // Sub-entidades do contrato 1
        ins('contrato_aditivos', { contrato_id: c1, numero: '1º TA', tipo: 'Acréscimo', data_assinatura: d(-40), valor_acrescido: 180000, valor_suprimido: 0, nova_vigencia_fim: null, fundamentacao: 'art. 125, Lei 14.133/2021', justificativa: 'Acréscimo de serviços de pintura.' });
        ins('contrato_aditivos', { contrato_id: c1, numero: '2º TA', tipo: 'Supressão', data_assinatura: d(-15), valor_acrescido: 0, valor_suprimido: 30000, nova_vigencia_fim: null, fundamentacao: 'art. 125, Lei 14.133/2021', justificativa: 'Supressão de itens.' });
        ins('contrato_empenhos', { contrato_id: c1, numero: '2026NE000101', exercicio: '2026', natureza_despesa: '3.3.90.39 - Serviços PJ', fonte_recursos: 'Recursos Próprios', data: d(-150), valor_empenhado: 700000, valor_liquidado: 420000, valor_pago: 380000, observacoes: '' });
        ins('contrato_empenhos', { contrato_id: c2, numero: '2026NE000210', exercicio: '2026', data: d(-130), valor_empenhado: 480000, valor_liquidado: 300000, valor_pago: 280000, observacoes: '' });
        ins('contrato_medicoes', { contrato_id: c1, numero: '1', periodo_inicio: d(-150), periodo_fim: d(-120), data: d(-118), percentual_fisico: 12, valor: 145000, fiscal: 'Carlos Andrade', observacoes: '' });
        ins('contrato_medicoes', { contrato_id: c1, numero: '2', periodo_inicio: d(-119), periodo_fim: d(-89), data: d(-87), percentual_fisico: 22, valor: 268000, fiscal: 'Carlos Andrade', observacoes: '' });
        ins('contrato_garantias', { contrato_id: c1, tipo: 'Seguro-garantia', numero_apolice: 'AP-2026-0001', instituicao: 'Seguradora Aliança', valor: 60000, percentual: 5, data_inicio: d(-156), data_validade: d(209), situacao: 'Vigente', observacoes: '' });
        ins('contrato_garantias', { contrato_id: c3, tipo: 'Caução em dinheiro', numero_apolice: 'GUIA-553', valor: 18000, percentual: 5, data_inicio: d(-320), data_validade: d(-15), situacao: 'Vencida', observacoes: 'Renovar.' });
        ins('contrato_cronograma', { contrato_id: c1, etapa: 'Etapa 1', descricao: 'Mobilização', periodo_previsto: 'Jan-Mar/2026', percentual_previsto: 30, valor_previsto: 360000, percentual_realizado: 30, valor_realizado: 360000, observacoes: 'Concluída.' });
        ins('contrato_riscos', { contrato_id: c1, descricao: 'Atraso na entrega de materiais', categoria: 'Prazo/Cronograma', probabilidade: 'Alta', impacto: 'Alto', nivel: 'Alto', resposta: 'Antecipar compras.', responsavel: 'Carlos Andrade', status: 'Em monitoramento' });
        ins('contrato_penalidades', { contrato_id: c2, tipo: 'Advertência', data: d(-60), processo: 'PA-2026/077', valor_multa: 0, fundamentacao: 'art. 156, I', situacao: 'Aplicada', observacoes: '' });
        ins('contrato_fiscais', { contrato_id: c1, tipo: 'Gestor do contrato', nome: 'Maria Souza', matricula: '1045', portaria: 'Portaria 012/2026', telefone: '(61) 3333-1000', email: 'maria.souza@orgao.gov', observacoes: '' });
        ins('contrato_fiscais', { contrato_id: c1, tipo: 'Fiscal Técnico', nome: 'Carlos Andrade', matricula: '1188', portaria: 'Portaria 014/2026', telefone: '', email: 'carlos.andrade@orgao.gov', observacoes: '' });

        // Ordens de serviço
        [['Sede Administrativa', 'Elétrica', 'ElétricaTotal Manutenção Ltda', 'Disjuntor do 3º andar desarmando', 'Alta', 'Finalizada', -45, 3, c1],
        ['Sede Administrativa', 'Hidráulica', 'HidroMax Serviços Prediais', 'Vazamento no banheiro do térreo', 'Média', 'Finalizada', -40, 2, c1],
        ['Anexo I - Secretaria de Obras', 'Pintura', 'Construrepara Engenharia Ltda', 'Repintura da fachada', 'Baixa', 'Em Andamento', -20, null, c1],
        ['Centro de Saúde Municipal', 'Climatização (HVAC)', 'ClimaFrio Manutenção Ltda', 'Ar-condicionado da recepção sem refrigerar', 'Alta', 'Finalizada', -30, 1, c2],
        ['Sede Administrativa', 'Elevadores', 'Eleva Elevadores S.A.', 'Elevador parando fora de nível', 'Crítica', 'Em Andamento', -5, null, c3],
        ['Escola Municipal Dom Pedro II', 'Hidráulica', 'HidroMax Serviços Prediais', 'Entupimento na rede de esgoto', 'Alta', 'Finalizada', -25, 4, null],
        ['Garagem e Pátio de Veículos', 'Elétrica', 'ElétricaTotal Manutenção Ltda', 'Troca de luminárias do pátio', 'Média', 'Finalizada', -18, 2, null],
        ['Sede Administrativa', 'Combate a Incêndio', 'HidroMax Serviços Prediais', 'Recarga de extintores vencidos', 'Média', 'Finalizada', -60, 5, null],
        ['Anexo II - Almoxarifado Central', 'Civil/Alvenaria', 'Construrepara Engenharia Ltda', 'Infiltração no teto do depósito', 'Alta', 'Aberta', -2, null, c1],
        ['Sede Administrativa', 'Jardinagem', 'LimpaVerde Facilities', 'Poda de árvores da área externa', 'Baixa', 'Aberta', -4, null, null]]
            .forEach(function (o) {
                var reg = { unidade: o[0], tipo_servico: o[1], prestador_servico: o[2], descricao: o[3], prioridade: o[4], status: o[5], responsavel: 'Fernanda Lima', contrato_id: o[8], anexos: [] };
                var ds = new Date(); ds.setDate(ds.getDate() + o[6]); reg.data_solicitacao = ds.toISOString().slice(0, 19).replace('T', ' ');
                if (o[5] === 'Finalizada' && o[7] != null) { var dc = new Date(ds); dc.setDate(dc.getDate() + o[7]); reg.data_conclusao = dc.toISOString().slice(0, 19).replace('T', ' '); } else reg.data_conclusao = null;
                ins('ordens_servico', reg);
            });

        // Planos preventivos
        ins('planos_manutencao', { nome_plano: 'Limpeza de caixas d\'água', unidade: 'Sede Administrativa', tipo_servico: 'Limpeza Técnica', periodicidade_valor: 6, periodicidade_unidade: 'meses', descricao_tarefa: 'Limpeza dos reservatórios.', data_ultima_execucao: d(-170), data_proxima_execucao: d(10), status: 'Ativo' });
        ins('planos_manutencao', { nome_plano: 'Manutenção mensal de elevadores', unidade: 'Sede Administrativa', tipo_servico: 'Elevadores', periodicidade_valor: 1, periodicidade_unidade: 'meses', descricao_tarefa: 'Inspeção e lubrificação.', data_ultima_execucao: d(-25), data_proxima_execucao: d(5), status: 'Ativo' });

        // Demandas de edificação
        ins('edificacao_demandas', { edificacao_id: 5, descricao: 'Recuperação do telhado do bloco B', tipo_servico: 'Civil/Alvenaria', prioridade: 'Alta', status: 'Aberta', data_registro: d(-10), responsavel: 'Paulo Reis', observacoes: 'Infiltração.' });
        ins('edificacao_demandas', { edificacao_id: 1, descricao: 'Modernização do quadro elétrico do 3º andar', tipo_servico: 'Elétrica', prioridade: 'Alta', status: 'Em análise', data_registro: d(-5), responsavel: 'João Pereira', observacoes: '' });

        return D;
    }

    // Inicializa o banco
    load();
    window.MP_DB = { reset: function () { localStorage.removeItem(STORE_KEY); location.reload(); }, dump: function () { return db; } };
})();
