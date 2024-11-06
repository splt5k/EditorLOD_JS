import React, { useState, useRef, useEffect } from 'react';
import { Upload, Save, Search } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { EntradaItem } from './components/EntradaItem';
import { Editor } from './components/Editor';
import { LanguageSelector } from './components/LanguageSelector';
import { EntradaLOD } from './types';
import { decodeWindows1252, encodeWindows1252 } from './utils/encoding';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [locale, setLocale] = useState(() => 
    navigator.language in ['en-US', 'es-ES', 'fr-FR', 'pt-BR', 'ru-RU'] 
      ? navigator.language 
      : 'en-US'
  );
  const { t } = useTranslation(locale);
  const [lastId, setLastId] = useState<number>(0);
  const [totalStrings, setTotalStrings] = useState<number>(0);
  const [entradas, setEntradas] = useState<EntradaLOD[]>([]);
  const [entradaSelecionada, setEntradaSelecionada] = useState<EntradaLOD | null>(null);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [nomeArquivo, setNomeArquivo] = useState<string>('');
  const inputArquivoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Atualiza o total de strings quando as entradas mudam
  useEffect(() => {
    setTotalStrings(entradas.length);
  }, [entradas]);

  const lerArquivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setNomeArquivo(arquivo.name);
    const buffer = await arquivo.arrayBuffer();
    const view = new DataView(buffer);
    let offset = 0;

    // Lê os IDs iniciais mas não os usa diretamente
    offset += 8; // Pula os 8 bytes iniciais (2 int32)

    const novasEntradas: EntradaLOD[] = [];
    let maiorId = 0;
    let lastidread = 0;

    while (offset < buffer.byteLength) {
      const id = view.getInt32(offset, true);
      offset += 4;
      lastidread = id;

      const tamanhoTexto = view.getInt32(offset, true);
      offset += 4;

      const textoBytes = buffer.slice(offset, offset + tamanhoTexto);
      const texto = decodeWindows1252(textoBytes);
      offset += tamanhoTexto;

      novasEntradas.push({ id, texto });
      maiorId = Math.max(maiorId, id);
    }

    const entradasOrdenadas = novasEntradas.sort((a, b) => a.id - b.id);
    setEntradas(entradasOrdenadas);
    setLastId(maiorId);
  };

  const salvarArquivo = () => {
    const tamanhoTotal = 8 + entradas.reduce((acc, entrada) => {
      const textoBytes = encodeWindows1252(entrada.texto);
      return acc + 8 + textoBytes.length;
    }, 0);

    const buffer = new ArrayBuffer(tamanhoTotal);
    const view = new DataView(buffer);
    let offset = 0;

    // Grava o último ID e o total de strings
    view.setInt32(offset, lastId, true);
    offset += 4;
    view.setInt32(offset, totalStrings, true);
    offset += 4;

    entradas.forEach(entrada => {
      view.setInt32(offset, entrada.id, true);
      offset += 4;

      const textoBytes = encodeWindows1252(entrada.texto);
      view.setInt32(offset, textoBytes.length, true);
      offset += 4;

      new Uint8Array(buffer).set(textoBytes, offset);
      offset += textoBytes.length;
    });

    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo || 'arquivo.lod';
    a.click();
    URL.revokeObjectURL(url);
  };

  const removerEntrada = (id: number) => {
    const novasEntradas = entradas.filter(e => e.id !== id);
    setEntradas(novasEntradas);
    setEntradaSelecionada(null);
    if (novasEntradas.length > 0) {
      setLastId(Math.max(...novasEntradas.map(e => e.id)));
    } else {
      setLastId(0);
    }
  };

  const atualizarTexto = (novoTexto: string) => {
    if (!entradaSelecionada) return;
    
    const novasEntradas = entradas.map(entrada => 
      entrada.id === entradaSelecionada.id 
        ? { ...entrada, texto: novoTexto }
        : entrada
    );
    setEntradas(novasEntradas);
    setEntradaSelecionada({ ...entradaSelecionada, texto: novoTexto });
  };

  const entradasFiltradas = entradas.filter(entrada => 
    entrada.id.toString().includes(termoPesquisa) ||
    entrada.texto.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('title')}</h1>
            <div className="flex gap-4 items-center">
              <LanguageSelector
                currentLocale={locale}
                onLocaleChange={setLocale}
              />
              <ThemeToggle 
                isDark={isDark} 
                onToggle={() => setIsDark(!isDark)}
              />
              <button
                onClick={() => inputArquivoRef.current?.click()}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Upload size={20} />
                {t('loadFile')}
              </button>
              <input
                ref={inputArquivoRef}
                type="file"
                accept=".lod"
                onChange={lerArquivo}
                className="hidden"
              />
              
              <button
                onClick={salvarArquivo}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                disabled={entradas.length === 0}
              >
                <Save size={20} />
                {t('saveFile')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('lastId')}
              </label>
              <input
                type="number"
                value={lastId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                         bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('totalStrings')}
              </label>
              <input
                type="number"
                value={totalStrings}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                         bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('search')}
                    value={termoPesquisa}
                    onChange={(e) => setTermoPesquisa(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-md h-[600px] overflow-y-auto">
                {entradasFiltradas.map((entrada) => (
                  <EntradaItem
                    key={entrada.id}
                    entrada={entrada}
                    selecionada={entradaSelecionada?.id === entrada.id}
                    onClick={() => setEntradaSelecionada(entrada)}
                  />
                ))}
              </div>
            </div>

            <div>
              {entradaSelecionada ? (
                <Editor
                  entrada={entradaSelecionada}
                  onRemover={removerEntrada}
                  onAtualizar={atualizarTexto}
                  locale={locale}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  {t('selectToEdit')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;