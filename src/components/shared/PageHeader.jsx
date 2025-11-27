const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-8 border-b border-secondary-200 pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary-900">{title}</h1>
          {subtitle && <p className="mt-1 text-base text-secondary-500">{subtitle}</p>}
        </div>
        {children && <div className="flex-shrink-0">{children}</div>}
      </div>
    </div>
  );
};

export default PageHeader;