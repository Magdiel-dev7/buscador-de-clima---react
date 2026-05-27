import React from 'react';
import Search from './Search'; 

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Aplicação da Previsão do Tempo */}
      <Search placeholder="Ex: São Paulo" />
    </div>
  );
}