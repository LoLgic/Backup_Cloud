import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import api from "../services/api";

function SharePage() {

  const { token } = useParams();

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchFile = async () => {

      try {

        const response = await api.get(
          `/files/public/${token}`
        );

        setFile(response.data.file);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchFile();

  }, [token]);

  if (loading) {

    return (
      <div className="min-h-screen flex justify-center items-center">
        Cargando...
      </div>
    );

  }

  if (!file) {

    return (
      <div className="min-h-screen flex justify-center items-center">
        Archivo no encontrado
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8">

        <h1 className="text-3xl font-bold mb-6">
          Archivo compartido ☁️
        </h1>

        <img
          src={file.fileUrl}
          alt={file.fileName}
          className="rounded-xl mb-6"
        />

        <a
          href={file.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="
            bg-black
            text-white
            px-6
            py-3
            rounded-lg
            inline-block
          "
        >
          Descargar archivo
        </a>

      </div>

    </div>

  );

}

export default SharePage;