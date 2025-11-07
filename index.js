// ====== CONFIGURE AQUI ======
const BOT_ID = '7569740873408806930';            // Ex.: '7569740873408806930'
const TOKEN  = 'pat_hcAUqeVd3kk8t8CuutNzfQKZu5b2duD1YogVbLCBScRSULNiIBTXpk8ozvntOQDk';               // Ex.: 'pat_abc123...'
// ============================

const statusEl = document.getElementById('status');

function setStatus(msg, color = '#1e3a8a') {
  if (statusEl) {
    statusEl.textContent = msg;
    statusEl.style.color = color;
  }
}

// Gera e persiste um ID único por dispositivo/navegador para isolar sessões
function getOrCreateUserId() {
  try {
    const key = 'coze_user_id';
    let uid = localStorage.getItem(key);
    if (!uid) {
      uid = `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(key, uid);
      setStatus(`Novo usuário criado: ${uid}`);
    } else {
      setStatus(`Usuário existente: ${uid}`);
    }
    return uid.slice(0, 64); // garante tamanho seguro
  } catch (e) {
    // Fallback se localStorage indisponível (ex.: navegação privada bloqueando)
    const uid = `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    setStatus(`ID de sessão volátil: ${uid}`, '#b45309');
    return uid.slice(0, 64);
  }
}

function validateConfig() {
  if (!BOT_ID || BOT_ID.startsWith('SUBSTITUA_')) {
    setStatus('Configure BOT_ID corretamente (copie do URL do seu bot no Coze).', '#b91c1c');
    return false;
  }
  if (!TOKEN || TOKEN.startsWith('SUBSTITUA_')) {
    setStatus('Configure TOKEN (PAT) corretamente (gere em My Profile > Access Tokens).', '#b91c1c');
    return false;
  }
  return true;
}

function initChat() {
  if (!validateConfig()) return;

  if (typeof CozeWebSDK === 'undefined') {
    setStatus('SDK do Coze não carregou. Verifique a rede/AdBlock e recarregue.', '#b91c1c');
    return;
  }

  const userId = getOrCreateUserId();

  try {
    // Instancia o widget com balão minimizado padrão
    new CozeWebSDK.WebChatClient({
      config: {
        type: 'bot',        // padrão para agentes/bots
        bot_id: BOT_ID,     // obrigatório
        // isIframe: false   // omitido: widget flutuante minimizado (padrão)
      },
      auth: {
        type: 'token',      // PAT/OAuth; aqui usamos PAT
        token: TOKEN,
        onRefreshToken: () => TOKEN  // simples; para produção, implemente rotação
      },
      userInfo: {
        id: userId,                  // CRÍTICO: isola sessões por dispositivo
        nickname: 'Visitante'        // opcional
        // url: 'https://...'        // avatar opcional (URL pública)
      },
      ui: {
        base: {
          lang: 'pt-BR',             // idioma de tooltips do SDK
          zIndex: 999999             // garante balão acima de outros elementos
        },
        header: {
          isShow: true,              // mostra título na janela expandida
          isNeedClose: true          // botão de fechar na janela
        },
        asstBtn: {
          isNeed: true,              // MOSTRA o balão flutuante no canto (padrão)
          // position, size, offset podem existir em algumas versões do SDK
        },
        chatBot: {
          title: 'Assistente IA',    // título na janela do chat
          uploadable: false          // simplifica; habilite se precisar enviar arquivos
        }
      },
      onInit: () => {
        setStatus('Chat carregado. Clique no balão para conversar. ✅', '#166534');
      },
      onError: (err) => {
        console.error('Coze SDK error:', err);
        const msg = (typeof err === 'object' && err?.message) ? err.message : String(err);
        // Erros comuns: token inválido, bot não publicado, limite diário excedido
        setStatus(`Erro ao inicializar o chat: ${msg}`, '#b91c1c');
      }
    });
  } catch (e) {
    console.error('Falha crítica ao instanciar o WebChatClient:', e);
    setStatus(`Falha crítica: ${e?.message || e}`, '#b91c1c');
  }
}

// Garante execução após DOM pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChat);
} else {
  initChat();
}
