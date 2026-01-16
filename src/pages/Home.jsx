import { NavLink } from 'react-router-dom';

function Home() {
  const features = [
    { icon: '🏨', title: '5-Star Luxury', desc: 'Premium hospitality experience' },
    { icon: '🍽️', title: 'Fine Dining', desc: 'World-class cuisine' },
    { icon: '🏊', title: 'Spa & Pool', desc: 'Relaxation facilities' },
    { icon: '🚗', title: 'Free Parking', desc: 'Valet service available' }
  ];

  return (
    <section className="min-vh-100 d-flex align-items-center position-relative" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <span className="badge bg-light bg-opacity-25 text-white px-4 py-2 mb-3" style={{
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            ✨ Welcome to Paradise
          </span>
          
          <h1 className="display-1 fw-bold mb-3">
            Grand Hotel
            <span className="d-block" style={{
              background: 'linear-gradient(90deg, #fff, #f0f0f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Luxury Redefined
            </span>
          </h1>
          
          <p className="lead mb-4 mx-auto" style={{maxWidth: '700px'}}>
            Experience the perfect blend of elegance, comfort, and world-class hospitality in the heart of the city
          </p>
          
          <div className="d-flex gap-3 justify-content-center mb-5">
            <NavLink className="btn btn-light btn-lg rounded-pill px-4" to="/rooms">
              Explore Rooms
            </NavLink>
            <NavLink className="btn btn-outline-light btn-lg rounded-pill px-4" to="/login">
              Book Now
            </NavLink>
          </div>

          <div className="row g-4 mt-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="p-3 rounded-3" style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div className="d-flex align-items-center gap-3">
                    <span style={{fontSize: '2.5rem'}}>{feature.icon}</span>
                    <div className="text-start">
                      <h5 className="mb-1">{feature.title}</h5>
                      <small>{feature.desc}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center gap-4 p-4 rounded-3 mx-auto mt-5" style={{
          maxWidth: '800px',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div className="text-center">
            <h2 className="display-4 fw-bold mb-0">250+</h2>
            <p className="mb-0">Luxury Rooms</p>
          </div>
          <div style={{width: '2px', height: '60px', background: 'rgba(255,255,255,0.3)'}}></div>
          <div className="text-center">
            <h2 className="display-4 fw-bold mb-0">25+</h2>
            <p className="mb-0">Years Excellence</p>
          </div>
          <div style={{width: '2px', height: '60px', background: 'rgba(255,255,255,0.3)'}}></div>
          <div className="text-center">
            <h2 className="display-4 fw-bold mb-0">50K+</h2>
            <p className="mb-0">Happy Guests</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;