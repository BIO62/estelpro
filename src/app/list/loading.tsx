export default function CatalogLoading() {
  return (
    <section className="py-4">
      <div className="container">
        <div className="row g-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="col-6 col-md-4" key={index}>
              <div className="ga-card">
                <div className="ga-card__body">
                  <div className="ga-card__ratio bg-light" />
                  <div className="ga-card__info">
                    <div className="bg-light rounded-2 mb-2" style={{ height: 10, width: '40%' }} />
                    <div className="bg-light rounded-2 mb-2" style={{ height: 14, width: '80%' }} />
                    <div className="bg-light rounded-2" style={{ height: 16, width: '50%' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
