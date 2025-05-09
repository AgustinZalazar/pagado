import LoginForm from "@/components/auth/form_login";

export default function Login() {
    return (
        <>
            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="relative hidden bg-muted lg:block">
                    <img
                        src="/place-holder.jpg"
                        alt="Image"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
                <div className="flex flex-col gap-4 p-6 md:p-10 bg-slate-50">
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}