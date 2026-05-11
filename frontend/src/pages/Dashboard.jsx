import {
  useEffect,
  useRef,
  useState
} from "react";

import api from "../services/api";

function Dashboard() {

  const fileInputRef = useRef();

  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  // Obtener archivos
  const fetchFiles = async () => {

    try {

      const response = await api.get(
        "/files/my-files"
      );

      setFiles(response.data.files);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchFiles();

  }, []);

  // Upload
  const handleUpload = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      await api.post(
        "/files/upload",
        formData
      );

      alert("Archivo subido correctamente");

      fetchFiles();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error subiendo archivo"
      );

    } finally {

      setLoading(false);

    }

  };

  // Eliminar
  const handleDelete = async (id) => {

    try {

      await api.delete(`/files/${id}`);

      alert("Archivo eliminado");

      fetchFiles();

    } catch (error) {

      alert("Error eliminando archivo");

    }

  };

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

          <div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              hidden
            />

            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-black text-white px-5 py-3 rounded-lg"
            >
              {
                loading
                  ? "Subiendo..."
                  : "Subir Archivo"
              }
            </button>

          </div>

        </div>

        <div className="grid gap-4">

          {
            files.map((file) => (

              <div
                key={file._id}
                className="bg-white rounded-2xl shadow p-6 flex justify-between items-center"
              >

                <div>

                  <h2 className="font-bold">
                    {file.fileName}
                  </h2>

                  <a
                    href={file.fileUrl}
                    target="_blank"
                    className="text-blue-500 text-sm"
                  >
                    Ver archivo
                  </a>

                </div>

                <button
                  onClick={() => handleDelete(file._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Eliminar
                </button>

              </div>

            ))
          }

        </div>

      </div>

    </div>
  );

}

export default Dashboard;