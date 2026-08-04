"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsPending(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json().catch(() => null);

            if (!response.ok) {
                setError(data?.message ?? "La connexion a échoué.");
                return;
            }

            const portal = typeof data?.redirectTo === "string" ? data.redirectTo : null;
            if (!portal) {
                setError("Impossible de déterminer le portail associé à ce compte.");
                return;
            }

            const requestedPath = new URLSearchParams(window.location.search).get("redirect");
            const safeRequestedPath = requestedPath === portal || requestedPath?.startsWith(`${portal}/`)
                ? requestedPath
                : null;

            router.replace(safeRequestedPath ?? portal);
            router.refresh();
        } catch {
            setError("Le service d'authentification est momentanément indisponible.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <div className="max-w-sm mx-auto w-full">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <h1 className="text-2xl lg:text-3xl font-bold text-on-surface mb-2">Bienvenu(e) !</h1>
                        <p className="text-sm text-on-surface-variant">
                            Connectez-vous pour accéder à votre espace support.
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-on-surface" htmlFor="email">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="vous@entreprise.com"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                className="w-full rounded-lg border border-outline-variant/50 px-4 py-2.5 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-all"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-on-surface" htmlFor="password">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                    className="w-full rounded-lg border border-outline-variant/50 px-4 py-2.5 pr-11 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface-variant transition-colors"
                                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.remember}
                                    onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))}
                                    className="rounded border-outline-variant/50 text-primary-container focus:ring-primary-container/50"
                                />
                                Se souvenir de moi
                            </label>
                            <Link href="/auth/forgot-password" className="font-medium text-primary-container hover:underline">
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        {error && (
                            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-primary-container hover:bg-primary-container/90 text-white font-bold py-2.5 rounded-lg transition-all active:scale-[0.98] shadow-sm disabled:cursor-wait disabled:opacity-60"
                        >
                            {isPending ? "Connexion…" : "Se connecter"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="h-px flex-1 bg-outline-variant/30" />
                        <span className="text-xs text-on-surface-variant/70">Ou continuer avec</span>
                        <div className="h-px flex-1 bg-outline-variant/30" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 border border-outline-variant/40 rounded-lg py-2 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                            <GoogleIcon />
                            Google
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 border border-outline-variant/40 rounded-lg py-2 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                            <MicrosoftIcon />
                            Microsoft
                        </button>
                    </div>

                    <p className="text-center text-sm text-on-surface-variant mt-5">
                        Pas encore de compte ?{" "}
                        <a href="#" className="font-medium text-primary-container hover:underline">
                            Contactez-nous
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="#4285F4"
                d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"
            />
            <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.3v3.09A12 12 0 0 0 12 24z"
            />
            <path
                fill="#FBBC05"
                d="M5.31 14.33a7.2 7.2 0 0 1 0-4.62V6.62H1.3a12 12 0 0 0 0 10.76z"
            />
            <path
                fill="#EA4335"
                d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.94 1.19 15.23 0 12 0A12 12 0 0 0 1.3 6.62l4.01 3.09C6.25 6.88 8.89 4.77 12 4.77z"
            />
        </svg>
    );
}

function MicrosoftIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="1" y="1" width="10" height="10" fill="#F25022" />
            <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
            <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
            <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
        </svg>
    );
}
