import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create <span className="gradient-text">Account</span></h1>
          <p className="text-muted-foreground text-sm">Sign up to track your projects with Deadraon</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
