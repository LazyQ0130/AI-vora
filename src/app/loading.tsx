export default function Loading() {
  return (
    <div
      className="container page-container loading-page"
      role="status"
      aria-label="正在加载页面"
    >
      <div className="skeleton skeleton-eyebrow" />
      <div className="skeleton skeleton-heading" />
      <div className="skeleton skeleton-paragraph" />
      <div className="loading-grid">
        {[0, 1, 2].map((item) => (
          <div key={item} className="skeleton skeleton-card" />
        ))}
      </div>
      <span className="sr-only">正在加载页面</span>
    </div>
  );
}
