"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Folder,
  File,
  Upload,
  Plus,
  Search,
  LogOut,
  MoreVertical,
  Download,
  Trash2,
  ChevronRight,
  Image,
  FileAudio,
  FileVideo,
  Archive,
  FileText,
  HardDrive,
  Loader2,
} from "lucide-react";
import { DriveFile } from "@/lib/supabase";

export default function DriveHomePage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolder, setCurrentFolder] = useState("/");
  const [activeCategory, setActiveCategory] = useState<string>("all"); // 'all', 'images', 'videos', 'audio', 'documents', 'archives'

  // Previews
  const [previewVideoFile, setPreviewVideoFile] = useState<DriveFile | null>(null);
  const [previewImageFile, setPreviewImageFile] = useState<DriveFile | null>(null);
  
  // Folder creation state
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  // File upload state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active file menu (3-dot) id state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check auth status
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/drive/check-session");
        const data = await res.json();
        if (!data.authenticated) {
          router.push("/drive");
        } else {
          setAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check failed", err);
        router.push("/drive");
      }
    }
    checkAuth();
  }, [router]);

  // Fetch files in the current folder path or all files for category sorting
  const fetchFiles = async (folder: string, fetchAll = false) => {
    setLoading(true);
    try {
      const url = fetchAll
        ? "/api/drive/list-files?all=true"
        : `/api/drive/list-files?folder=${encodeURIComponent(folder)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setFiles(data.files || []);
      } else {
        toast.error(data.error || "Failed to load files.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchFiles(currentFolder, activeCategory !== "all");
    }
  }, [authenticated, currentFolder, activeCategory]);

  // Close active dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/drive/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out successfully.");
        router.push("/drive");
      } else {
        toast.error("Logout failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Logout failed.");
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);

    try {
      const res = await fetch("/api/drive/create-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderName: newFolderName.trim(),
          parentPath: currentFolder,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Folder "${newFolderName}" created successfully.`);
        setNewFolderName("");
        setShowNewFolderModal(false);
        fetchFiles(currentFolder);
      } else {
        toast.error(data.error || "Failed to create folder.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while creating the folder.");
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Telegram file limit: 2GB
    const MAX_SIZE = 2 * 1024 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("File exceeds the 2 GB Telegram size limit.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderPath", currentFolder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/drive/upload");

    // Track upload progress
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    });

    xhr.onload = () => {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          toast.success(`Successfully uploaded "${file.name}"`);
          fetchFiles(currentFolder);
        } catch (err) {
          toast.error("Failed to parse server response.");
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          toast.error(response.error || "Upload failed.");
        } catch (err) {
          toast.error("Upload failed.");
        }
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.error("An error occurred during upload.");
    };

    xhr.send(formData);
  };

  const handleDownload = async (file: DriveFile) => {
    if (file.mime_type === "folder") return;
    toast.info(`Starting download of "${file.file_name}"...`);
    
    // Download using window.location.href or a direct link since it streams the download
    const url = `/api/drive/download?messageId=${file.message_id}&fileName=${encodeURIComponent(file.file_name)}`;
    window.location.href = url;
    setActiveMenuId(null);
  };

  const handleDelete = async (file: DriveFile) => {
    if (!confirm(`Are you sure you want to delete "${file.file_name}"?`)) return;

    try {
      // For virtual folders, we do not delete from Telegram since message_id is 0.
      // But we can check if it has files inside it recursively, or just delete the folder metadata row.
      // Here, we just delete the folder metadata. Any child files can be orphaned or we can design simple deletion.
      const res = await fetch("/api/drive/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: file.id,
          messageId: file.message_id,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Deleted "${file.file_name}"`);
        fetchFiles(currentFolder);
      } else {
        toast.error(data.error || "Failed to delete item.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting.");
    } finally {
      setActiveMenuId(null);
    }
  };

  const handleFolderClick = (folder: DriveFile) => {
    // Navigate into folder.
    // Construct target folder path. e.g. currentFolder='/', name='work' -> '/work'
    // currentFolder='/work', name='pics' -> '/work/pics'
    const newPath = currentFolder === "/" ? `/${folder.file_name}` : `${currentFolder}/${folder.file_name}`;
    setCurrentFolder(newPath);
  };

  const navigateToBreadcrumb = (index: number) => {
    const parts = currentFolder.split("/").filter(Boolean);
    const targetParts = parts.slice(0, index);
    const newPath = targetParts.length === 0 ? "/" : "/" + targetParts.join("/");
    setCurrentFolder(newPath);
  };

  // Helper to format file sizes
  const formatBytes = (bytes: number | null) => {
    if (bytes === null || bytes === undefined) return "-";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper to determine the right icon based on mime type
  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <File className="h-6 w-6 text-gray-400" />;
    if (mimeType === "folder") return <Folder className="h-6 w-6 text-amber-500 fill-amber-500/20" />;
    if (mimeType.startsWith("image/")) return <Image className="h-6 w-6 text-emerald-400" />;
    if (mimeType.startsWith("audio/")) return <FileAudio className="h-6 w-6 text-sky-400" />;
    if (mimeType.startsWith("video/")) return <FileVideo className="h-6 w-6 text-rose-400" />;
    if (
      mimeType.includes("zip") ||
      mimeType.includes("tar") ||
      mimeType.includes("rar") ||
      mimeType.includes("7z")
    ) {
      return <Archive className="h-6 w-6 text-violet-400" />;
    }
    if (mimeType.includes("pdf") || mimeType.includes("text") || mimeType.includes("document")) {
      return <FileText className="h-6 w-6 text-blue-400" />;
    }
    return <File className="h-6 w-6 text-gray-400" />;
  };

  // Client-side filtration
  const filteredFiles = (() => {
    const searchFiltered = files.filter((file) =>
      file.file_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeCategory === "all") return searchFiltered;

    // Filter by type for categories, ignoring folders
    const filesOnly = searchFiltered.filter((file) => file.mime_type !== "folder");

    if (activeCategory === "images") {
      return filesOnly.filter((file) => file.mime_type?.startsWith("image/"));
    }
    if (activeCategory === "videos") {
      return filesOnly.filter((file) => file.mime_type?.startsWith("video/"));
    }
    if (activeCategory === "audio") {
      return filesOnly.filter((file) => file.mime_type?.startsWith("audio/"));
    }
    if (activeCategory === "documents") {
      return filesOnly.filter((file) =>
        file.mime_type?.includes("pdf") ||
        file.mime_type?.includes("text") ||
        file.mime_type?.includes("document") ||
        file.mime_type?.includes("sheet") ||
        file.mime_type?.includes("msword")
      );
    }
    if (activeCategory === "archives") {
      return filesOnly.filter((file) =>
        file.mime_type?.includes("zip") ||
        file.mime_type?.includes("tar") ||
        file.mime_type?.includes("rar") ||
        file.mime_type?.includes("7z") ||
        file.mime_type?.includes("compressed")
      );
    }
    return searchFiltered;
  })();

  const breadcrumbs = currentFolder.split("/").filter(Boolean);

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#24A1DE] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/[0.05] bg-[#0c0c0c] flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-[#24A1DE]/15 flex items-center justify-center text-[#24A1DE]">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-none">Deadraon Drive</h2>
              <span className="text-[10px] text-gray-500 font-mono">Telegram Storage</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveCategory("all");
                setCurrentFolder("/");
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#24A1DE]/10 text-[#24A1DE]"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <HardDrive className="h-4 w-4" />
              My Drive
            </button>

            <button
              onClick={() => setActiveCategory("images")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeCategory === "images"
                  ? "bg-[#24A1DE]/10 text-[#24A1DE]"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Image className="h-4 w-4" />
              Photos
            </button>

            <button
              onClick={() => setActiveCategory("videos")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeCategory === "videos"
                  ? "bg-[#24A1DE]/10 text-[#24A1DE]"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <FileVideo className="h-4 w-4" />
              Videos
            </button>

            <button
              onClick={() => setActiveCategory("audio")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeCategory === "audio"
                  ? "bg-[#24A1DE]/10 text-[#24A1DE]"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <FileAudio className="h-4 w-4" />
              Audio
            </button>

            <button
              onClick={() => setActiveCategory("documents")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeCategory === "documents"
                  ? "bg-[#24A1DE]/10 text-[#24A1DE]"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <FileText className="h-4 w-4" />
              Documents
            </button>

            <button
              onClick={() => setActiveCategory("archives")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeCategory === "archives"
                  ? "bg-[#24A1DE]/10 text-[#24A1DE]"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Archive className="h-4 w-4" />
              Archives
            </button>
          </nav>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => {
                if (uploading) return;
                fileInputRef.current?.click();
              }}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#24A1DE] hover:bg-[#24A1DE]/90 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-[#24A1DE]/15"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </button>

            <button
              onClick={() => setShowNewFolderModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white font-medium text-sm rounded-xl transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              New Folder
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-white/[0.05]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-white/[0.05] bg-[#0c0c0c]/80 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search files by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#24A1DE]/50 focus:ring-1 focus:ring-[#24A1DE]/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile upload & action buttons */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="p-2.5 bg-[#24A1DE] text-white rounded-xl hover:bg-[#24A1DE]/90 disabled:opacity-50 transition-all"
              title="Upload File"
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="p-2.5 bg-white/[0.03] border border-white/10 text-white rounded-xl hover:bg-white/[0.06] transition-all"
              title="New Folder"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 bg-transparent text-red-400 rounded-xl hover:bg-red-500/10 transition-all"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Hidden inputs for uploading */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* File upload progress indicator banner */}
        {uploading && (
          <div className="bg-[#24A1DE]/10 border-b border-[#24A1DE]/25 px-6 py-3 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3 min-w-0">
              <Loader2 className="h-4 w-4 text-[#24A1DE] animate-spin shrink-0" />
              <span className="truncate">Uploading file to Telegram Saved Messages...</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-32 bg-white/10 rounded-full h-1.5 overflow-hidden hidden sm:block">
                <div
                  className="bg-[#24A1DE] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress || 0}%` }}
                />
              </div>
              <span className="font-bold text-[#24A1DE]">{uploadProgress ?? 0}%</span>
            </div>
          </div>
        )}

        {/* Dynamic File Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium overflow-x-auto whitespace-nowrap pb-1">
            <button
              onClick={() => setCurrentFolder("/")}
              className="hover:text-white transition-all"
            >
              My Drive
            </button>
            {breadcrumbs.map((folderName, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="h-3.5 w-3.5 text-gray-700 shrink-0" />
                <button
                  onClick={() => navigateToBreadcrumb(index + 1)}
                  className={`hover:text-white transition-all ${
                    index === breadcrumbs.length - 1 ? "text-gray-300 font-bold" : ""
                  }`}
                >
                  {folderName}
                </button>
              </React.Fragment>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-white/[0.01] border border-white/[0.03] animate-pulse flex items-center p-4 gap-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/5 rounded-full w-2/3" />
                    <div className="h-2 bg-white/5 rounded-full w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="h-[50vh] flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-white/[0.01] border border-white/[0.05] flex items-center justify-center text-gray-600 mb-4">
                <HardDrive className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No files found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                {searchQuery
                  ? "Try looking for another file name or clear your search input."
                  : "Upload a file or create a virtual folder to organize your drive storage."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => {
                    if (file.mime_type === "folder") {
                      handleFolderClick(file);
                    } else if (file.mime_type?.startsWith("video/")) {
                      setPreviewVideoFile(file);
                    } else if (file.mime_type?.startsWith("image/")) {
                      setPreviewImageFile(file);
                    } else {
                      handleDownload(file);
                    }
                  }}
                  className="glass border border-white/[0.05] rounded-2xl p-4 flex items-center gap-4 relative transition-all duration-200 hover:border-white/10 hover:bg-white/[0.03] group select-none cursor-pointer"
                >
                  {/* File Icon */}
                  <div className="h-12 w-12 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center shrink-0">
                    {getFileIcon(file.mime_type)}
                  </div>

                  {/* File Meta */}
                  <div className="flex-1 min-w-0 pr-6">
                    <h4
                      className="font-semibold text-sm text-gray-200 truncate group-hover:text-white"
                      title={file.file_name}
                    >
                      {file.file_name}
                    </h4>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      {file.mime_type === "folder" ? "Folder" : formatBytes(file.file_size)}
                    </p>
                  </div>

                  {/* Dropdown Menu (3-dot) */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2" ref={menuRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === file.id ? null : file.id);
                      }}
                      className="p-1 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {activeMenuId === file.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-[#121212] border border-white/[0.08] rounded-xl shadow-2xl z-40 py-1.5 overflow-hidden">
                        {file.mime_type === "folder" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFolderClick(file);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                          >
                            <Folder className="h-3.5 w-3.5" />
                            Open Folder
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(file);
                            }}
                            className="w-full px-4 py-2 text-left text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(file);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-sm glass border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Create New Folder</h3>
            <form onSubmit={handleCreateFolder}>
              <input
                type="text"
                placeholder="Folder Name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#24A1DE] focus:ring-1 focus:ring-[#24A1DE] transition-all mb-6"
                required
                autoFocus
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewFolderModal(false);
                    setNewFolderName("");
                  }}
                  className="px-4 py-2 bg-transparent hover:bg-white/[0.02] border border-white/10 text-white rounded-xl text-sm font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingFolder || !newFolderName.trim()}
                  className="px-4 py-2 bg-[#24A1DE] hover:bg-[#24A1DE]/90 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all cursor-pointer"
                >
                  {creatingFolder ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideoFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-3xl glass border border-white/[0.08] rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold truncate pr-4 text-gray-200">{previewVideoFile.file_name}</h3>
              <span className="text-xs font-mono text-[#24A1DE] font-semibold bg-[#24A1DE]/10 px-2.5 py-0.5 rounded-full">
                Video Player
              </span>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/5">
              <video
                src={`/api/drive/download?messageId=${previewVideoFile.message_id}&fileName=${encodeURIComponent(previewVideoFile.file_name)}&inline=true&mimeType=${encodeURIComponent(previewVideoFile.mime_type || "video/mp4")}`}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500 font-mono">
                Size: {formatBytes(previewVideoFile.file_size)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(previewVideoFile)}
                  className="px-4 py-2 bg-[#24A1DE] hover:bg-[#24A1DE]/90 text-white rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewVideoFile(null)}
                  className="px-4 py-2 bg-transparent hover:bg-white/[0.05] border border-white/10 text-white rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImageFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-2xl glass border border-white/[0.08] rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold truncate pr-4 text-gray-200">{previewImageFile.file_name}</h3>
              <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                Image Preview
              </span>
            </div>

            <div className="w-full max-h-[60vh] flex items-center justify-center rounded-xl overflow-hidden bg-black/30 border border-white/5 p-2">
              <img
                src={`/api/drive/download?messageId=${previewImageFile.message_id}&fileName=${encodeURIComponent(previewImageFile.file_name)}&inline=true&mimeType=${encodeURIComponent(previewImageFile.mime_type || "image/jpeg")}`}
                alt={previewImageFile.file_name}
                className="max-w-full max-h-[50vh] object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500 font-mono">
                Size: {formatBytes(previewImageFile.file_size)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(previewImageFile)}
                  className="px-4 py-2 bg-[#24A1DE] hover:bg-[#24A1DE]/90 text-white rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewImageFile(null)}
                  className="px-4 py-2 bg-transparent hover:bg-white/[0.05] border border-white/10 text-white rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
