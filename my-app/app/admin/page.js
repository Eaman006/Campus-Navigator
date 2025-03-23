"use client"
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { useEffect } from "react"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { getAdminEmails } from "@/lib/adminUtils"

function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const adminEmails = await getAdminEmails();
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user && adminEmails.includes(user.email)) {
            router.replace('/cpanel');
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Auth error:", error);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div
      className="bg-white flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a className="flex items-center gap-2 self-center font-medium text-black">
          <div
            className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Admin Login
        </a>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;