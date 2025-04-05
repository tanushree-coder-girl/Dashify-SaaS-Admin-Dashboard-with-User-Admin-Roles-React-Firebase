interface pageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader = ({ title, subtitle }: pageHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-theme mb-2">{title}</h1>
      <p className="text-secondary">{subtitle}</p>
    </div>
  );
};

export default PageHeader;
