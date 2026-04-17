// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

// Import Swiper styles
import 'swiper/css';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';

import { bannerLists } from '../utils';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

/* ── Gradient overlay colors per slide ───────────────────── */
const gradients = [
    "from-amber-500 via-orange-500 to-rose-500",
    "from-indigo-600 via-blue-600 to-cyan-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
];

const HeroBanner = () => {
    return (
        <div className="relative">
            <Swiper
                grabCursor={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                navigation
                modules={[Pagination, EffectFade, Navigation, Autoplay]}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                slidesPerView={1}
            >
                {bannerLists.map((item, i) => (
                    <SwiperSlide key={item.id}>
                        <div
                            className={`relative overflow-hidden sm:h-[520px] h-[400px] bg-gradient-to-br ${gradients[i % gradients.length]}`}
                        >
                            {/* Decorative circles */}
                            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-sm" />
                            <div className="absolute bottom-10 -left-10 h-48 w-48 rounded-full bg-white/10 blur-sm" />

                            <div className="relative flex items-center justify-center h-full lg:px-20 px-6">
                                {/* Text side */}
                                <div className="hidden lg:flex flex-col justify-center w-1/2 pr-8">
                                    <span className="inline-block w-fit px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-xs font-semibold uppercase tracking-wider mb-4">
                                        {item.title}
                                    </span>
                                    <h1 className="text-5xl xl:text-6xl text-white font-bold leading-tight">
                                        {item.subtitle}
                                    </h1>
                                    <p className="text-white/80 text-lg mt-4 max-w-md">
                                        {item.description}
                                    </p>
                                    <Link
                                        to="/products"
                                        className="group mt-8 inline-flex items-center gap-2 w-fit
                                            bg-white text-slate-800 font-semibold
                                            px-7 py-3.5 rounded-xl shadow-xl shadow-black/10
                                            transition-all duration-300
                                            hover:shadow-2xl hover:shadow-black/20 hover:scale-[1.03]"
                                    >
                                        Shop Now
                                        <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </div>

                                {/* Image side */}
                                <div className="w-full lg:w-1/2 flex justify-center items-center p-4">
                                    <img
                                        src={item?.image}
                                        alt={item.subtitle}
                                        className="max-h-[340px] sm:max-h-[400px] object-contain drop-shadow-2xl
                                            transition-transform duration-700 hover:scale-105"
                                    />
                                </div>

                                {/* Mobile text overlay */}
                                <div className="lg:hidden absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                                        {item.title}
                                    </span>
                                    <h2 className="text-2xl text-white font-bold mt-1">
                                        {item.subtitle}
                                    </h2>
                                    <Link
                                        to="/products"
                                        className="inline-flex items-center gap-2 mt-3 bg-white text-slate-800 font-semibold px-5 py-2 rounded-lg text-sm shadow-lg"
                                    >
                                        Shop Now
                                        <FaArrowRight className="text-xs" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default HeroBanner;