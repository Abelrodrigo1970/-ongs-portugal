'use client';

const GuestBar = ({ className = '' }) => {
  // Componente GuestBar - pode ser expandido no futuro para mostrar informações do usuário
  // Por enquanto, retorna um elemento vazio conforme o código original
  return (
    <div 
      className={className}
      style={{
        height: '1px',
        backgroundColor: 'transparent',
        width: '100%'
      }}
    />
  );
};

export default GuestBar;
