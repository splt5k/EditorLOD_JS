import React from 'react';
import { Trash2 } from 'lucide-react';
import { EntradaLOD } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface EditorProps {
  entrada: EntradaLOD;
  onRemover: (id: number) => void;
  onAtualizar: (texto: string) => void;
  locale: string;
}

export function Editor({ entrada, onRemover, onAtualizar, locale }: EditorProps) {
  const { t } = useTranslation(locale);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('editing')} {entrada.id}
        </h2>
        <button
          onClick={() => onRemover(entrada.id)}
          className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          title="Remover entrada"
        >
          <Trash2 size={20} />
        </button>
      </div>
      <textarea
        value={entrada.texto}
        onChange={(e) => onAtualizar(e.target.value)}
        rows={10}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
      />
    </div>
  );
}