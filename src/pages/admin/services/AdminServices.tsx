import { useState } from "react";
import PageHeader from "@components/PageHeader";
import Modal from "@components/Modal";
import ServiceForm from "@pages/admin/services/components/ServiceForm";
import ServiceTable from "@pages/admin/services/components/ServiceTable";

const AdminServices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ">
        <PageHeader title="Services" subtitle="Manage all services here" />
        <button
          className="bg-primary text-theme px-4 py-2 rounded-md w-full sm:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          + Add New Service
        </button>
      </div>

      {/* Service Table */}
      <ServiceTable />

      {/* Add Service Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">Add New Service</h2>
        <ServiceForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default AdminServices;
