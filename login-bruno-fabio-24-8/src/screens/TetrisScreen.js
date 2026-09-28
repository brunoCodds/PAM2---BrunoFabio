import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { PECAS, CORES, TIPOS_PECAS, rotacionarMatriz } from '../data/pecas';
import { recordes } from '../data/recordes';

const COLUNAS = 10;
const LINHAS = 18;
const { width: LARGURA_TELA } = Dimensions.get('window');
const TAMANHO_CELULA = Math.max(14, Math.min(20, Math.floor((LARGURA_TELA - 64) / COLUNAS)));
const PONTOS_POR_LINHAS = { 1: 100, 2: 300, 3: 500, 4: 800 };

// ---------- Funções puras do jogo (não dependem de estado do React) ----------

function criarTabuleiroVazio() {
  return Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(null));
}

function pecaAleatoria() {
  const tipo = TIPOS_PECAS[Math.floor(Math.random() * TIPOS_PECAS.length)];
  return {
    tipo,
    matriz: PECAS[tipo],
    cor: CORES[tipo],
    linha: 0,
    coluna: Math.floor((COLUNAS - 4) / 2),
  };
}

function pecaColide(tabuleiro, peca, deltaLinha = 0, deltaColuna = 0, matriz = peca.matriz) {
  for (let l = 0; l < matriz.length; l++) {
    for (let c = 0; c < matriz[l].length; c++) {
      if (!matriz[l][c]) continue;

      const linhaTabuleiro = peca.linha + l + deltaLinha;
      const colunaTabuleiro = peca.coluna + c + deltaColuna;

      if (colunaTabuleiro < 0 || colunaTabuleiro >= COLUNAS || linhaTabuleiro >= LINHAS) {
        return true;
      }
      if (linhaTabuleiro >= 0 && tabuleiro[linhaTabuleiro][colunaTabuleiro]) {
        return true;
      }
    }
  }
  return false;
}

function fundirPeca(tabuleiro, peca) {
  const novo = tabuleiro.map((linha) => [...linha]);

  peca.matriz.forEach((linha, l) => {
    linha.forEach((valor, c) => {
      if (valor) {
        const linhaTabuleiro = peca.linha + l;
        const colunaTabuleiro = peca.coluna + c;
        if (linhaTabuleiro >= 0) {
          novo[linhaTabuleiro][colunaTabuleiro] = peca.cor;
        }
      }
    });
  });

  return novo;
}

function limparLinhasCompletas(tabuleiro) {
  const restantes = tabuleiro.filter((linha) => linha.some((celula) => !celula));
  const linhasRemovidas = LINHAS - restantes.length;
  const novasLinhas = Array.from({ length: linhasRemovidas }, () => Array(COLUNAS).fill(null));
  return { tabuleiro: [...novasLinhas, ...restantes], linhasRemovidas };
}

// Junta a peça atual ao tabuleiro, limpa linhas completas, soma pontos
// e prepara a próxima peça. Se a nova peça já nascer colidindo, é fim de jogo.
function travarPeca(prev) {
  const tabuleiroComPeca = fundirPeca(prev.tabuleiro, prev.peca);
  const { tabuleiro: tabuleiroLimpo, linhasRemovidas } = limparLinhasCompletas(tabuleiroComPeca);

  const pontosGanhos = (PONTOS_POR_LINHAS[linhasRemovidas] || 0) * prev.nivel;
  const novaPontuacao = prev.pontuacao + pontosGanhos;
  const novasLinhas = prev.linhas + linhasRemovidas;
  const novoNivel = Math.floor(novasLinhas / 10) + 1;

  const novaPeca = prev.proxima;
  const novaProxima = pecaAleatoria();

  if (pecaColide(tabuleiroLimpo, novaPeca)) {
    return {
      ...prev,
      tabuleiro: tabuleiroLimpo,
      pontuacao: novaPontuacao,
      linhas: novasLinhas,
      nivel: novoNivel,
      gameOver: true,
      jogoIniciado: false,
    };
  }

  return {
    ...prev,
    tabuleiro: tabuleiroLimpo,
    peca: novaPeca,
    proxima: novaProxima,
    pontuacao: novaPontuacao,
    linhas: novasLinhas,
    nivel: novoNivel,
  };
}

function aplicarMovimento(prev, deltaLinha, deltaColuna) {
  if (!prev.jogoIniciado || prev.pausado || prev.gameOver || !prev.peca) return prev;
  if (pecaColide(prev.tabuleiro, prev.peca, deltaLinha, deltaColuna)) return prev;

  return {
    ...prev,
    peca: { ...prev.peca, linha: prev.peca.linha + deltaLinha, coluna: prev.peca.coluna + deltaColuna },
  };
}

function obterTabuleiroExibicao(estado) {
  const grade = estado.tabuleiro.map((linha) => [...linha]);

  if (estado.peca) {
    estado.peca.matriz.forEach((linha, l) => {
      linha.forEach((valor, c) => {
        if (!valor) return;
        const linhaTabuleiro = estado.peca.linha + l;
        const colunaTabuleiro = estado.peca.coluna + c;
        if (
          linhaTabuleiro >= 0 &&
          linhaTabuleiro < LINHAS &&
          colunaTabuleiro >= 0 &&
          colunaTabuleiro < COLUNAS
        ) {
          grade[linhaTabuleiro][colunaTabuleiro] = estado.peca.cor;
        }
      });
    });
  }

  return grade;
}

function estadoInicial() {
  return {
    tabuleiro: criarTabuleiroVazio(),
    peca: null,
    proxima: null,
    pontuacao: 0,
    linhas: 0,
    nivel: 1,
    jogoIniciado: false,
    pausado: false,
    gameOver: false,
  };
}

// ---------- Componente ----------

export default function TetrisScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [estado, setEstado] = useState(estadoInicial);
  const [listaRecordes, setListaRecordes] = useState(recordes);
  const recordeSalvoRef = useRef(false);

  function iniciarJogo() {
    recordeSalvoRef.current = false;
    setEstado({
      tabuleiro: criarTabuleiroVazio(),
      peca: pecaAleatoria(),
      proxima: pecaAleatoria(),
      pontuacao: 0,
      linhas: 0,
      nivel: 1,
      jogoIniciado: true,
      pausado: false,
      gameOver: false,
    });
  }

  function moverEsquerda() {
    setEstado((prev) => aplicarMovimento(prev, 0, -1));
  }

  function moverDireita() {
    setEstado((prev) => aplicarMovimento(prev, 0, 1));
  }

  function moverParaBaixo() {
    setEstado((prev) => {
      if (!prev.jogoIniciado || prev.pausado || prev.gameOver || !prev.peca) return prev;
      if (!pecaColide(prev.tabuleiro, prev.peca, 1, 0)) {
        return { ...prev, peca: { ...prev.peca, linha: prev.peca.linha + 1 } };
      }
      return travarPeca(prev);
    });
  }

  function quedaRapida() {
    setEstado((prev) => {
      if (!prev.jogoIniciado || prev.pausado || prev.gameOver || !prev.peca) return prev;
      let deslocamento = 0;
      while (!pecaColide(prev.tabuleiro, prev.peca, deslocamento + 1, 0)) {
        deslocamento++;
      }
      const pecaFinal = { ...prev.peca, linha: prev.peca.linha + deslocamento };
      return travarPeca({ ...prev, peca: pecaFinal, pontuacao: prev.pontuacao + deslocamento * 2 });
    });
  }

  function girarPeca() {
    setEstado((prev) => {
      if (!prev.jogoIniciado || prev.pausado || prev.gameOver || !prev.peca) return prev;
      const matrizGirada = rotacionarMatriz(prev.peca.matriz);
      const ajustes = [0, -1, 1, -2, 2]; // wall-kick simples

      for (const ajuste of ajustes) {
        if (!pecaColide(prev.tabuleiro, prev.peca, 0, ajuste, matrizGirada)) {
          return {
            ...prev,
            peca: { ...prev.peca, matriz: matrizGirada, coluna: prev.peca.coluna + ajuste },
          };
        }
      }
      return prev;
    });
  }

  function alternarPausa() {
    setEstado((prev) => (prev.jogoIniciado && !prev.gameOver ? { ...prev, pausado: !prev.pausado } : prev));
  }

  // Gravidade: a peça desce sozinha, ficando mais rápida a cada nível.
  const velocidade = Math.max(150, 800 - (estado.nivel - 1) * 60);
  useEffect(() => {
    if (!estado.jogoIniciado || estado.pausado || estado.gameOver) return undefined;
    const id = setInterval(moverParaBaixo, velocidade);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.jogoIniciado, estado.pausado, estado.gameOver, estado.nivel, estado.peca]);

  // Controles de teclado quando rodando na web (expo start --web).
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;

    function aoPressionarTecla(evento) {
      switch (evento.key) {
        case 'ArrowLeft':
          moverEsquerda();
          break;
        case 'ArrowRight':
          moverDireita();
          break;
        case 'ArrowDown':
          moverParaBaixo();
          break;
        case 'ArrowUp':
          girarPeca();
          break;
        case ' ':
          evento.preventDefault();
          quedaRapida();
          break;
        case 'p':
        case 'P':
          alternarPausa();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', aoPressionarTecla);
    return () => window.removeEventListener('keydown', aoPressionarTecla);
  }, []);

  // Salva o recorde uma única vez quando o jogo termina.
  useEffect(() => {
    if (estado.gameOver && !recordeSalvoRef.current) {
      recordeSalvoRef.current = true;
      const nomeFinal = nome.trim() || 'Jogador anônimo';
      recordes.push({
        nome: nomeFinal,
        pontuacao: estado.pontuacao,
        data: new Date().toLocaleDateString('pt-BR'),
      });
      recordes.sort((a, b) => b.pontuacao - a.pontuacao);
      recordes.splice(10);
      setListaRecordes([...recordes]);
    }
  }, [estado.gameOver, estado.pontuacao, nome]);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {!estado.jogoIniciado && !estado.gameOver && (
        <View style={styles.telaCentral}>
          <Text style={styles.titulo}>🎮 Tetris</Text>
          <Text style={styles.subtitulo}>Encaixe as peças e complete linhas para pontuar</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Seu nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Como podemos te chamar?"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />

            <TouchableOpacity style={styles.botaoPrimario} onPress={iniciarJogo}>
              <Text style={styles.botaoPrimarioTexto}>Iniciar jogo</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.link}>Voltar</Text>
            </TouchableOpacity>
          </View>

          <Ranking lista={listaRecordes} />
        </View>
      )}

      {estado.jogoIniciado && (
        <View style={styles.telaJogo}>
          <View style={styles.cabecalho}>
            <Placar label="Pontos" valor={estado.pontuacao} />
            <Placar label="Nível" valor={estado.nivel} />
            <Placar label="Linhas" valor={estado.linhas} />
            <TouchableOpacity style={styles.botaoPausa} onPress={alternarPausa}>
              <Text style={styles.botaoPausaTexto}>{estado.pausado ? '▶' : '⏸'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.areaJogo}>
            <View style={styles.tabuleiro}>
              {obterTabuleiroExibicao(estado).map((linha, i) => (
                <View key={i} style={styles.linhaTabuleiro}>
                  {linha.map((cor, j) => (
                    <View key={j} style={[styles.celula, { backgroundColor: cor || '#111827' }]} />
                  ))}
                </View>
              ))}

              {estado.pausado && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayTexto}>Pausado</Text>
                </View>
              )}
            </View>

            <ProximaPeca peca={estado.proxima} />
          </View>

          <View style={styles.controles}>
            <TouchableOpacity style={styles.botaoGirar} onPress={girarPeca}>
              <Text style={styles.botaoControleTexto}>⟳ Girar</Text>
            </TouchableOpacity>

            <View style={styles.controlesLinha}>
              <TouchableOpacity style={styles.botaoControle} onPress={moverEsquerda}>
                <Text style={styles.botaoControleTexto}>◀</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoControle} onPress={moverParaBaixo}>
                <Text style={styles.botaoControleTexto}>▼</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoControle} onPress={moverDireita}>
                <Text style={styles.botaoControleTexto}>▶</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.botaoQueda} onPress={quedaRapida}>
              <Text style={styles.botaoControleTexto}>⤓ Queda rápida</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {estado.gameOver && (
        <View style={styles.telaCentral}>
          <Text style={styles.titulo}>Fim de jogo</Text>
          <Text style={styles.subtitulo}>Você fez {estado.pontuacao} pontos</Text>

          <Ranking lista={listaRecordes} />

          <TouchableOpacity style={styles.botaoPrimario} onPress={iniciarJogo}>
            <Text style={styles.botaoPrimarioTexto}>Jogar novamente</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Voltar para o início</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function Placar({ label, valor }) {
  return (
    <View style={styles.placar}>
      <Text style={styles.placarLabel}>{label}</Text>
      <Text style={styles.placarValor}>{valor}</Text>
    </View>
  );
}

function ProximaPeca({ peca }) {
  return (
    <View style={styles.proximaCaixa}>
      <Text style={styles.placarLabel}>Próxima</Text>
      <View style={styles.proximaGrade}>
        {peca?.matriz.map((linha, i) => (
          <View key={i} style={styles.proximaLinha}>
            {linha.map((valor, j) => (
              <View
                key={j}
                style={[styles.proximaCelula, { backgroundColor: valor ? peca.cor : 'transparent' }]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function Ranking({ lista }) {
  if (!lista.length) return null;

  return (
    <View style={styles.ranking}>
      <Text style={styles.rankingTitulo}>🏆 Melhores pontuações</Text>
      {lista.slice(0, 5).map((r, i) => (
        <View key={`${r.nome}-${r.pontuacao}-${i}`} style={styles.rankingLinha}>
          <Text style={styles.rankingPosicao}>{i + 1}º</Text>
          <Text style={styles.rankingNome} numberOfLines={1}>
            {r.nome}
          </Text>
          <Text style={styles.rankingPontos}>{r.pontuacao}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 24,
  },
  telaCentral: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  botaoPrimario: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  botaoPrimarioTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#2563eb',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
  ranking: {
    width: '100%',
    marginTop: 28,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#fafafa',
  },
  rankingTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  rankingLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  rankingPosicao: {
    width: 28,
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  rankingNome: {
    flex: 1,
    fontSize: 13,
    color: '#1a1a1a',
  },
  rankingPontos: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  telaJogo: {
    width: '100%',
    alignItems: 'center',
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  placar: {
    alignItems: 'center',
  },
  placarLabel: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
  },
  placarValor: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  botaoPausa: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPausaTexto: {
    fontSize: 16,
  },
  areaJogo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  tabuleiro: {
    borderWidth: 2,
    borderColor: '#1f2937',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#111827',
  },
  linhaTabuleiro: {
    flexDirection: 'row',
  },
  celula: {
    width: TAMANHO_CELULA,
    height: TAMANHO_CELULA,
    borderWidth: 0.5,
    borderColor: '#1f2937',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  proximaCaixa: {
    alignItems: 'center',
  },
  proximaGrade: {
    marginTop: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  proximaLinha: {
    flexDirection: 'row',
  },
  proximaCelula: {
    width: 12,
    height: 12,
  },
  controles: {
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
    maxWidth: 320,
  },
  botaoGirar: {
    backgroundColor: '#7c3aed',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  controlesLinha: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  botaoControle: {
    width: 64,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoQueda: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  botaoControleTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
