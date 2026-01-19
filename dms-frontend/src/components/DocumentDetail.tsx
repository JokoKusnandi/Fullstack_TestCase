import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DocumentService } from "@/services/document.service";
import type { Document } from "@/services/document.service";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader } from "@/components/Loader";

const DocumentDetail = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    DocumentService.getById(Number(id))
      .then(setDoc)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader text="Loading document..." />;
  if (!doc) return <p>Document not found</p>;

  const getFileType = (fileUrl: string) => {
    const ext = fileUrl.split(".").pop()?.toLowerCase();

    if (!ext) return "unknown";
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    if (["doc", "docx"].includes(ext)) return "doc";

    return "unknown";
    };
    


  return (
    <AppLayout>
      <Card className="max-w-3xl mx-auto">
        <CardContent className="space-y-3">
          <h1 className="text-xl font-bold">{doc.title}</h1>
          <p className="text-xs text-muted-foreground">
            Document ID: {doc.id}
          </p>
          <StatusBadge status={doc.status} />

          <p className="text-sm text-muted-foreground">{doc.description}</p>

          <div className="text-sm space-y-1">
            <p><b>Type:</b> {doc.documentType}</p>
            <p><b>Version:</b> v{doc.version}</p>
            <p><b>Created By:</b> {doc.createdBy.username}</p>
            <p><b>Date:</b> {new Date(doc.createdAt).toLocaleString("id-ID")}</p>
          </div>

          <a
            href={doc.fileUrl}
            target="_blank"
            className="text-primary underline"
          >
            Download File
          </a>
          {/* === DOCUMENT PREVIEW === */}
            <div className="pt-4 border-t">
            <h2 className="font-semibold mb-2">Preview</h2>

            {(() => {
                const fileType = getFileType(doc.fileUrl);

                if (fileType === "image") {
                return (
                    <img
                    src={doc.fileUrl}
                    alt={doc.title}
                    className="max-h-[500px] w-full object-contain rounded-md border"
                    />
                );
                }

                if (fileType === "pdf") {
                return (
                    <iframe
                    src={doc.fileUrl}
                    className="w-full h-[600px] border rounded-md"
                    title="PDF Preview"
                    />
                );
                }

                if (fileType === "doc") {
                return (
                    <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                        doc.fileUrl
                    )}&embedded=true`}
                    className="w-full h-[600px] border rounded-md"
                    title="DOC Preview"
                    />
                );
                }

                return (
                <p className="text-sm text-muted-foreground">
                    Preview not available for this file type.
                </p>
                );
            })()}
            </div>

        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default DocumentDetail;
