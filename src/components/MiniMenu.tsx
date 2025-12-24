import { Search, ShoppingBag, User, X, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import type { SplitCollectionsResult } from "../types/Collection.type";
import { getCollectionsByKeyword } from "../api/collection.api";
import { splitCollectionsByPrefix } from "../utils/splitCollectionts";

type MiniMenuProps = {
  onClose: () => void;
  isOpen?: boolean;
};

function MiniMenu({ onClose, isOpen = true }: MiniMenuProps) {
  const [expandedSections, setExpandedSections] = useState<{
    man: boolean;
    woman: boolean;
  }>({
    man: false,
    woman: false,
  });

  const [expandedSecondary, setExpandedSecondary] = useState<{
    man: boolean;
    woman: boolean;
  }>({
    man: false,
    woman: false,
  });

  const [collections, setCollections] = useState<{
    man: SplitCollectionsResult;
    woman: SplitCollectionsResult;
  }>({
    man: { primary: [], secondary: [] },
    woman: { primary: [], secondary: [] },
  });

  useEffect(() => {
    const fetchCollections = async () => {
      const resMan = await getCollectionsByKeyword("MAN");
      const resWoman = await getCollectionsByKeyword("WOMAN");
      const splitCollectionsMan = splitCollectionsByPrefix(resMan, "MAN");
      const splitCollectionsWoman = splitCollectionsByPrefix(resWoman, "WOMAN");
      setCollections({
        man: splitCollectionsMan,
        woman: splitCollectionsWoman,
      });
    };

    fetchCollections();
  }, []);

  const toggleSection = (section: "man" | "woman") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSecondary = (section: "man" | "woman") => {
    setExpandedSecondary((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const token = Cookies.get("shopifyCustomerToken");
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-0 z-50 bg-white transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mt-4 px-4 py-3">
          <button
            onClick={onClose}
            className="rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X
              className="w-6 h-6 ml-3 cursor-pointer"
              color="#000000"
              strokeWidth={1.5}
            />
          </button>

          <div className="flex items-center space-x-4">
            <button className="rounded-full cursor-pointer" aria-label="Search">
              <Search className="w-5" strokeWidth={1} />
            </button>

            <button
              className="rounded-full cursor-pointer"
              aria-label="Account"
            >
              <User
                className="w-5 cursor-pointer"
                strokeWidth={1}
                onClick={() => {
                  if (token) {
                    navigate("/profile");
                  } else {
                    navigate("/login");
                  }
                  onClose();
                }}
              />
            </button>

            <button
              className="rounded-full relative cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5" strokeWidth={1} />
            </button>
          </div>
        </div>

        <div className="p-7 mt-3">
          <button
            onClick={() => toggleSection("man")}
            className="flex items-center justify-between w-full text-left py-1"
          >
            <h2 className="font-semibold uppercase tracking-wide text-2xl hover:underline">
              MAN
            </h2>
            {!expandedSections.man ? (
              <Plus strokeWidth={1.5} className="cursor-pointer w-5 h-5" />
            ) : (
              <Minus strokeWidth={1.5} className="cursor-pointer w-5 h-5" />
            )}
          </button>

          {expandedSections.man && (
            <div className="mt-2 space-y-1 pl-4">
              {collections.man.primary.length > 0 && (
                <div className="space-y-2">
                  <div>
                    {collections.man.primary.map((item, index) => (
                      <a
                        key={index}
                        href={`/collections/${item.handle}`}
                        className="block text-orange-600 hover:underline text-xs uppercase tracking-wide py-1"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {collections.man.secondary.length > 0 && (
                <div className="space-y-2">
                  {collections.man.secondary.length > 0 && (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleSecondary("man")}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <a
                          href={`/collections/${collections.man.secondary[0].handle}`}
                          className="font-semibold hover:text-black hover:underline text-xs uppercase tracking-wide py-1"
                        >
                          {collections.man.secondary[0].label}
                        </a>
                        {expandedSecondary.man ? (
                          <Minus
                            strokeWidth={1.5}
                            className="cursor-pointer w-5 h-5"
                          />
                        ) : (
                          <Plus
                            strokeWidth={1.5}
                            className="cursor-pointer w-5 h-5"
                          />
                        )}
                      </button>

                      {expandedSecondary.man &&
                        collections.man.secondary
                          .slice(1)
                          .map((item, index) => (
                            <a
                              key={index + 1}
                              href={`/collections/${item.handle}`}
                              className="block text-gray-600 hover:text-black hover:underline text-xs uppercase tracking-wide py-1 ml-1"
                            >
                              {item.label}
                            </a>
                          ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => toggleSection("woman")}
            className="flex items-center justify-between w-full text-left py-2"
          >
            <h2 className="font-semibold uppercase tracking-wide text-2xl hover:underline">
              WOMAN
            </h2>
            {!expandedSections.woman ? (
              <Plus strokeWidth={1.5} className="cursor-pointer w-5 h-5" />
            ) : (
              <Minus strokeWidth={1.5} className="cursor-pointer w-5 h-5" />
            )}
          </button>

          {expandedSections.woman && (
            <div className="space-y-1 pl-4 ">
              {collections.woman.primary.length > 0 && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    {collections.woman.primary.map((item, index) => (
                      <a
                        key={index}
                        href={`/collections/${item.handle}`}
                        className="block text-orange-600 hover:text-orange-700 hover:underline text-xs uppercase tracking-wide py-1"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {collections.woman.secondary.length > 0 && (
                <div className="">
                  {collections.woman.secondary.length > 0 && (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleSecondary("woman")}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <a
                          href={`/collections/${collections.woman.secondary[0].handle}`}
                          className="font-semibold text-xs hover:text-black hover:underline uppercase tracking-wide py-1"
                        >
                          {collections.woman.secondary[0].label}
                        </a>
                        {expandedSecondary.woman ? (
                          <Minus
                            strokeWidth={1.5}
                            className="w-4 h-4 ml-2 cursor-pointer"
                          />
                        ) : (
                          <Plus
                            strokeWidth={1.5}
                            className="w-4 h-4 ml-2 cursor-pointer"
                          />
                        )}
                      </button>

                      {expandedSecondary.woman &&
                        collections.woman.secondary
                          .slice(1)
                          .map((item, index) => (
                            <a
                              key={index + 1}
                              href={`/collections/${item.handle}`}
                              className="block text-gray-600 hover:text-black hover:underline text-xs uppercase tracking-wide py-1 ml-1"
                            >
                              {item.label}
                            </a>
                          ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 border-gray-200 mt-2">
            <a
              href="/blogs/stories"
              className="font-semibold text-xs hover:text-black hover:underline block uppercase tracking-wide"
            >
              STORIES
            </a>
            <a
              href="/pages/about"
              className="font-semibold text-xs hover:text-black hover:underline block uppercase tracking-wide"
            >
              ABOUT
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default MiniMenu;
