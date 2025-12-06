"use client";

import { upload, ImageKitProvider } from "@imagekit/next";
import Image from "next/image";
import { useRef, useState } from "react";
import config from "../lib/config";
import { toast } from "sonner";

const authenticator = async () => {
  const res = await fetch(`${config.apiUrl}/api/upload-image`);
  if (!res.ok) throw new Error("ImageKit Auth failed");
  return await res.json();
};

export default function ImageUpload({ value, onChange }) {
  const fileInputRef = useRef(null);
  const [uploadedURL, setUploadedURL] = useState(value || "");
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const auth = await authenticator();

    const uploadResponse = await upload({
      file,
      fileName: file.name,
      expire: auth.expire,
      token: auth.token,
      signature: auth.signature,
      publicKey: auth.publicKey,
      onProgress: ({ loaded, total }) =>
        setProgress(Math.round((loaded / total) * 100)),
    });

    setUploadedURL(uploadResponse.url);
    onChange(uploadResponse.url); // <- CRITICAL

    toast.success("Image uploaded!", {
      description: uploadResponse.url,
    });
  };

  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/rkotak2133/">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />

      {/* Upload Button */}
      <button
        className="upload-btn bg-dark-300 flex items-center gap-3 rounded-xl px-4 py-3"
        type="button"
        onClick={() => fileInputRef.current?.click()}
      >
        <Image src="/icons/upload.svg" width={20} height={20} alt="upload" />
        <p className="text-light-100 text-base">
          {uploadedURL ? "Uploaded ✔" : "Upload File"}
        </p>
      </button>

      {/* Progress Bar */}
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
          <div
            className="bg-green-400 h-3 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Image Preview */}
      {uploadedURL && (
        <Image
          src={uploadedURL}
          alt="uploaded"
          className="mt-4 rounded-xl object-cover"
          width={400}
          height={250}
          unoptimized
        />
      )}
    </ImageKitProvider>
  );
}
