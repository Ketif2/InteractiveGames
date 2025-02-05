const Sidebar = () => {
    return (
      <aside className="w-64 bg-white shadow h-screen">
        <nav className="mt-5 px-2">
          <a href="/dashboard" className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            Dashboard
          </a>
          <a href="/patients" className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            Pacientes
          </a>
          <a href="/games" className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            Juegos
          </a>
        </nav>
      </aside>
    );
  };
  
  export default Sidebar;