import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  addToCart as apiAddToCart,
  createCart as apiCreateCart,
  getCart as apiGetCart,
  updateCartLine,
} from "../api/cart.api";
import type { CartType } from "../types/Cart.type";

type CartContextType = {
  cart: CartType | undefined;
  loading: boolean;
  addToCart: (variantGid: string, quantity?: number) => Promise<boolean>;
  refreshCart: () => Promise<void>;
  updateQuantity: (
    lineId: string,
    quantity: number,
    variantGid: string
  ) => Promise<void>;
  messageAddError: any;
  messageUpdateError: any;
  setMessageAddError: React.Dispatch<React.SetStateAction<string>>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartType>();
  const [loading, setLoading] = useState(false);
  const [messageAddError, setMessageAddError] = useState<string>("");
  const [messageUpdateError, setMessageUpdateError] = useState();

  useEffect(() => {
    const initCart = async () => {
      let storedCartId = localStorage.getItem("cartId");
      if (!storedCartId) {
        storedCartId = await apiCreateCart();
        localStorage.setItem("cartId", storedCartId);
      }
      setCartId(storedCartId);

      const currentCart = await apiGetCart(storedCartId);
      setCart(currentCart);
    };
    initCart();
    refreshCart();
  }, []);

  const refreshCart = async () => {
    if (!cartId) return;
    const currentCart = await apiGetCart(cartId);
    setCart(currentCart);
  };

  const addToCart = async (variantGid: string, quantity = 1) => {
    if (!cartId) throw new Error("No cart id");

    setLoading(true);
    try {
      await apiAddToCart(cartId, variantGid, quantity);
      await refreshCart();
      return true;
    } catch (err: any) {
      setMessageAddError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    lineId: string,
    quantity: number,
    variantGid: string
  ) => {
    if (!cartId) return;
    setLoading(true);
    try {
      await updateCartLine(cartId, lineId, variantGid, quantity);
      await refreshCart();
      setMessageUpdateError(undefined);
    } catch (err: any) {
      setMessageUpdateError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        refreshCart,
        updateQuantity,
        messageAddError,
        messageUpdateError,
        setMessageAddError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
