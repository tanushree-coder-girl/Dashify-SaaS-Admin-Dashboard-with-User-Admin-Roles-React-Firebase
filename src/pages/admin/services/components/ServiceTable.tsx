import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchServices, deleteService } from "@services/servicesApi";
import InputField from "@/components/TextField";
import CustomPagination from "@components/Pagination";
import CustomSelect from "@components/CustomSelect";
import Modal from "@components/Modal";
import ServiceForm from "@pages/admin/services/components/ServiceForm";
import CommonTable from "@/components/CommonTable";

const ITEMS_PER_PAGE = 5;

// ✅ **Define Type for Service**
interface Service {
  id: string;
  title: string;
  category: string;
  price: number;
  status: "Active" | "Inactive";
}

const ServiceTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const queryClient = useQueryClient();

  // ✅ **Fetch Services from Firestore**
  const {
    data: services = [],
    isLoading,
    isError,
  } = useQuery<any[], Error>({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  // ✅ **Delete Service Mutation**
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });

  // 🔍 **Search and Filter Services**
  const filteredServices: Service[] = Array.isArray(services)
    ? services.filter(
        (service: Service) =>
          service.title.toLowerCase().includes(search.toLowerCase()) &&
          (filter === "All" || service.status === filter)
      )
    : [];

  // ✅ **Pagination Logic**
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-surface text-theme p-6 rounded-lg shadow-md">
      {/* 🔹 Filters & Search */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <InputField
          id="search"
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CustomSelect
          options={["All", "Active", "Inactive"]}
          value={filter}
          onChange={(value) =>
            setFilter(value as "All" | "Active" | "Inactive")
          }
        />
      </div>

      <CommonTable
        columns={["Service Name", "Category", "Price", "Status", "Actions"]}
        isLoading={isLoading}
        isError={isError}
        noDataText="No services found."
        rows={paginatedServices.map((service: Service) => (
          <tr
            key={service.id}
            className="hover:bg-[var(--primary-hover-color)] transition-all"
          >
            <td className="p-3 border theme-border">{service.title}</td>
            <td className="p-3 border theme-border">{service.category}</td>
            <td className="p-3 border theme-border">${service.price}</td>
            <td className="p-3 border theme-border">
              <span
                className={`px-2 py-1 rounded-md text-theme text-sm ${
                  service.status === "Active" ? "bg-success" : "bg-error"
                }`}
              >
                {service.status}
              </span>
            </td>
            <td className="p-3 border theme-border">
              <button
                className="text-primary mr-2"
                onClick={() => {
                  setSelectedService(service);
                  setModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="text-error"
                onClick={() => deleteMutation.mutate(service.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      />

      {/* 🔹 Pagination (Only Show if More than 5 Items) */}
      {filteredServices.length > ITEMS_PER_PAGE && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* 🔹 Add/Edit Service Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ServiceForm
          initialData={selectedService}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ServiceTable;
