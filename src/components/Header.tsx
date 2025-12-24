import { useEffect, useState } from "react";
import { logo } from "../assets/assets";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import MiniMenu from "./MiniMenu";
import { Link, useNavigate } from "react-router-dom";
import RotatingBanner from "./RotatingBanner";
import { getCollectionsByKeyword } from "../api/collection.api";
import { splitCollectionsByPrefix } from "../utils/splitCollectionts";
import Cookies from "js-cookie";
import type { SplitCollectionsResult } from "../types/Collection.type";

type DropdownType = "man" | "woman" | null;

function Header() {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [collections, setCollections] = useState<SplitCollectionsResult>();

  useEffect(() => {
    const fetchCollections = async () => {
      if (activeDropdown === "man") {
        const res = await getCollectionsByKeyword("MAN");
        const spilitCollections = splitCollectionsByPrefix(res, "MAN");
        setCollections(spilitCollections);
      }
    };

    fetchCollections();
  }, [activeDropdown]);

  const handleMouseEnter = (menu: DropdownType): void => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = (): void => {
    setActiveDropdown(null);
  };

  let hoverTimeout: number;

  const handleLeave = () => {
    hoverTimeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleEnter = (menu: DropdownType) => {
    clearTimeout(hoverTimeout);
    setActiveDropdown(menu);
  };

  const token = Cookies.get("shopifyCustomerToken");

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white">
        <RotatingBanner />

        <div className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center px-2">
              <div className="flex-1">
                <img
                  src={logo}
                  alt="OYBO Logo"
                  className="w-19 hidden lg:block cursor-pointer"
                  onClick={() => navigate("/")}
                />
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 block lg:hidden"
                  aria-label="Menu"
                >
                  <Menu className="w-6 h-6 cursor-pointer" />
                </button>
              </div>

              <nav className="hidden lg:flex flex-1 justify-center">
                <ul className="flex uppercase items-center ml-10">
                  <li
                    className="relative"
                    onMouseEnter={() => handleMouseEnter("man")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to="/collections/man"
                      className="flex items-center space-x-1 hover:underline px-2 py-2"
                    >
                      <span>MAN</span>
                    </Link>
                  </li>

                  <li
                    className="relative"
                    onMouseEnter={() => handleMouseEnter("woman")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to="/collections/woman"
                      className="flex items-center space-x-1 hover:underline px-2 py-2"
                    >
                      <span>WOMAN</span>
                    </Link>
                  </li>

                  <li className="px-2 py-2">
                    <a href="/blogs/stories">STORIES</a>
                  </li>

                  <li className="px-2 py-2">
                    <a href="/pages/about">ABOUT</a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex-1 flex justify-end items-center">
              <div className="lg:hidden flex items-center space-x-4">
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <img
                    src={logo}
                    alt="OYBO Logo"
                    className="w-16 cursor-pointer"
                    onClick={() => navigate("/")}
                  />
                </div>

                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  aria-label="Search"
                >
                  <Search strokeWidth={1} className="w-5 h-5" />
                </button>

                <User
                  className="w-5 h-5 cursor-pointer"
                  strokeWidth={1}
                  onClick={() => {
                    if (token) {
                      navigate("/profile");
                    } else {
                      navigate("/login");
                    }
                  }}
                />

                <button className="pr-2 relative">
                  <ShoppingBag className="w-5 h-5" strokeWidth={1} />
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>

              <div className="hidden lg:flex items-center">
                <div className="relative">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 rounded-full transition-colors"
                    aria-label="Search"
                  >
                    SEARCH
                  </button>

                  {isSearchOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="SEARCH"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          autoFocus
                        />
                        <button className="bg-black text-white px-4 py-2 rounded-r-lg hover:bg-gray-800 transition-colors">
                          SEARCH
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="hidden lg:flex items-center space-x-2 p-2 rounded-lg transition-colors cursor-pointer"
                  onClick={() => {
                    if (token) {
                      navigate("/profile");
                    } else {
                      navigate("/login");
                    }
                  }}
                >
                  <span className=" uppercase">
                    {!token ? "LOGIN" : "ACCOUNT"}
                  </span>
                </button>

                <button
                  className="p-2 rounded-full transition-colors relative"
                  aria-label="Wishlist"
                >
                  <span className=" uppercase">WISHLIST</span>
                </button>

                <button
                  className="p-2 rounded-full transition-colors relative"
                  aria-label="Cart"
                >
                  CART(0)
                </button>
              </div>
            </div>
          </div>

          {isSearchOpen && (
            <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  autoFocus
                />
                <button className="bg-black text-white px-4 py-3 rounded-r-lg hover:bg-gray-800 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
        {activeDropdown && collections && (
          <div
            className="absolute w-full left-0 top-full -mt-3.75 shadow-xl z-200 md:pl-26 bg-white"
            onMouseEnter={() => {
              if (activeDropdown === "man") {
                handleEnter("man");
              } else if (activeDropdown == "woman") {
                handleEnter("woman");
              }
            }}
            onMouseLeave={handleLeave}
          >
            <div className="p-6">
              <div className="flex gap-45">
                <div>
                  <ul className="space-y-3">
                    {collections.primary.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={`/collections/${item.handle}`}
                          className={`hover:underline text-orange-600 cursor-pointer `}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <ul className="space-y-3">
                    {collections.secondary.map((item, index) => (
                      <li key={index}>
                        <a
                          href={`/collections/${item.handle}`}
                          className={`hover:underline hover:text-black ${
                            index === 0 ? "font-semibold" : ""
                          }`}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      <MiniMenu
        onClose={() => setIsMobileMenuOpen(false)}
        isOpen={isMobileMenuOpen}
      />
    </>
  );
}

export default Header;
