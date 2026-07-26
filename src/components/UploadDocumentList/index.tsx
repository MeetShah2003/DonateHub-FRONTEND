import Image from "next/image";
import { isImageUrl } from "@/lib/cloudinary";

const UploadDocumentList: React.FC<{ documents: string[] }> = ({ documents }) => (
  <div className="flex flex-wrap gap-3">
    {documents.map((document, index) =>
      isImageUrl(document) ? (
        <a key={document} href={document} target="_blank" rel="noreferrer">
          <Image height={100} width={100} src={document} alt={`Uploaded document ${index + 1}`} className="max-w-xs border rounded-md max-h-40 object-cover" />
        </a>
      ) : (
        <a key={document} href={document} target="_blank" rel="noreferrer" className="flex h-24 w-32 items-center justify-center rounded-md border border-primary bg-white p-3 text-center text-sm text-primary">
          View document {index + 1}
        </a>
      )
    )}
  </div>
);

export default UploadDocumentList;
