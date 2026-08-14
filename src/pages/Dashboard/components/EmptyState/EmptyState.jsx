const EmptyState = ({ icon, title, subtitle }) => (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
        {icon && (
            <div className="mb-1 flex items-center justify-center text-text-tertiary">
                {icon}
            </div>
        )}
        {title && (
            <p className="text-sm font-semibold text-text-secondary">{title}</p>
        )}
        {subtitle && (
            <p className="text-xs font-normal text-text-tertiary">{subtitle}</p>
        )}
    </div>
);

export default EmptyState;
