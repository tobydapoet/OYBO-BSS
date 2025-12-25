import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { formatMoney } from "../utils/formatMoney";

type MiniCartProps = {
  onClose: () => void;
  isOpen?: boolean;
};

function MiniCart({ onClose, isOpen = true }: MiniCartProps) {
  useEffect(() => {
    const fetchCollections = async () => {};
    fetchCollections();
  }, []);
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});

  const { cart, updateQuantity, loading, messageUpdateError } = useCart();

  const totalPrice = () => {
    if (!cart) return 0;
    return cart.lines.edges.reduce((sum, variant) => {
      const price = Number(variant.node.merchandise.price.amount);
      const quantity = variant.node.quantity;
      return sum + price * quantity;
    }, 0);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-100 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-90" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 bottom-0 z-120 h-screen bg-white w-full max-w-sm transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex w-full justify-between p-3 shrink-0">
          <div className="p-1">Your cart</div>
          <div className="flex items-center justify-between">
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
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart ? (
            <>
              {cart.lines.edges.map((variant) => (
                <div
                  key={variant.node.id}
                  className={`${loading && "opacity-50 cursor-not-allowed pointer-events-none "}`}
                >
                  <div className="flex p-5 gap-5">
                    <img
                      src={
                        variant.node.merchandise.product.images.edges[0].node
                          .url
                      }
                      className="w-30"
                    />
                    <div className="w-full">
                      <div className="font-thin text-base">
                        {variant.node.merchandise.product.title}
                      </div>
                      <div className="font-thin text-xs mt-2">
                        {variant.node.merchandise.title}
                      </div>
                      <div className="flex justify-between w-full mt-1">
                        <div className="font-thin text-xs">
                          {formatMoney(variant.node.merchandise.price.amount)}
                        </div>
                        <div className="font-thin text-xs">
                          {formatMoney(
                            (
                              Number(variant.node.merchandise.price.amount) *
                              variant.node.quantity
                            ).toString()
                          )}
                        </div>
                      </div>
                      <div className="flex border justify-between w-35 mt-5 items-center px-1 py-1">
                        <Minus
                          strokeWidth={2}
                          className="cursor-pointer"
                          size={12}
                          onClick={() =>
                            updateQuantity(
                              variant.node.id,
                              variant.node.quantity - 1,
                              variant.node.merchandise.id
                            )
                          }
                        />
                        <input
                          className="text-xs w-20 outline-0 text-center"
                          value={
                            quantities[variant.node.id] ?? variant.node.quantity
                          }
                          onChange={(e) =>
                            setQuantities((prev) => ({
                              ...prev,
                              [variant.node.id]: Number(e.target.value),
                            }))
                          }
                          onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                              await updateQuantity(
                                variant.node.id,
                                quantities[variant.node.id] ??
                                  variant.node.quantity,
                                variant.node.merchandise.id
                              );
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                        />
                        <Plus
                          className="cursor-pointer"
                          strokeWidth={2}
                          size={12}
                          onClick={() =>
                            updateQuantity(
                              variant.node.id,
                              variant.node.quantity + 1,
                              variant.node.merchandise.id
                            )
                          }
                        />
                      </div>
                      <div
                        className="underline decoration-2 mt-2 text-xs cursor-pointer"
                        onClick={() =>
                          updateQuantity(
                            variant.node.id,
                            variant.node.quantity - 1,
                            variant.node.merchandise.id
                          )
                        }
                      >
                        Remove
                      </div>
                      {messageUpdateError && (
                        <div className="text-xs mt-2">
                          {messageUpdateError.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full mb-5">
              <div>Your cart is currently empty.</div>
              <button className="cursor-pointer text-white bg-black hover:bg-amber-200 hover:text-black py-1 px-2 mt-2 mb-10">
                Continue shopping
              </button>
            </div>
          )}
        </div>

        <div className="mt-auto shrink-0">
          {cart && (
            <>
              <div className="border-t mx-4">
                <div className="font-medium mb-2 pt-4">
                  Add a note to your order
                </div>
                <textarea className="w-full outline-0 border p-2 text-sm min-h-15" />
              </div>
              <div className="p-4">
                <div className="flex justify-between font-medium">
                  <span className="font-extralight">Subtotal</span>
                  <span>{formatMoney(String(totalPrice()))}</span>
                </div>
              </div>

              <div className="px-4 pb-4 w-full">
                <a
                  href={cart.checkoutUrl}
                  className="w-full block text-white bg-black hover:bg-amber-200 hover:text-black font-medium transition-colors text-center py-1"
                >
                  Checkout
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MiniCart;
