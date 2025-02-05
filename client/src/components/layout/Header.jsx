const Header = () => {
    return (
      <header className="bg-white shadow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">Recuerda+</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700">Usuario</span>
            </div>
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;