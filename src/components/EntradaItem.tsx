import React from 'react';
import { EntradaLOD } from '../types';

interface EntradaItemProps {
  entrada: EntradaLOD;
  selecionada: boolean;
  onClick: () => void;
}

export function EntradaItem({ entrada, selecionada, onClick }: EntradaItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-3 cursor-pointer border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
        selecionada ? 'bg-blue-50 dark:bg-blue-900' : ''
      }`}
    >
      <div className="font-medium text-gray-900 dark:text-gray-100">ID: {entrada.id}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{entrada.texto}</div>
    </div>
  );
}