import { FaShieldAlt, FaTruck, FaHeadset, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProductCard from "./shared/ProductCard";

const products = [
    {
        image: "https://placehold.co/600x400",
        productName: "iPhone 13 Pro Max",
        description:
          "The iPhone 13 Pro Max offers exceptional performance with its A15 Bionic chip, stunning Super Retina XDR display, and advanced camera features for breathtaking photos.",
        specialPrice: 720,
        price: 780,
      },
      {
        image: "https://placehold.co/600x400",
        productName: "Samsung Galaxy S21",
        description:
          "Experience the brilliance of the Samsung Galaxy S21 with its vibrant AMOLED display, powerful camera, and sleek design that fits perfectly in your hand.",
        specialPrice: 699,
        price: 799,
      },
      {
        image: "https://placehold.co/600x400",
        productName: "Google Pixel 6",
        description:
          "The Google Pixel 6 boasts cutting-edge AI features, exceptional photo quality, and a stunning display, making it a perfect choice for Android enthusiasts.",
        price: 599,
        specialPrice: 400,
      }
];

const features = [
    {
        icon: FaShieldAlt,
        title: "Secure Shopping",
        description: "Your data is protected with enterprise-grade security and encryption.",
        color: "from-indigo-500 to-violet-500",
    },
    {
        icon: FaTruck,
        title: "Fast Delivery",
        description: "We ensure prompt delivery to your doorstep with real-time tracking.",
        color: "from-emerald-500 to-teal-500",
    },
    {
        icon: FaHeadset,
        title: "24/7 Support",
        description: "Our support team is always ready to help you with any questions.",
        color: "from-amber-500 to-orange-500",
    },
    {
        icon: FaStar,
        title: "Quality Products",
        description: "Every product is carefully curated and quality-checked before listing.",
        color: "from-rose-500 to-pink-500",
    },
];

const About = () => {
    return (
        <div>
            {/* ─── Hero Section ────────────────────────── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 py-20 sm:py-28">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Text */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
                                About E-Shop
                            </span>
                            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
                                Shopping Made{" "}
                                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                                    Simple & Elegant
                                </span>
                            </h1>
                            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                                Welcome to E-Shop! We are dedicated to providing the best
                                products and services. Our mission is to offer a seamless
                                shopping experience while ensuring the highest quality of
                                our offerings.
                            </p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-7 py-3.5
                                    bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold
                                    rounded-xl shadow-xl shadow-indigo-500/25
                                    transition-all duration-300
                                    hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-[1.03]"
                            >
                                Explore Products
                            </Link>
                        </div>

                        {/* Image */}
                        <div className="w-full lg:w-1/2">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 ring-1 ring-white/10">
                                <img
                                    src="https://embarkx.com/sample/placeholder.png"
                                    alt="About Us"
                                    className="w-full h-auto transition-transform duration-500 hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Features Grid ───────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 py-20">
                <div className="text-center mb-14">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
                        What Sets Us Apart
                    </h2>
                    <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto" />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feat, i) => (
                        <div
                            key={i}
                            className="group relative rounded-2xl border border-slate-200 bg-white p-6
                                shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl
                                bg-gradient-to-br ${feat.color} shadow-lg mb-5
                                transition-transform duration-300 group-hover:scale-110`}
                            >
                                <feat.icon className="text-xl text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">{feat.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Featured Products ───────────────────── */}
            <div className="bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 py-20">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4">
                            Featured
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
                            Our Products
                        </h2>
                        <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <ProductCard
                                key={index}
                                image={product.image}
                                productName={product.productName}
                                description={product.description}
                                specialPrice={product.specialPrice}
                                price={product.price}
                                about
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;