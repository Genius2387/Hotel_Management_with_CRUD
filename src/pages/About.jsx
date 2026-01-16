function About() {
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center display-5 fw-bold mb-5">About Us</h2>
        
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <h3 className="h2 mb-3">Welcome to Grand Hotel</h3>
            <p className="lead text-muted">
              Established in 1995, Grand Hotel has been providing exceptional hospitality for over 25 years. 
              Our commitment to excellence and attention to detail ensures every guest experiences the perfect 
              blend of luxury and comfort.
            </p>
            <p className="text-muted">
              Located in the heart of the city, we offer easy access to major attractions while providing 
              a peaceful retreat from the bustling urban life.
            </p>
          </div>
        </div>
        
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="p-4 rounded-3 text-white h-100" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <h4 className="display-3 fw-bold">250+</h4>
              <p className="mb-0">Rooms</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-3 text-white h-100" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <h4 className="display-3 fw-bold">25+</h4>
              <p className="mb-0">Years Experience</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-3 text-white h-100" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <h4 className="display-3 fw-bold">50K+</h4>
              <p className="mb-0">Happy Guests</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;