import LoginForm from "../ui/LoginForm";
import LoginShowcase from "../ui/LoginShowcase";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[650px]">
        <LoginForm />
        <div className="hidden lg:block p-3">
          <LoginShowcase />
        </div>
      </div>
    </div>
  );
}
