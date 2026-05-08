import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8 flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account credentials and profile details.</p>
        </div>
        <div className="flex justify-center">
           <UserProfile appearance={{
             elements: {
               rootBox: "w-full shadow-none",
               card: "border border-border shadow-none rounded-2xl w-full",
               navbar: "hidden", // We can hide Clerk's internal navbar if we just want a simple settings page
             }
           }} />
        </div>
      </div>
    </div>
  );
}
