import {
  useEffect,
  useState
} from "react";

import { useDropzone } from "react-dropzone";

import api from "../services/api";

function Dashboard() {

  const [files, setFiles] = useState([]);

  const [folders, setFolders] = useState([]);

  const [folderName, setFolderName] = useState("");

  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [preview, setPreview] = useState(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

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

  const fetchFolders = async () => {

    try {

      const response = await api.get(
        "/folders"
      );

      setFolders(response.data.folders);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchFiles();

    fetchFolders();

  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {

    const html = document.documentElement;

    if (darkMode) {

      html.classList.remove("dark");

      localStorage.setItem("theme", "light");

    } else {

      html.classList.add("dark");

      localStorage.setItem("theme", "dark");

    }

    setDarkMode(!darkMode);

  };

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
  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop
  });

  // Eliminar archivo
  const handleDelete = async (id) => {

    try {

      await api.delete(`/files/${id}`);

      fetchFiles();

    } catch (error) {

      alert("Error eliminando archivo");

    }

  };


  const handleCreateFolder = async () => {

    if (!folderName.trim()) return;

    try {

      await api.post(
        "/folders",
        {
          name: folderName
        }
      );

      setFolderName("");

      fetchFolders();

    } catch (error) {

      alert("Error creando carpeta");

    }

  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold dark:text-white mb-2">
              Dashboard ☁️
            </h1>

            <p className="text-gray-500 dark:text-gray-300">
              Tus backups cloud
            </p>

          </div>

          <button
            onClick={toggleDarkMode}
            className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded-lg"
          >
            {
              darkMode
                ? "Modo Claro ☀️"
                : "Modo Oscuro 🌙"
            }
          </button>

        </div>


        {/* CREAR CARPETA */}
        <div
          className="
    bg-white
    dark:bg-gray-800
    p-6
    rounded-2xl
    shadow
    mb-8
  "
        >

          <h2 className="text-xl font-bold dark:text-white mb-4">
            Crear carpeta 📁
          </h2>

          <div className="flex gap-4">

            <input
              type="text"
              placeholder="Nombre carpeta"
              value={folderName}
              onChange={(e) =>
                setFolderName(e.target.value)
              }
              className="
        flex-1
        border
        rounded-lg
        px-4
        py-2
        dark:bg-gray-700
        dark:text-white
      "
            />

            <button
              onClick={handleCreateFolder}
              className="
        bg-black
        dark:bg-white
        dark:text-black
        text-white
        px-6
        py-2
        rounded-lg
      "
            >
              Crear
            </button>

          </div>

        </div>


        {/* DROPZONE */}
        <div
          {...getRootProps()}
          className="
            bg-white
            dark:bg-gray-800
            dark:text-white
            border-2
            border-dashed
            border-gray-300
            dark:border-gray-600
            rounded-2xl
            p-12
            text-center
            cursor-pointer
            hover:border-black
            dark:hover:border-white
            transition
            mb-8
          "
        >

          <input {...getInputProps()} />

          <p className="text-lg font-semibold">
            Arrastra archivos aquí
          </p>

          <p className="text-gray-500 dark:text-gray-300 mt-2">
            o haz click para seleccionar
          </p>

        </div>


        {/* CARPETAS */}
        <div className="mb-8">

          <h2 className="text-2xl font-bold dark:text-white mb-4">
            Carpetas 📁
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            {
              folders.map((folder) => (

                <div
                  key={folder._id}
                  className="
            bg-white
            dark:bg-gray-800
            dark:text-white
            rounded-2xl
            shadow
            p-6
          "
                >

                  <h3 className="text-lg font-bold">
                    📁 {folder.name}
                  </h3>

                </div>

              ))
            }

          </div>

        </div>

        {/* PREVIEW */}
        {
          preview && (

            <div className="mb-8">

              <h2 className="font-bold dark:text-white mb-4">
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

        {/* PROGRESS BAR */}
        {
          uploading && (

            <div className="mb-8">

              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-5">

                <div
                  className="bg-black dark:bg-white h-5 rounded-full transition-all"
                  style={{
                    width: `${progress}%`
                  }}
                />

              </div>

              <p className="mt-2 text-sm dark:text-white">
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
                className="
                  bg-white
                  dark:bg-gray-800
                  dark:text-white
                  rounded-2xl
                  shadow
                  p-6
                  flex
                  justify-between
                  items-center
                "
              >

                <div>

                  <h2 className="font-bold">
                    {file.fileName}
                  </h2>

                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
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