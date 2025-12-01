"use client";

import {
  upload,
  ImageKitProvider,
} from "@imagekit/next";
import Image from "next/image";
import { useRef, useState } from "react";
import config from "../lib/config";
import { toast } from "sonner";

const authenticator = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/api/upload-auth`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Auth failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token, publicKey } = data;

    return { signature, expire, token, publicKey };
  } catch (err) {
    console.error(err);
    throw new Error("Authentication request failed");
  }
};

export default function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedURL, setUploadedURL] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const abortController = new AbortController();

  // ------------------------
  // Auto Upload on Select
  // ------------------------
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // get auth
    let auth;
    try {
      auth = await authenticator();
    } catch (error) {
      console.error("Authentication error", error);
      return;
    }

    // upload
    try {
      const uploadResponse = await upload({
        expire: auth.expire,
        token: auth.token,
        signature: auth.signature,
        publicKey: auth.publicKey,
        file,
        fileName: file.name,
        onProgress: ({ loaded, total }) => {
          setProgress(Math.round((loaded / total) * 100));
        },
        abortSignal: abortController.signal,
      });

      setUploadedURL(uploadResponse.url!);

   
        toast.success("File uploaded successfully!",{description: `${uploadResponse.url} has been uploaded`});


    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/rkotak2133/">

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*"
      />

      {/* One Single Button */}
      <button
        className="upload-btn bg-dark-300 flex items-center gap-3 rounded-xl px-4 py-3"
        onClick={() => fileInputRef.current?.click()}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload icon"
          width={20}
          height={20}
          className="object-contain"
        />
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
          ></div>
        </div>
      )}

      {/* Only Uploaded Image (Hosted) */}
      {uploadedURL ? (
        <Image
          src={uploadedURL}
          alt="Uploaded file"
          className="mt-4 object-cover rounded-xl"
          unoptimized
          height={300}
          width={500}
        />
      ): <p>No image uploaded yet</p>}
    </ImageKitProvider>
  );
}
