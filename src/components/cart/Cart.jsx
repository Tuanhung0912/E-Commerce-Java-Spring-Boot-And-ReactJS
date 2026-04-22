import { MdArrowBack, MdShoppingCart, MdDeleteSweep } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ItemContent from "./ItemContent";
import CartEmpty from "./CartEmpty";
import { formatPrice } from "../utils/formatPrice";
import { clearAllCart } from "../../store/actions";
import toast from "react-hot-toast";

const Cart = () => {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.carts);
    const newCart = { ...cart };

    newCart.totalPrice = cart?.reduce(
        (acc, cur) => acc + Number(cur?.specialPrice) * Number(cur?.quantity), 0
    );

    const handleClearAll = () => {
        toast((t) => (
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <MdDeleteSweep className="text-red-600 text-xl" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-800">Clear all items?</p>
                    <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone</p>
                </div>
                <div className="flex gap-2 ml-2">
                    <button
                        onClick={() => { toast.dismiss(t.id); }}
                        className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { toast.dismiss(t.id); dispatch(clearAllCart(toast)); }}
                        className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>
        ), { duration: 6000, style: { padding: '12px 16px', borderRadius: '16px', maxWidth: '480px' } });
    };

    if (!cart || cart.length === 0) return <CartEmpty />;

    return (
        <div className="lg:px-14 sm:px-8 px-4 py-10">
            <div className="flex flex-col items-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <MdShoppingCart size={36} className="text-gray-700" />
                    Your Cart
                </h1>
                <p className="text-lg text-gray-600 mt-2">All your selected items</p>
            </div>

            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">
                    {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
                </p>
                <button
                    onClick={handleClearAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                        text-red-600 border border-red-200 bg-red-50
                        hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                >
                    <MdDeleteSweep className="text-base" />
                    Clear All
                </button>
            </div>

            <div className="grid md:grid-cols-5 grid-cols-4 gap-4 pb-2 font-semibold items-center">
                <div className="md:col-span-2 justify-self-start text-lg text-slate-800 lg:ps-4">
                    Product
                </div>

                <div className="justify-self-center text-lg text-slate-800">
                    Price
                </div>

                <div className="justify-self-center text-lg text-slate-800">
                    Quantity
                </div>

                <div className="justify-self-center text-lg text-slate-800">
                    Total
                </div>
            </div>

            <div>
                {cart && cart.length > 0 &&
                    cart.map((item, i) => <ItemContent key={i} {...item}/>)}
            </div>

            <div className="border-t-[1.5px] border-slate-200 py-4 flex sm:flex-row sm:px-0 px-2 flex-col sm:justify-between gap-4">
                <div></div>
                <div className="flex text-sm gap-1 flex-col">
                    <div className="flex justify-between w-full md:text-lg text-sm font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(newCart?.totalPrice)}</span>
                    </div>

                    <p className="text-slate-500">
                        Taxes and shipping calculated at checkout
                    </p>

                    <Link className="w-full flex justify-end" to="/checkout">
                    <button
                        onClick={() => {}}
                        className="font-semibold w-[300px] py-2 px-4 rounded-sm bg-blue-500 text-white flex items-center justify-center gap-2 hover:text-gray-300 transition duration-500">
                        <MdShoppingCart size={20} />
                        Checkout
                    </button>
                    </Link>

                    <Link className="flex gap-2 items-center mt-2 text-slate-500" to="/products">
                        <MdArrowBack />
                        <span>Continue Shopping</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;