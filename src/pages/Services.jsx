function Services() {
  const servicesData = [
    { id: 1, title: 'Room Service', description: '24/7 in-room dining' },
    { id: 2, title: 'Spa & Wellness', description: 'Relaxation and rejuvenation' },
    { id: 3, title: 'Fitness Center', description: 'State-of-the-art equipment' },
    { id: 4, title: 'Swimming Pool', description: 'Indoor and outdoor pools' },
    { id: 5, title: 'Restaurant', description: 'Fine dining experience' },
    { id: 6, title: 'Conference Rooms', description: 'Business meeting facilities' }
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center display-5 fw-bold mb-5">Our Services</h2>
        
        <div className="row g-4">
          {servicesData.map((service) => (
            <div key={service.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="card-body">
                  <h3 className="h5 text-primary mb-3">{service.title}</h3>
                  <p className="card-text text-muted">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;