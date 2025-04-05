import React from "react";

interface ServiceListProps {
  services: any;
  onEdit: (service:any) => void;
  onDelete: (service:any) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onEdit,
  onDelete,
}) => {
  return (
    <ul className="space-y-4">
      {services.map((service:any) => (
        <li
          key={service.id}
          className="p-4 bg-surface shadow-lg rounded flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold">{service.title}</h3>
            <p>{service.description}</p>
            <p className="text-sm text-gray-400">Price: ${service.price}</p>
            <p className="text-sm text-gray-400">
              Category: {service.category}
            </p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => onEdit(service)}
              className="bg-primary p-2 rounded text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(service.id)}
              className="bg-error-color p-2 rounded text-sm"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ServiceList;
