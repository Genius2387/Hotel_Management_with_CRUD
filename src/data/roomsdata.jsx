import luxury from "../assets/luxury_suite.jpg";
import family from "../assets/family_room.jpg";
import single from "../assets/single_Room.jpg";
import couple from "../assets/couple_room.webp";
import deluxe from "../assets/deluxe_Room.jpg";
import executive from "../assets/executive_suite.jpg";

const roomsData = [
  {
    id: 1,
    image: luxury,
    title: "Luxury Suite",
    price: 299,
    description: "Spacious suite with premium amenities and city view",
    amenities: ["King Bed", "WiFi", "Minibar", "Jacuzzi"]
  },
  {
    id: 2,
    image: family,
    title: "Family Room",
    price: 199,
    description: "Perfect for families with connecting rooms",
    amenities: ["2 Queen Beds", "WiFi", "Kitchen", "TV"]
  },
  {
    id: 3,
    image: single,
    title: "Single Room",
    price: 99,
    description: "Cozy room ideal for solo travelers",
    amenities: ["Single Bed", "WiFi", "AC", "Workspace"]
  },
  {
    id: 4,
    image: couple,
    title: "Couple Room",
    price: 159,
    description: "Romantic setting for couples",
    amenities: ["Queen Bed", "WiFi", "Balcony", "Breakfast"]
  },
  {
    id: 5,
    image: deluxe,
    title: "Deluxe Room",
    price: 249,
    description: "Premium comfort with ocean view",
    amenities: ["King Bed", "WiFi", "Sea View", "Room Service"]
  },
  {
    id: 6,
    image: executive,
    title: "Executive Suite",
    price: 349,
    description: "Business class luxury and comfort",
    amenities: ["King Bed", "WiFi", "Office", "Lounge Access"]
  }
];

export default roomsData;
