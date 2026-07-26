import { BACKEND_BASE_URL } from "@/consts";

export type UploadPurpose =
  | "user-profile"
  | "trust-logo"
  | "admin-profile"
  | "disaster-image"
  | "fund-request-document";

type UploadSignature = {
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: "image" | "raw";
  signature: string;
  timestamp: number;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const isImageUrl = (url: string) =>
  /\.(jpe?g|png|webp)(?:$|\?)/i.test(url) || url.includes("/image/upload/");

export const uploadToCloudinary = async (
  file: File,
  purpose: UploadPurpose,
  accessToken?: string
): Promise<string> => {
  const isDocument = purpose === "fund-request-document";
  const validTypes = isDocument ? DOCUMENT_TYPES : IMAGE_TYPES;
  const maxSize = isDocument ? MAX_DOCUMENT_SIZE : MAX_IMAGE_SIZE;

  if (!validTypes.has(file.type)) {
    throw new Error(
      isDocument
        ? "Only PDF, JPG, PNG, and WEBP files are allowed"
        : "Only JPG, PNG, and WEBP images are allowed"
    );
  }

  if (file.size > maxSize) {
    throw new Error(
      `File must be smaller than ${isDocument ? "10MB" : "5MB"}`
    );
  }

  const signatureResponse = await fetch(
    `${BACKEND_BASE_URL}/api/upload-signature`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ purpose }),
    }
  );

  const signaturePayload = await signatureResponse.json();
  if (!signatureResponse.ok) {
    throw new Error(signaturePayload.message || "Unable to prepare upload");
  }

  const signature = signaturePayload as UploadSignature;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("folder", signature.folder);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/${signature.resourceType}/upload`,
    { method: "POST", body: formData }
  );
  const uploadPayload = await uploadResponse.json();
  if (!uploadResponse.ok || !uploadPayload.secure_url) {
    throw new Error(uploadPayload.error?.message || "Upload failed");
  }

  return uploadPayload.secure_url as string;
};
