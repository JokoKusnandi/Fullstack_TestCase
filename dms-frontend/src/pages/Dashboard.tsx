import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/integrations/supabase/client';
import { DocumentService } from "@/services/document.service";
import type { Document, DocumentStatus } from "@/services/document.service";


import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Loader } from '@/components/Loader';
import { ErrorState } from '@/components/ErrorState';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { DocumentUploadModal } from '@/components/DocumentUploadModal';

// type DocumentStatus = 'pending' | 'approved' | 'rejected';

const mapApiStatus = (status: string): DocumentStatus => {
  switch (status) {
    case "approved":
      return "APPROVED";
    case "rejected":
      return "REJECTED";
    case "pending":
    default:
      return "ACTIVE"; // atau PENDING_REPLACE sesuai bisnis
  }
};


// interface Document {
//   id: string;
//   title: string;
//   status: DocumentStatus;
//   created_at: string;
// }

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const Dashboard = () => {
  // const isAdmin =user?.role?.toUpperCase() === "ADMIN";
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
     
      const res = await DocumentService.getAll();
      const documents = res.results;
      console.log(res.results);
      setStats({
        total: res.count,
        pending: documents.filter(d =>
          d.status === "PENDING_DELETE" || d.status === "PENDING_REPLACE"
        ).length,
        approved: documents.filter(d => d.status === "APPROVED").length,
        rejected: documents.filter(d => d.status === "REJECTED").length,
      });

      setRecentDocs(documents.slice(0, 5)); // recent 5 docs
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("ROLE:", user?.role);
    console.log("IS ADMIN:", isAdmin);
  }, [user, isAdmin]);

  const statCards = [
    { label: 'Total Documents', value: stats.total, icon: FileText, color: 'text-primary' },
    { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-warning' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-success' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-destructive' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              {isAdmin ? 'Admin overview' : 'Your document overview'}
            </p>
          </div>
          
          <div className="flex gap-2">
            {isAdmin && (
              <Link to="/permissions/">
                <Button variant="outline" className="gap-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Approval Requests
                </Button>
              </Link>
            )}

            <Button onClick={() => setUploadOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        {loading ? (
          <Loader text="Loading dashboard..." />
        ) : error ? (
          <ErrorState onRetry={fetchData} />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((stat) => (
                <Card key={stat.label} className="shadow-soft hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Documents */}
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Documents</CardTitle>
                <Link to="/documents">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentDocs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No documents yet. Upload your first document!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                        <Link to={`/documents/${doc.id}`} className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            {/* Title */}
                            
                            <p className="font-medium truncate">{doc.title}</p>
                            
                            {/* Description */}
                            {doc.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {doc.description}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {new Date(doc.createdAt).toLocaleDateString("id-ID")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                <span>Type: {doc.documentType}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                             <span>v{doc.version}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <span>By {doc.createdBy?.username ?? "Unknown"}</span>
                            </p> 
                          </div>
                        </div>
                        </Link>
                        
                        <StatusBadge status={doc.status} />
                      </div>
                      
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <DocumentUploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={fetchData}
      />
    </AppLayout>
  );
};

export default Dashboard;
