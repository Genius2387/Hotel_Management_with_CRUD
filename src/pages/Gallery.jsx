import g2 from "../assets/g2.jpg";
import g8 from "../assets/g8.jpg";
import g4 from "../assets/g4.avif";
import g5 from "../assets/g5.avif";
import g6 from "../assets/g6.webp";
import g7 from "../assets/g7.avif";

function Gallery() {
  const images = [g2, g8, g4, g5, g6, g7];

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center display-5 fw-bold mb-5">Gallery</h2>

        <div className="row g-3">
          {images.map((img, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div
                className="overflow-hidden rounded-3"
                style={{ height: "250px" }}
              >
                <img
                  src={img}
                  alt={`gallery-${index}`}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
