"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, Eye, EyeOff } from "lucide-react";

const passwordCriteria = [
  {
    id: "length",
    label: "Au moins 8 caractères",
    validate: (value: string) => value.length >= 8,
  },
  {
    id: "uppercase",
    label: "Une lettre majuscule",
    validate: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "number",
    label: "Un chiffre",
    validate: (value: string) => /[0-9]/.test(value),
  },
  {
    id: "special",
    label: "Un caractère spécial",
    validate: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const criteriaStatus = passwordCriteria.map((criterion) => ({
    ...criterion,
    passed: criterion.validate(password),
  }));

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="max-w-sm mx-auto w-full">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-2xl font-bold text-on-surface mb-2">Réinitialisation mot de passe</h1>
        </div>

        <form className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-on-surface" htmlFor="password">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-outline-variant/50 px-4 py-3 pr-11 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface-variant transition-colors"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface" htmlFor="confirmPassword">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg border border-outline-variant/50 px-4 py-3 pr-11 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface-variant transition-colors"
                aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/40 p-3 text-sm">
            <ul className="space-y-2">
              {criteriaStatus.map((criterion) => (
                <li
                  key={criterion.id}
                  className={`flex items-center gap-2 ${criterion.passed ? "text-emerald-600" : "text-red-600"}`}
                >
                  {criterion.passed ? (
                    <CircleCheck size={16} className="shrink-0" />
                  ) : (
                    <CircleAlert size={16} className="shrink-0" />
                  )}
                  <span>{criterion.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-container hover:bg-primary-container/90 text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm"
          >
            Confirmer
          </button>
        </form>
      </div>
    </div>
  );
}
