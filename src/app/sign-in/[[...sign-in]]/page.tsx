import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2"><span className="gradient-text">Client</span> Login</h1>
          <p className="text-muted-foreground text-sm">Sign in to access your project dashboard</p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
