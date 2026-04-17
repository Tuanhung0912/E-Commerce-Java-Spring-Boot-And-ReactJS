import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaStore, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authenticateSignInUser } from "../../store/actions";
import toast from "react-hot-toast";
import Spinners from "../shared/Spinners";

const LogIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    const loginHandler = async (data) => {
        console.log("Login Click");
        dispatch(authenticateSignInUser(data, toast, reset, navigate, setLoader));
    };

    return (
        <div className="min-h-[calc(100vh-70px)] flex items-center justify-center
            bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">

            {/* Decorative blurs */}
            <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-indigo-500/8 blur-3xl" />
            <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-violet-500/8 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />

            <div className="relative w-full max-w-[440px] mx-4">
                {/* Card */}
                <div className="rounded-2xl bg-white/[0.08] backdrop-blur-xl
                    border border-white/10 shadow-2xl shadow-black/20
                    p-8 sm:p-10">

                    {/* Logo & Title */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl
                            bg-gradient-to-br from-indigo-500 to-violet-500
                            shadow-lg shadow-indigo-500/30 mb-4">
                            <FaStore className="text-white text-xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                        <p className="text-sm text-slate-400 mt-1">Sign in to your account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(loginHandler)} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <FaUser className="text-slate-500 text-sm" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    {...register("username", { required: "*Username is required" })}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white
                                        bg-white/[0.06] border placeholder:text-slate-500
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400
                                        transition-all duration-200
                                        ${errors.username ? "border-red-500/50" : "border-white/10"}`}
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <FaLock className="text-slate-500 text-sm" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    {...register("password", { required: "*Password is required" })}
                                    className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white
                                        bg-white/[0.06] border placeholder:text-slate-500
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400
                                        transition-all duration-200
                                        ${errors.password ? "border-red-500/50" : "border-white/10"}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center
                                        text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            disabled={loader}
                            type="submit"
                            className="w-full flex items-center justify-center gap-2
                                py-3.5 rounded-xl font-semibold text-sm text-white
                                bg-gradient-to-r from-indigo-500 to-violet-500
                                shadow-lg shadow-indigo-500/25
                                transition-all duration-300
                                hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02]
                                disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-lg"
                        >
                            {loader ? (
                                <>
                                    <Spinners /> Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-slate-500 uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LogIn;