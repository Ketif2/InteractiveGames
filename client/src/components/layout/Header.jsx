// components/layout/Header.jsx
const Header = () => {
  return (
    <header className="bg-[#00398A] text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img 
              src="/src/assets/icons/brainLogo.svg" 
              alt="Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-semibold">Recuerda+</h1>
          </div>
          <button className="p-2">
            <img 
              src="/src/assets/icons/userIcon.svg" 
              alt="Usuario" 
              className="w-8 h-8"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;