import PageHeader from "@components/PageHeader";
import PaymentsTable from "@pages/payments/components/PaymentsTable";
import { useAuth } from "@context/AuthContext";

const PaymentsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div>
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center">
        <PageHeader
          title={isAdmin ? "Manage Payments" : "My Payments"}
          subtitle={
            isAdmin
              ? "View and manage all payments"
              : "View your payments and complete pending transactions"
          }
        />
      </div>

      {/* ✅ Payments Table */}
      <PaymentsTable isAdmin={isAdmin} userId={user?.uid} />
    </div>
  );
};

export default PaymentsPage;
