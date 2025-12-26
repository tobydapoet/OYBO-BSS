import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { formatMoney } from "../utils/formatMoney";
import { Minus, Plus } from "lucide-react";

function Cartpage() {
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
    <div className="px-5">
      <div className="flex justify-between items-center ">
        <div className="text-5xl font-semibold mt-10">Your cart</div>
        <button className="border hover:bg-amber-200 cursor-pointer">
          Continue shopping
        </button>
      </div>
      <div className="flex gap-5">
        <div className="grid lg:grid-cols-12 gap-theme mt-8">
          <div className="hidden lg:block lg:col-span-8 border-b pb-10">
            <div className="hidden lg:grid lg:grid-cols-12 lg:gap-theme items-end">
              <p className="lg:col-span-8 justify-self-start">Product</p>
              <p className="lg:col-span-2 justify-self-start">Quantity</p>
              <p className="lg:col-span-2 justify-self-end">Total</p>
            </div>
          </div>
          {cart &&
            cart.lines.edges.map((variant) => (
              <div
                className={`lg:col-span-8 ${loading && "opacity-50 cursor-not-allowed pointer-events-none "}`}
              >
                <div className="flex-auto flex flex-col ">
                  <form action="/cart" method="post" id="cart">
                    <div className="py-4 flex-auto overflow-hidden overflow-y-auto border-t-theme border-scheme-border">
                      <ul className="grid grid-cols-1 gap-5">
                        <li className="grid grid-cols-3 gap-2 auto-rows-max lg:grid-cols-12 lg:gap-5">
                          <div className="col-span-1 lg:col-span-2">
                            <a
                              href={`/products/${variant.node.merchandise.product.handle}?variant=${variant.node.id}`}
                              className="block"
                              aria-hidden="true"
                            >
                              <img
                                src={
                                  variant.node.merchandise.product.images
                                    .edges[0].node.url
                                }
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="col-span-2 lg:col-span-5">
                            <a
                              className="block"
                              href={`/products/${variant.node.merchandise.product.handle}?variant=${variant.node.id}`}
                            >
                              <div data-product-title="">
                                <p className="text-base leading-5 lg:leading-6 wrap-break-word">
                                  {variant.node.merchandise.product.title}
                                </p>

                                <p className="text-sm mt-1 wrap-break-word">
                                  {variant.node.merchandise.title}
                                </p>
                              </div>

                              <div className="lg:hidden">
                                <p className="mt-1 text-xs">
                                  {formatMoney(
                                    variant.node.merchandise.price.amount
                                  )}
                                </p>
                              </div>

                              <div className="hidden lg:block text-xs mt-1">
                                {formatMoney(
                                  variant.node.merchandise.price.amount
                                )}
                              </div>
                            </a>

                            <div className="lg:hidden my-3">
                              <label className="sr-only">Quantity:</label>
                              <div className="flex border justify-between w-60 items-center px-1 py-1">
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
                                    quantities[variant.node.id] ??
                                    variant.node.quantity
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
                            </div>

                            <div className="mt-2">
                              <div
                                className="underline decoration-2 mt-2 text-xs cursor-pointer"
                                onClick={() =>
                                  updateQuantity(
                                    variant.node.id,
                                    0,
                                    variant.node.merchandise.id
                                  )
                                }
                              >
                                Remove
                              </div>
                            </div>
                            {messageUpdateError && (
                              <div className="text-xs mt-2">
                                {messageUpdateError.message}
                              </div>
                            )}
                          </div>

                          <div className="hidden lg:block lg:col-span-2 w-full ml-10">
                            <label className="sr-only">Quantity:</label>
                            <div className="flex border justify-between w-35 items-center px-1 py-1">
                              <Minus
                                strokeWidth={2}
                                className="cursor-pointer"
                                size={17}
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
                                  quantities[variant.node.id] ??
                                  variant.node.quantity
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
                                size={17}
                                onClick={() =>
                                  updateQuantity(
                                    variant.node.id,
                                    variant.node.quantity + 1,
                                    variant.node.merchandise.id
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="hidden lg:block lg:col-span-3 text-right">
                            <p className="mt-1">
                              {formatMoney(
                                String(
                                  Number(
                                    variant.node.merchandise.price.amount
                                  ) * variant.node.quantity
                                )
                              )}
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </form>
                </div>
              </div>
            ))}

          <div className="lg:w-109 lg:ml-10">
            {cart && (
              <>
                <div className="border-t">
                  <div className="font-medium mb-2 pt-4">
                    Add a note to your order
                  </div>
                  <textarea className="w-full outline-0 border p-2 text-sm min-h-15" />
                </div>
                <div className="py-4">
                  <div className="flex justify-between font-medium">
                    <span className="font-extralight">Subtotal</span>
                    <span>{formatMoney(String(totalPrice()))}</span>
                  </div>
                </div>

                <div className="pb-4 w-full">
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
      </div>
    </div>
  );
}

export default Cartpage;
