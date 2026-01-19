import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/integrations/supabase/client';
import { DocumentService } from "@/services/document.service";
import type { Document } from "@/services/document.service";
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { DocumentUploadModal } from '@/components/DocumentUploadModal';
import {
  FileText,
  Plus,
  Search,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Upload,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const Documents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [replaceId, setReplaceId] = useState<number | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replacing, setReplacing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

 const fetchDocuments = async () => {
  setLoading(true);
  setError(null);

  try {
      const res = await DocumentService.getAll(statusFilter);
      setDocuments(res.results); 
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.file_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [documents, searchQuery, statusFilter]);

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDocuments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDocuments, currentPage]);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchDocuments();
  }, [searchQuery, statusFilter, currentPage]);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      // const { error } = await supabase.from('documents').delete().eq('id', deleteId);
      // if (error) throw error;
      await DocumentService.requestDelete(deleteId);

      toast({
        title: 'Document deleted',
        description: 'The document has been removed.',
      });

      fetchDocuments();
    } catch (err: any) {
      toast({
        title: 'Delete failed',
        description: err.response?.data?.detail || "Request failed",
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(2)} KB`;
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Documents</h1>
            <p className="text-muted-foreground">
              Manage and track your uploaded documents
            </p>
          </div>
          <Button onClick={() => setUploadOpen(true)} className="shadow-soft">
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING_DELETE">Pending Delete</SelectItem>
              <SelectItem value="PENDING_REPLACE">Pending Replace</SelectItem>
              {/* <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Documents List */}
        {loading ? (
          <Loader text="Loading documents..." />
        ) : error ? (
          <ErrorState onRetry={fetchDocuments} />
        ) : filteredDocuments.length === 0 ? (
          searchQuery || statusFilter !== 'all' ? (
            <EmptyState
              type="search"
              action={{
                label: 'Clear filters',
                onClick: () => {
                  setSearchQuery('');
                  setStatusFilter('all');
                },
              }}
            />
          ) : (
            <EmptyState
              type="documents"
              action={{
                label: 'Upload Document',
                onClick: () => setUploadOpen(true),
              }}
            />
          )
        ) : (
          <>
            <Card className="shadow-soft overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {paginatedDocuments.map((doc) => (
                      
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                      >
                      <Link to={`/documents/${doc.id}`} className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Document ID: {doc.id}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span className="truncate">{doc.file_name}</span>
                            <span>•</span>
                            <span>{formatFileSize(doc.file_size)}</span>
                            <span>•</span>
                            <span>{new Date(doc.createdAt).toLocaleDateString("id-ID")}</span>
                            <span>•</span>
                            <span className="text-xs text-muted-foreground">
                              <span>By {doc.createdBy?.username ?? "Unknown"}</span>
                            </span> 
                          </div>
                        </div>
                      </div>
                      </Link>
                      <div className="flex items-center gap-3 ml-4 shrink-0">
                        <StatusBadge status={doc.status} />
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8"
                          >
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setReplaceId(doc.id)}
                            title="Replace file"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredDocuments.length)} of{' '}
                  {filteredDocuments.length} documents
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <DocumentUploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={fetchDocuments}
      />

      <AlertDialog open={!!replaceId} onOpenChange={() => setReplaceId(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Replace Document File</AlertDialogTitle>
      <AlertDialogDescription>
        Upload file baru untuk menggantikan dokumen ini.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <Input
      type="file"
      onChange={(e) => setReplaceFile(e.target.files?.[0] || null)}
    />

    <AlertDialogFooter>
      <AlertDialogCancel disabled={replacing}>Cancel</AlertDialogCancel>
      <AlertDialogAction
        disabled={!replaceFile || replacing}
        onClick={async () => {
          if (!replaceId || !replaceFile) return;
          setReplacing(true);
          try {
            await DocumentService.requestReplace(replaceId, replaceFile);
            toast({ title: "Replace requested successfully" });
            fetchDocuments();
            setReplaceId(null);
            setReplaceFile(null);
          } catch (err: any) {
            toast({
              title: "Replace failed",
              description: err.response?.data?.detail || "Request failed",
              variant: "destructive",
            });
          } finally {
            setReplacing(false);
          }
        }}
      >
        {replacing ? "Uploading..." : "Replace"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AppLayout>
  );
};

export default Documents;
