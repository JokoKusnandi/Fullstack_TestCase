import { useEffect, useState } from "react";
import { PermissionRequest, PermissionService } from "@/services/permission.service";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/Loader";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const AdminApproval = () => {
  const { toast } = useToast();
  const [data, setData] = useState<PermissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const statusLabel = {
    PENDING_DELETE: "Pending Delete",
    PENDING_REPLACE: "Pending Replace",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await PermissionService.getPending();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      await PermissionService.approve(id);
      toast({ title: "Request approved" });
      fetchData();
    } catch {
      toast({ title: "Approve failed", variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingId(id);
    try {
      await PermissionService.reject(id);
      toast({ title: "Request rejected" });
      fetchData();
    } catch {
      toast({ title: "Reject failed", variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Permission Requests</h1>

        <Link to="admin/history/">
          <Button variant="outline">
            Admin History
          </Button>
        </Link>
      </div>


        {loading ? (
          <Loader text="Loading requests..." />
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted">
                  <tr>
                    <th className="p-3 text-left">Document</th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(req => (
                    <tr key={req.id} className="border-b">
                      <td className="p-3">{req.document}</td>
                      <td className="p-3">{req.action}</td>
                      <td className="p-3">{req.requester || (<span className="text-muted-foreground">Unknown</span>)}</td>
                      <td className="p-3">
                        <Badge variant="secondary">
                          {statusLabel[req.status] ?? req.status}
                        </Badge>
                      </td>
                      <td className="p-3 space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(req.id)}
                          disabled={
                            processingId === req.id ||
                            !req.status.startsWith("PENDING")
                          }
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(req.id)}
                          disabled={
                            processingId === req.id ||
                            !req.status.startsWith("PENDING")
                          }
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {data.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-muted-foreground">
                        No pending requests
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminApproval;
