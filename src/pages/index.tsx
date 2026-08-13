import { getFlights, getHotels, addhotel, addflight } from "@/api";
import Loader from "@/components/Loader";
import SearchSelect from "@/components/SearchSelect";
import { Button } from "@/components/ui/button";
import {
  Bus,
  Calendar,
  Car,
  CreditCard,
  HomeIcon,
  Hotel,
  MapPin,
  Plane,
  QrCode,
  Shield,
  Train,
  Umbrella,
  Users,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const [bookingtype, setbookingtype] = useState("flights");
  const [from, setfrom] = useState("");
  const [to, setto] = useState("");
  const [date, setdate] = useState("");
  const [travelers, settravelers] = useState(1);
  const [searchresults, setsearchresult] = useState<any[]>([]);
  const [hotel, sethotel] = useState<any[]>([]);
  const [loading, setloading] = useState(true);
  const [flight, setflight] = useState<any[]>([]);
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();

  const defaultFlights = [
    {
      flightName: "IndiGo 6E-201",
      from: "Chennai",
      to: "Delhi",
      departureTime: "06:30",
      arrivalTime: "09:20",
      price: 4899,
      availableSeats: 45,
    },
    {
      flightName: "Air India AI-302",
      from: "Mumbai",
      to: "Delhi",
      departureTime: "08:15",
      arrivalTime: "10:45",
      price: 5999,
      availableSeats: 40,
    },
    {
      flightName: "Vistara UK-820",
      from: "Bengaluru",
      to: "Mumbai",
      departureTime: "10:30",
      arrivalTime: "12:15",
      price: 4599,
      availableSeats: 35,
    },
    {
      flightName: "Emirates EK-543",
      from: "Dubai",
      to: "London",
      departureTime: "11:30",
      arrivalTime: "15:45",
      price: 58999,
      availableSeats: 25,
    },
    {
      flightName: "Qatar Airways QR-528",
      from: "Delhi",
      to: "Doha",
      departureTime: "14:20",
      arrivalTime: "16:40",
      price: 32999,
      availableSeats: 30,
    },
    {
      flightName: "Singapore Airlines SQ-423",
      from: "Chennai",
      to: "Singapore",
      departureTime: "18:10",
      arrivalTime: "00:55",
      price: 28999,
      availableSeats: 28,
    },
    {
      flightName: "Air India AI-984",
      from: "Delhi",
      to: "Dubai",
      departureTime: "21:00",
      arrivalTime: "23:30",
      price: 24999,
      availableSeats: 32,
    },
    {
      flightName: "IndiGo 6E-608",
      from: "Kolkata",
      to: "Chennai",
      departureTime: "07:45",
      arrivalTime: "10:15",
      price: 5299,
      availableSeats: 42,
    },
    {
      flightName: "Akasa Air QP-142",
      from: "Hyderabad",
      to: "Bengaluru",
      departureTime: "12:30",
      arrivalTime: "13:35",
      price: 3499,
      availableSeats: 38,
    },
    {
      flightName: "British Airways BA-142",
      from: "Mumbai",
      to: "London",
      departureTime: "23:10",
      arrivalTime: "05:30",
      price: 64999,
      availableSeats: 20,
    },
  ];

  const defaultHotels = [
    {
      hotelName: "Taj Coromandel",
      location: "Chennai",
      pricePerNight: 8500,
      availableRooms: 18,
      amenities: "Free WiFi, Swimming Pool, Gym",
    },
    {
      hotelName: "ITC Grand Chola",
      location: "Chennai",
      pricePerNight: 10500,
      availableRooms: 12,
      amenities: "Spa, Free Breakfast, Airport Shuttle",
    },
    {
      hotelName: "Taj Mahal Palace",
      location: "Mumbai",
      pricePerNight: 15000,
      availableRooms: 20,
      amenities: "Sea View, WiFi, Restaurant",
    },
    {
      hotelName: "The Leela Palace",
      location: "Delhi",
      pricePerNight: 12000,
      availableRooms: 25,
      amenities: "Swimming Pool, Spa, Gym",
    },
    {
      hotelName: "Marina Bay Hotel",
      location: "Singapore",
      pricePerNight: 22000,
      availableRooms: 15,
      amenities: "Infinity Pool, WiFi, Restaurant",
    },
    {
      hotelName: "Burj Al Arab",
      location: "Dubai",
      pricePerNight: 65000,
      availableRooms: 10,
      amenities: "Luxury Suite, Beach View, Spa",
    },
    {
      hotelName: "The Ritz London",
      location: "London",
      pricePerNight: 48000,
      availableRooms: 16,
      amenities: "Spa, Fine Dining, WiFi",
    },
    {
      hotelName: "Hilton Tokyo",
      location: "Tokyo",
      pricePerNight: 28000,
      availableRooms: 22,
      amenities: "Restaurant, Gym, Parking",
    },
    {
      hotelName: "The Oberoi Bengaluru",
      location: "Bengaluru",
      pricePerNight: 11000,
      availableRooms: 20,
      amenities: "Garden, Restaurant, WiFi",
    },
    {
      hotelName: "The Lalit Kolkata",
      location: "Kolkata",
      pricePerNight: 7500,
      availableRooms: 30,
      amenities: "Pool, Gym, Restaurant",
    },
  ];

  const offers = [
    {
      title: "Domestic Flights",
      description: "Get up to 20% off on domestic flights",
      imageUrl:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800",
    },
    {
      title: "International Hotels",
      description: "Book luxury hotels worldwide",
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800",
    },
    {
      title: "Holiday Packages",
      description: "Exclusive deals on holiday packages",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800",
    },
  ];

  const collections = [
    {
      title: "Stays in & Around Delhi",
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800",
      tag: "TOP 8",
    },
    {
      title: "Stays in & Around Mumbai",
      imageUrl:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800",
      tag: "TOP 8",
    },
    {
      title: "Stays in & Around Bangalore",
      imageUrl:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800",
      tag: "TOP 9",
    },
    {
      title: "Beach Destinations",
      imageUrl:
        "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=800",
      tag: "TOP 11",
    },
  ];

  const wonders = [
    {
      title: "Shimla's Best Kept Secret",
      imageUrl:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800",
    },
    {
      title: "Tamil Nadu's Charming Hill Town",
      imageUrl:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800",
    },
    {
      title: "Quaint Little Hill Station in Gujarat",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800",
    },
    {
      title: "A pleasant summer retreat",
      imageUrl:
        "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=800",
    },
  ];

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setloading(true);

        const hoteldata = await getHotels();
        sethotel(hoteldata);

        const flightdata = await getFlights();
        setflight(flightdata);
      } catch (error) {
        console.error("Failed to load flights/hotels:", error);
      } finally {
        setloading(false);
      }
    };

    fetchdata();
  }, []);

  const cityOptions = useMemo(() => {
    const cities = new Set<string>();
    flight.forEach((flight) => {
      cities.add(flight.from);
      cities.add(flight.to);
    });
    hotel.forEach((hotel) => {
      cities.add(hotel.location);
    });
    return Array.from(cities).map((city) => ({ value: city, label: city }));
  }, [flight, hotel]);

  if (loading) {
    return <Loader />;
  }
  const handlesearch = () => {
    if (bookingtype === "flights") {
      const results = flight.filter(
        (FLIGHT) =>
          FLIGHT.from.toLowerCase() === from.toLowerCase() &&
          FLIGHT.to.toLowerCase() === to.toLowerCase(),
      );
      setsearchresult(results);
    } else if (bookingtype === "hotels") {
      const results = hotel.filter(
        (hotel) => hotel.location.toLowerCase() === to.toLowerCase(),
      );
      setsearchresult(results);
    }
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleString("en-US", options);
  };

  const handlebooknow = (id: any) => {
    if (bookingtype === "flights") {
      router.push(`/book-flight/${id}`);
    } else {
      router.push(`/book-hotel/${id}`);
    }
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80")',
      }}
    >
      <main className="container mx-auto px-4 py-6">
        <nav className="bg-white rounded-xl shadow-lg mx-auto max-w-5xl mb-6 p-4 overflow-x-auto">
          <div className="flex justify-between items-center min-w-max space-x-8">
            <NavItem
              icon={<Plane />}
              text="Flights"
              active={bookingtype === "flights"}
              onClick={() => setbookingtype("flights")}
            />
            <NavItem
              icon={<Hotel />}
              text="Hotels"
              active={bookingtype === "hotels"}
              onClick={() => setbookingtype("hotels")}
            />
            <NavItem icon={<HomeIcon />} text="Homestays" />
            <NavItem icon={<Umbrella />} text="Holiday" />
            <NavItem icon={<Train />} text="Trains" />
            <NavItem icon={<Bus />} text="Buses" />
            <NavItem icon={<Car />} text="Cabs" />
            <NavItem icon={<CreditCard />} text="Forex" />
            <NavItem icon={<Shield />} text="Insurance" />
          </div>
        </nav>

        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-3 shadow-xl ring-1 ring-gray-200">
          <div className="grid grid-cols-1 items-stretch md:grid-cols-2 lg:grid-cols-5">
            {/* FROM */}
            {bookingtype === "flights" && (
              <div className="border-b border-gray-200 text [-10px] px-4 py-3 lg:border-b-0 lg:border-r">
                <SearchSelect
                  option={cityOptions}
                  placeholder="From"
                  value={from}
                  onchange={setfrom}
                  icon={<MapPin className="text-blue-600" />}
                  subtitle="Enter city or airport"
                />
              </div>
            )}

            {/* TO / CITY */}
            <div className="border-b border-gray-200 px-4 py-3 lg:border-b-0 lg:border-r">
              <SearchSelect
                option={cityOptions}
                placeholder={bookingtype === "flights" ? "To" : "City"}
                value={to}
                onchange={setto}
                icon={<MapPin className="text-blue-600" />}
                subtitle={
                  bookingtype === "flights"
                    ? "Enter city or airport"
                    : "Enter city"
                }
              />
            </div>

            {/* DATE */}
            <div className="border-b border-gray-200 px-4 py-3 lg:border-b-0 lg:border-r">
              <SearchInput
                icon={<Calendar className="text-blue-600" />}
                placeholder="Date"
                value={date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setdate(e.target.value)
                }
                subtitle="Select a date"
                type="date"
              />
            </div>

            {/* TRAVELERS */}
            <div className="border-b border-gray-200 px-4 py-3 lg:border-b-0 lg:border-r">
              <SearchInput
                icon={<Users className="text-blue-600" />}
                placeholder="Travelers"
                value={travelers.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  settravelers(parseInt(e.target.value) || 1)
                }
                subtitle="Number of travelers"
                type="number"
              />
            </div>

            {/* SEARCH */}
            <div className="flex items-center p-2">
              <Button
                className="h-full min-h-[64px] w-full rounded-xl bg-black font-bold text-white shadow-md transition-all"
                onClick={handlesearch}
              >
                SEARCH
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Search Results
            </h2>
            {searchresults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchresults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white text-black rounded-lg shadow p-4 border border-gray-200"
                  >
                    {bookingtype === "flights" ? (
                      <>
                        <p className="text-black text-lg">
                          Flight Name: {result.flightName}
                        </p>

                        <h3 className="text-black">
                          {result.from} to {result.to}
                        </h3>

                        <p className="text-black">
                          Departure Time: {result.departureTime}
                        </p>

                        <p className="text-black">
                          Arrival Time: {result.arrivalTime}
                        </p>

                        <p className="text-lg text-black font-bold mt-2">
                          ₹{result.price}
                        </p>

                        <Button
                          className="w-full mt-4"
                          onClick={() => handlebooknow(result.id)}
                        >
                          Book Now
                        </Button>
                      </>
                    ) : (
                      <>
                        <h3 className="font-semibold text-lg">
                          {result.hotelName}
                        </h3>
                        <p className="text-gray-600">City: {result.location}</p>
                        <p className="text-lg font-bold mt-2">
                          ₹{result.pricePerNight} per night
                        </p>
                        <Button
                          className="w-full mt-4"
                          onClick={() => handlebooknow(result.id)}
                        >
                          Book Now
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No {bookingtype} available for the selected criteria.
              </p>
            )}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          {/* Offers Section */}
          <section className="my-16">
            <h2 className="text-2xl font-bold mb-8 text-white">Best Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer, index) => (
                <OfferCard key={index} {...offer} />
              ))}
            </div>
          </section>

          {/* Collections Section */}
          <section className="my-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Handpicked Collections for You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collections.map((collection, index) => (
                <CollectionCard key={index} {...collection} />
              ))}
            </div>
          </section>

          {/* Wonders Section */}
          <section className="my-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Unlock Lesser-Known <span></span> Wonders of India
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wonders.map((wonder, index) => (
                <WonderCard key={index} {...wonder} />
              ))}
            </div>
          </section>

          {/* Download App Section */}
          <DownloadApp />
        </div>
      </main>
    </div>
  );
}
const OfferCard = ({ title, description, imageUrl }: any) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Book Now
        </button>
      </div>
    </div>
  );
};

const CollectionCard = ({ title, imageUrl, tag }: any) => {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-lg">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">
        <div className="absolute top-4 left-4">
          <span className="bg-white text-black text-sm font-semibold px-2 py-1 rounded">
            {tag}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
      </div>
    </div>
  );
};
const DownloadApp = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto my-12">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold mb-2">Download App Now!</h3>
          <p className="text-gray-600 mb-4">
            Get India's #1 travel super app with best deals on flights
          </p>
          <div className="flex space-x-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
              alt="App Store"
              className="h-10"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Play Store"
              className="h-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <QrCode className="w-24 h-24" />
          <p className="text-sm text-gray-600">
            Scan QR code to download the app
          </p>
        </div>
      </div>
    </div>
  );
};

const WonderCard = ({ title, imageUrl }: any) => {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-lg">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
      </div>
    </div>
  );
};
function NavItem({ icon, text, active = false, onClick }: any) {
  return (
    <button
      className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
        active ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm mt-1 whitespace-nowrap">{text}</span>
    </button>
  );
}

function SearchInput({
  icon,
  placeholder,
  value,
  onChange,
  subtitle,
  type = "text",
}: any) {
  return (
    <div className="border rounded-lg p-3 hover:border-blue-500 cursor-pointer h-full">
      <div className="flex items-center space-x-2">
        {icon}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-500 truncate">{placeholder}</div>
          <input
            type={type}
            value={value}
            onChange={onChange}
            className="font-semibold w-full bg-transparent outline-none"
            placeholder={placeholder}
          />
          <div className="text-xs text-gray-400 truncate">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
