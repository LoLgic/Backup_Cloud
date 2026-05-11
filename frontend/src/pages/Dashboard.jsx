import {
  useEffect,
  useState
} from "react";

import { useDropzone } from "react-dropzone";

import api from "../services/api";

function Dashboard() {

  const [files, setFiles] = useState([]);

  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [preview, setPreview] = useState(null);

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
  const onDrop = async (acceptedFiles) => {

    const file = acceptedFiles[0];

    if (!file) return;

    // Preview imágenes
    if (file.type.startsWith("image")) {

      setPreview(
        URL.createObjectURL(file)
      );

    } else {

      setPreview(null);

    }

    try {

      setUploading(true);

      setProgress(0);

      const formData = new FormData();

      formData.append("file", file);

      await api.post(
        "/files/upload",
        formData,
        {

          onUploadProgress: (progressEvent) => {

            const percent = Math.round(
              (progressEvent.loaded * 100)
              / progressEvent.total
            );

            setProgress(percent);

          }

        }
      );

      alert("Archivo subido correctamente");

      fetchFiles();

    } catch (error) {

      alert("Error subiendo archivo");

    } finally {

      setUploading(false);

    }

  };

  // Dropzone
  const { getRootProps, getInputProps } =
    useDropzone({
      onDrop
    });

  // Eliminar
  const handleDelete = async (id) => {

    try {

      await api.delete(`/files/${id}`);

      fetchFiles();

    } catch (error) {

      alert("Error eliminando archivo");

    }

  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        <div className="mb-8">

          <h1 className="text-4xl font-bold mb-2">
            Dashboard ☁️
          </h1>

          <p className="text-gray-500">
            Tus backups cloud
          </p>

        </div>

        {/* DROPZONE */}
        <div
          {...getRootProps()}
          className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-black transition mb-8"
        >

          <input {...getInputProps()} />

          <p className="text-lg font-semibold">
            Arrastra archivos aquí
          </p>

          <p className="text-gray-500 mt-2">
            o haz click para seleccionar
          </p>

        </div>

        {/* PREVIEW */}
        {
          preview && (

            <div className="mb-8">

              <h2 className="font-bold mb-4">
                Preview
              </h2>

              <img
                src={preview}
                alt="preview"
                className="w-64 rounded-2xl shadow"
              />

            </div>

          )
        }

        {/* PROGRESS */}
        {
          uploading && (

            <div className="mb-8">

              <div className="w-full bg-gray-300 rounded-full h-5">

                <div
                  className="bg-black h-5 rounded-full transition-all"
                  style={{
                    width: `${progress}%`
                  }}
                />

              </div>

              <p className="mt-2 text-sm">
                Subiendo... {progress}%
              </p>

            </div>

          )
        }

        {/* ARCHIVOS */}
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