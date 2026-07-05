export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="max-w-sm mx-auto w-full">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-3xl font-bold text-on-surface mb-2">Mot de passe oublié ?</h1>
          <p className="text-on-surface-variant">
            Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation.
          </p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="vous@entreprise.com"
              className="w-full rounded-lg border border-outline-variant/50 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-container hover:bg-primary-container/90 text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm"
          >
            Envoyer le lien
          </button>
        </form>
      </div>
    </div>
  );
}
