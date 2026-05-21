"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  RiShieldCheckLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiExchangeLine,
  RiMoneyDollarCircleLine
} from "react-icons/ri";
import { paymentService } from "@/services/progress.service";

export default function AdminPaymentsPage() {
  const queryClient = useQueryClient();

  // Fetch all payment records for verification
  const { data, isLoading } = useQuery({
    queryKey: ["admin-payments-history"],
    queryFn: () => paymentService.getAllPayments(),
  });

  const payments = data?.data ?? [];

  // Mutation to approve enrollment payment
  const approveMutation = useMutation({
    mutationFn: (id: string) => paymentService.approvePayment(id),
    onSuccess: (res) => {
      toast.success(res.message || "Payment verified & Student enrolled successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-payments-history"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to approve payment verification.");
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs font-bold">
            <RiCheckboxCircleLine className="text-sm" /> Verified
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 text-xs font-bold">
            <RiTimeLine className="text-sm" /> Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold animate-pulse">
            <RiTimeLine className="text-sm" /> Pending Approval
          </span>
        );
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-[#FAFAFA] min-h-screen">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Manual Enrollment Approval</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review and verify student manual payments (bKash/Nagad/Bank Transfer) to activate course enrollment.
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <RiShieldCheckLine className="text-base" /> Secure CMS Admin Gate
        </div>
      </div>

      {/* Content list */}
      <div className="rounded-2xl border border-border/80 bg-background shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/80 bg-muted/20 shrink-0">
          <h3 className="font-bold text-sm text-foreground">Pending & Past Transactions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Matching Transaction IDs with payments submitted from the enrollment portal.
          </p>
        </div>

        {isLoading ? (
          <div className="p-12 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-muted/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-3">
            <RiExchangeLine className="text-5xl text-muted-foreground/30 animate-spin" />
            <h3 className="font-bold text-lg text-foreground">No payment requests found</h3>
            <p className="text-xs text-muted-foreground">
              When students make manual transfers and fill out the enrollment form, the list will update automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground uppercase font-bold tracking-wider">
                  <th className="p-4">Student Details</th>
                  <th className="p-4">Training Target</th>
                  <th className="p-4">Method & Account</th>
                  <th className="p-4">Transaction Reference</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {payments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-muted/10 transition-colors">
                    {/* Student Name & Email */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <RiUserLine className="text-primary text-sm shrink-0" />
                        {payment.userFullName || "Student Partner"}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <RiMailLine className="text-muted-foreground shrink-0" />
                        {payment.userEmail || "N/A"}
                      </div>
                    </td>

                    {/* Training TARGET */}
                    <td className="p-4 space-y-1 font-semibold text-foreground">
                      <div className="line-clamp-1">{payment.courseTitle || "Professional Training"}</div>
                      <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                        <RiMoneyDollarCircleLine className="text-sm" />
                        {formatPrice(payment.amount || 0)}
                      </div>
                    </td>

                    {/* Method & Phone */}
                    <td className="p-4 space-y-1">
                      <span className="px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
                        {payment.paymentMethod}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                        <RiPhoneLine className="shrink-0" />
                        {payment.phoneNumber || "N/A"}
                      </div>
                    </td>

                    {/* Transaction ID */}
                    <td className="p-4 font-mono font-bold text-foreground text-xs uppercase tracking-wider">
                      {payment.transactionId}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {getStatusBadge(payment.status)}
                    </td>

                    {/* Action Button */}
                    <td className="p-4 text-center">
                      {payment.status?.toLowerCase() === "pending" ? (
                        <button
                          disabled={approveMutation.isPending}
                          onClick={() => approveMutation.mutate(payment.id)}
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-sm shadow-primary/15 disabled:opacity-60"
                        >
                          {approveMutation.isPending ? "Processing..." : "Approve"}
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
