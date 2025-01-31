import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-modal";

const BACKEND_URL = "https://cloud-sharing.vercel.app";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedFileId, setSelectedFileId] = useState(null);

  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files", err);
      toast.error("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      return toast.error("Please select a file!");
    }
    const formData = new FormData();
    formData.append("file", file);

    const userId = localStorage.getItem("userId");
    formData.append("userId", userId);

    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      toast.success("File Uploaded");
      fetchFiles();
    } catch (err) {
      toast.error("File upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}/file/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("File Deleted.");
      fetchFiles();
      setIsModalOpen(false); // Close the modal after successful deletion
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/";
    }
  };

  const openDeleteModal = (id) => {
    setSelectedFileId(id);
    setIsModalOpen(true);  // Open the modal
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedFileId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-gray-700 text-center mb-6">📂 File Sharing Dashboard</h2>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 mb-6 transition duration-300"
        >
          Logout
        </button>

        {/* Show Spinner while Loading */}
        {loading && (
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          </div>
        )}

        {/* File Upload Section */}
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Upload a File</h3>
        <div className="border-2 border-dashed border-gray-300 p-5 rounded-lg text-center cursor-pointer hover:border-blue-500 transition duration-300">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer text-gray-500 hover:text-blue-500">
            {file ? file.name : "Drag & Drop or Click to Select a File"}
          </label>
        </div>

        {/* Upload Button */}
        <button
          onClick={uploadFile}
          disabled={loading}
          className="w-full mt-4 py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition duration-300"
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>

        {/* File List */}
        <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-3">Your Uploaded Files</h3>
        <ul className="divide-y divide-gray-200">
          {files.length === 0 ? (
            <p className="text-gray-500 text-center">No files uploaded yet.</p>
          ) : (
            files.map((f) => (
              <li key={f._id} className="py-4 flex justify-between items-center">
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold hover:underline">
                  {f.filename}
                </a>
                <div className="space-x-2">
                  {/* Download Button */}
                  <a
                    href={f.url}
                    download={f.filename}
                    className="px-3 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Download
                  </a>

                  {/* Delete Button */}
                  <button
                    onClick={() => openDeleteModal(f._id)} // Open the delete modal
                    disabled={loading}
                    className="px-3 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Custom Delete Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Confirmation"
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-opacity-70 backdrop-blur-sm flex items-center justify-center"
      >
        <h3 className="text-xl font-semibold text-center mb-4">Are you sure you want to delete this file?</h3>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => deleteFile(selectedFileId)}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Yes, Delete
          </button>
          <button
            onClick={closeDeleteModal}
            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
