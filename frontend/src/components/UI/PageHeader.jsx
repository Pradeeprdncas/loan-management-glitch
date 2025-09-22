function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;