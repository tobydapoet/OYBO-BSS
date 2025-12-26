import { useState } from "react";
import { useCart } from "../contexts/CartContext";

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
    <div>
      <div className="flex justify-between items-center">
        <div className="text-5xl font-semibold">Your cart</div>
        <button className="border hover:bg-amber-200 cursor-pointer">
          Continue shopping
        </button>
      </div>
      <div className="grid lg:grid-cols-12 gap-theme mt-8">
        <div className="hidden lg:block lg:col-span-8">
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-theme items-end">
            <p className="lg:col-span-8 justify-self-start">Product</p>
            <p className="lg:col-span-2 justify-self-start">Quantity</p>
            <p className="lg:col-span-2 justify-self-end">Total</p>
          </div>
        </div>
        {cart &&
          cart.lines.edges.map((variant) => (
            <div className="lg:col-span-8">
              <div className="flex-auto flex flex-col ">
                <form action="/cart" method="post" id="cart">
                  <div className="py-4 flex-auto overflow-hidden overflow-y-auto border-t-theme border-scheme-border">
                    <ul className="grid grid-cols-1 gap-5">
                      <li
                        key="CartItem-1-56376375542105:b14cb1f4b0029bb4e1ee3e2fc6185759"
                        className="grid grid-cols-3 gap-2 auto-rows-max lg:grid-cols-12 lg:gap-5"
                      >
                        <div className="col-span-1 lg:col-span-2">
                          <a
                            href="/products/college-green?variant=56376375542105"
                            className="block"
                            aria-hidden="true"
                          >
                            <img
                              src="//oybo.it/cdn/shop/files/COLLEGE_GREEN-1769.jpg?v=1763025230&amp;width=200"
                              alt=""
                            />
                          </a>
                        </div>
                        <div className="col-span-2 lg:col-span-6">
                          <a
                            className="block"
                            href="/products/college-green?variant=56376375542105"
                          >
                            <div data-product-title="">
                              <p className="text-base leading-5 lg:leading-6 wrap-break-word">
                                COLLEGE GREEN
                              </p>

                              <p className="text-sm mt-1 wrap-break-word">
                                43-46
                              </p>
                            </div>

                            <div className="lg:hidden">
                              <p className="mt-1 text-sm">€28,00</p>
                            </div>

                            <div className="hidden lg:block text-sm mt-1">
                              €28,00
                            </div>
                          </a>
                          <div className="ml-[0.1rem] mt-4 lg:hidden">
                            <label className="sr-only">Quantity:</label>
                            <div className="text-xs grow flex flex-nowrap justify-center items-center rounded-input max-w-[60%] lg:max-w-full">
                              <button
                                className="min-touch-target px-1 self-stretch border-theme border-scheme-text rounded-tl-input rounded-bl-input border-r-0 focus-visible:border-r focus:z-10"
                                aria-label="−"
                              >
                                <div className="w-4 h-4 m-auto">
                                  <svg
                                    className="theme-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linejoin="round"
                                      stroke-width="1.5"
                                      d="M2 12h20"
                                    ></path>
                                  </svg>
                                </div>
                              </button>
                              <input
                                type="number"
                                data-last-value="1"
                                className="text-sm block appearance-none text-center border-y-theme border-x-0 focus:border-x border-scheme-text w-full rounded-none focus:z-10"
                              />
                              <button
                                className="min-touch-target px-1 self-stretch border-theme border-scheme-text rounded-tr-input rounded-br-input border-l-0 focus-visible:border-l focus:z-10"
                                aria-label="+"
                              >
                                <div className="w-4 h-4 m-auto">
                                  <svg
                                    className="theme-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linejoin="round"
                                      stroke-width="1.5"
                                      d="M2 12h20M12 2v20"
                                    ></path>
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>

                          <div className="mt-2">
                            <p className="text-sm">
                              <a
                                className="hover:text-scheme-accent theme-link"
                                href="/cart/change?id=56376375542105:b14cb1f4b0029bb4e1ee3e2fc6185759&amp;quantity=0 wrap-break-word"
                              >
                                Remove
                              </a>
                            </p>
                          </div>

                          <div
                            className="cart-item__error text-scheme-accent mt-2 text-sm hidden"
                            id="Line-item-error-56376375542105:b14cb1f4b0029bb4e1ee3e2fc6185759"
                            role="alert"
                            data-item-title="COLLEGE GREEN - 43-46"
                            data-cart-quantity-error=""
                          ></div>
                        </div>

                        <div className="hidden lg:block lg:col-span-2">
                          <label className="sr-only">Quantity:</label>
                          <div className="text-xs grow flex flex-nowrap justify-center items-center rounded-input max-w-[60%] lg:max-w-full">
                            <button
                              className="min-touch-target px-1 self-stretch border-theme border-scheme-text rounded-tl-input rounded-bl-input border-r-0 focus-visible:border-r focus:z-10"
                              aria-label="−"
                            >
                              <div className="w-4 h-4 m-auto">
                                <svg
                                  className="theme-icon"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M2 12h20"
                                  ></path>
                                </svg>
                              </div>
                            </button>
                            <input
                              type="number"
                              name="updates[]"
                              value="1"
                              data-last-value="1"
                              className="text-sm block appearance-none text-center border-y-theme border-x-0 focus:border-x border-scheme-text w-full rounded-none focus:z-10"
                            />
                            <button
                              className="min-touch-target px-1 self-stretch border-theme border-scheme-text rounded-tr-input rounded-br-input border-l-0 focus-visible:border-l focus:z-10"
                              aria-label="+"
                            >
                              <div className="w-4 h-4 m-auto">
                                <svg
                                  className="theme-icon"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M2 12h20M12 2v20"
                                  ></path>
                                </svg>
                              </div>
                            </button>
                          </div>
                        </div>

                        <div className="hidden lg:block lg:col-span-2 text-right">
                          <p className="mt-1">€28,00</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Cartpage;
