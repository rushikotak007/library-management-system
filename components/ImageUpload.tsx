"use client";

import { upload, ImageKitProvider } from "@imagekit/next";
import Image from "next/image";
import { useRef, useState } from "react";
import config from "../lib/config";
import { toast } from "sonner";

// -----------------------------
// Types
// -----------------------------
interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

interface ImageKitAuthResponse {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
}

// -----------------------------
// Authenticator
// -----------------------------
const authenticator = async (): Promise<ImageKitAuthResponse> => {
  const res = await fetch(`${config.env.apiEndpoint}/api/upload-image`);
  if (!res.ok) throw new Error("ImageKit Auth failed");
  return res.json();
};

// -----------------------------
// Component
// -----------------------------
export default function ImageUpload({
  value = "",
  onChange,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedURL, setUploadedURL] = useState<string>(value);
  const [progress, setProgress] = useState<number>(0);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const auth = await authenticator();

      const uploadResponse = await upload({
        file,
        fileName: file.name,
        expire: auth.expire,
        token: auth.token,
        signature: auth.signature,
        publicKey: auth.publicKey,
        onProgress: ({ loaded, total }) => {
          if (total) {
            setProgress(Math.round((loaded / total) * 100));
          }
        },
      });

      if (!uploadResponse?.url) {
        throw new Error("Upload failed");
      }

      setUploadedURL(uploadResponse.url);
      onChange(uploadResponse.url); // ✅ RHF-compatible

      toast.success("Image uploaded!", {
        description: uploadResponse.url,
      });
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    }
  };

  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/rkotak2133/">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />

      {/* Upload Button */}
      <button
        type="button"
        className="upload-btn bg-dark-300 flex items-center gap-3 rounded-xl px-4 py-3"
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
            className="bg-green-400 h-3 rounded-full transition-all"
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
