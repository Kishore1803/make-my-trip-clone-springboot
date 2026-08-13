import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-5">
      <div className="mx-auto max-w-7xl px-8 py-14">
        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="mb-5 text-3xl font-bold text-white">
              Why MakeMyTour?
            </h2>

            <p className="leading-8 text-gray-400">
              Established in 2024, MakeMyTour is one of India's leading travel
              booking platforms. Book flights, hotels, buses, trains and holiday
              packages at the best prices with a seamless booking experience.
            </p>
          </div>

          <div>
            <h2 className="mb-5 text-3xl font-bold text-white">
              Booking Flights with MakeMyTour
            </h2>

            <p className="leading-8 text-gray-400">
              Compare airlines, discover the best fares and book domestic or
              international flights in just a few clicks with secure online
              payment.
            </p>
          </div>

          <div>
            <h2 className="mb-5 text-3xl font-bold text-white">
              Domestic Flights with MakeMyTour
            </h2>

            <p className="leading-8 text-gray-400">
              Fly to Delhi, Mumbai, Chennai, Bangalore, Hyderabad, Goa, Kolkata
              and many more cities with exclusive flight offers.
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-5 text-xl font-bold text-white">
              ABOUT THE SITE
            </h3>

            <ul className="space-y-3">
              <li className="cursor-pointer hover:text-white">About Us</li>
              <li className="cursor-pointer hover:text-white">
                Investor Relations
              </li>
              <li className="cursor-pointer hover:text-white">Careers</li>
              <li className="cursor-pointer hover:text-white">Contact Us</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-bold text-white">
              POPULAR HOTELS
            </h3>

            <ul className="space-y-3">
              <li className="cursor-pointer hover:text-white">
                Hotels in Delhi
              </li>
              <li className="cursor-pointer hover:text-white">
                Hotels in Mumbai
              </li>
              <li className="cursor-pointer hover:text-white">Hotels in Goa</li>
              <li className="cursor-pointer hover:text-white">
                Hotels in Chennai
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-bold text-white">QUICK LINKS</h3>

            <ul className="space-y-3">
              <li className="cursor-pointer hover:text-white">
                Flight Schedule
              </li>
              <li className="cursor-pointer hover:text-white">
                Train Schedule
              </li>
              <li className="cursor-pointer hover:text-white">Bus Booking</li>
              <li className="cursor-pointer hover:text-white">
                Holiday Packages
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-bold text-white">
              IMPORTANT LINKS
            </h3>

            <ul className="space-y-3">
              <li className="cursor-pointer hover:text-white">
                Privacy Policy
              </li>
              <li className="cursor-pointer hover:text-white">
                Terms & Conditions
              </li>
              <li className="cursor-pointer hover:text-white">
                User Agreement
              </li>
              <li className="cursor-pointer hover:text-white">Support</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-gray-700 pt-8 md:flex-row">
          <div className="flex gap-5">
            <a
              href="#"
              className="rounded-full border border-gray-600 p-3 transition hover:bg-white hover:text-black"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="rounded-full border border-gray-600 p-3 transition hover:bg-white hover:text-black"
            >
              <FaXTwitter size={20} />
            </a>
            <a
              href="#"
              className="rounded-full border border-gray-600 p-3 transition hover:bg-white hover:text-black"
            >
              <FaLinkedinIn size={20} />
            </a>
            <a
              href="#"
              className="rounded-full border border-gray-600 p-3 transition hover:bg-white hover:text-black"
            >
              <FaFacebookF size={20} />
            </a>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MakeMyTour Pvt. Ltd. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}