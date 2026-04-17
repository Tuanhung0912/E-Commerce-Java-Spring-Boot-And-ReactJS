import { FaEnvelope, FaMapMarkedAlt, FaPhone, FaPaperPlane } from "react-icons/fa";

const contactInfo = [
    {
        icon: FaPhone,
        label: "Phone",
        value: "+4 8961 944 149",
        color: "from-emerald-500 to-teal-500",
    },
    {
        icon: FaEnvelope,
        label: "Email",
        value: "example@gmail.com",
        color: "from-indigo-500 to-violet-500",
    },
    {
        icon: FaMapMarkedAlt,
        label: "Address",
        value: "123 Main, Town, USA",
        color: "from-amber-500 to-orange-500",
    },
];

const Contact = () => {
    return (
        <div>
            {/* ─── Hero Banner ─────────────────────────── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
                <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-20 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-5">
                        Get in Touch
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                        Contact{" "}
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            Us
                        </span>
                    </h1>
                    <p className="text-base text-slate-300 max-w-md mx-auto">
                        We would love to hear from you! Fill out the form or reach out directly.
                    </p>
                </div>
            </div>

            {/* ─── Main Content ────────────────────────── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
                <div className="grid lg:grid-cols-5 gap-8 items-start">

                    {/* ─── Contact Form (3/5) ─────────── */}
                    <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white shadow-lg p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-1">Send a Message</h2>
                        <p className="text-sm text-slate-400 mb-6">We'll get back to you as soon as possible.</p>

                        <form className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Your name"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700
                                            placeholder:text-slate-400
                                            focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
                                            transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700
                                            placeholder:text-slate-400
                                            focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
                                            transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    placeholder="How can we help?"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700
                                        placeholder:text-slate-400
                                        focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
                                        transition-all duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Message
                                </label>
                                <textarea
                                    rows="4"
                                    required
                                    placeholder="Write your message here..."
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700
                                        placeholder:text-slate-400 resize-none
                                        focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
                                        transition-all duration-200"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2
                                    px-7 py-3 rounded-xl
                                    bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-sm
                                    shadow-lg shadow-indigo-500/25
                                    transition-all duration-300
                                    hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02]"
                            >
                                <FaPaperPlane className="text-xs" />
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* ─── Contact Info (2/5) ──────────── */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {contactInfo.map((item, i) => (
                            <div
                                key={i}
                                className="group rounded-2xl border border-slate-200 bg-white p-5
                                    shadow-sm transition-all duration-300
                                    hover:shadow-md hover:-translate-y-0.5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                                        bg-gradient-to-br ${item.color} shadow-md
                                        transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        <item.icon className="text-white text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                                            {item.label}
                                        </p>
                                        <p className="text-sm font-medium text-slate-700">
                                            {item.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Working hours card */}
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-slate-800 mb-3">Working Hours</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Monday – Friday</span>
                                    <span className="font-medium text-slate-700">9:00 – 18:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Saturday</span>
                                    <span className="font-medium text-slate-700">10:00 – 16:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Sunday</span>
                                    <span className="font-medium text-red-500">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;