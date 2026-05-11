function Dashboard() {

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              Dashboard ☁️
            </h1>

            <p className="text-gray-500">
              Tus backups cloud
            </p>

          </div>

          <button className="bg-black text-white px-5 py-3 rounded-lg">
            Subir Archivo
          </button>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            No hay archivos todavía
          </p>

        </div>

      </div>

    </div>
  );

}

export default Dashboard;