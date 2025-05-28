import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { 
  addToCart, 
  removeFromCart, 
  incrementQuantity, 
  decrementQuantity,
  updateQuantity, 
  clearCart,
  restoreCart,
  type CartProduct 
} from '@/store/slices/cart/cartSlices';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  // Recovery automático del cart según especificaciones del test
  useEffect(() => {
    const recoverCart = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedCart = localStorage.getItem('tienda_cart');
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (parsedCart && Array.isArray(parsedCart.items) && parsedCart.items.length > 0) {
              dispatch(restoreCart(parsedCart));
              toast.success(`Carrito recuperado: ${parsedCart.totalQuantity} productos`, {
                duration: 3000,
                icon: '🛒',
              });
            }
          }
        }
      } catch (error) {
        console.error('Error recovering cart:', error);
      }
    };

    // Solo ejecutar si el cart está vacío
    if (cart.items.length === 0) {
      recoverCart();
    }
  }, [dispatch, cart.items.length]);

  const addProduct = (product: CartProduct) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} agregado al carrito`, {
      duration: 2000,
      icon: '✅',
    });
  };

  const removeProduct = (productId: string) => {
    const item = cart.items.find(item => item.id === productId);
    if (item) {
      dispatch(removeFromCart(productId));
      toast.success(`${item.name} removido del carrito`, {
        duration: 2000,
        icon: '🗑️',
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return {
    items: cart.items,
    totalQuantity: cart.totalQuantity,
    totalAmount: cart.totalAmount,
    isEmpty: cart.items.length === 0,
    
    addProduct,
    removeProduct,
    incrementItem: (productId: string) => dispatch(incrementQuantity(productId)),
    decrementItem: (productId: string) => dispatch(decrementQuantity(productId)),
    updateQuantity: (productId: string, quantity: number) => 
      dispatch(updateQuantity({ productId, quantity })),
    clearAll: () => {
      dispatch(clearCart());
      toast.success('Carrito limpiado', {
        duration: 2000,
        icon: '🧹',
      });
    },
    
    // Helpers
    formatPrice,
    getItemQuantity: (productId: string) => {
      const item = cart.items.find(item => item.id === productId);
      return item ? item.quantity : 0;
    },
    isInCart: (productId: string) => cart.items.some(item => item.id === productId),
  };
};
