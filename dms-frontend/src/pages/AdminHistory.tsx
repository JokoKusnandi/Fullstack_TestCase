import { useEffect, useState } from "react";
import { PermissionService, PermissionRequest } from "@/services/permission.service";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/Loader";

const statusLabel = {
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const AdminHistory = () => {
  const [data, setData] = useState<PermissionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await PermissionService.getHistory();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Approval History</h1>

        {loading ? (
          <Loader text="Loading history..." />
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted">
                  <tr>
                    <th className="p-3 text-left">Document</th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">Requester</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Approved By</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(req => (
                    <tr key={req.id} className="border-b">
                      <td className="p-3">{req.document}</td>
                      <td className="p-3">{req.action}</td>
                      <td className="p-3">{req.requester}</td>
                      <td className="p-3">
                        <Badge variant={req.status === "APPROVED" ? "default" : "destructive"}>
                          {statusLabel[req.status]}
                        </Badge>
                      </td>
                      <td className="p-3">{req.approved_by}</td>
                      <td className="p-3">
                        {req.approved_at
                          ? new Date(req.approved_at).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}

                  {data.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-muted-foreground">
                        No history data
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

export default AdminHistory;
