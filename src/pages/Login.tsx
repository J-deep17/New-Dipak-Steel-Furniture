
import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === "SIGNED_IN") {
                    navigate("/");
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [navigate]);

    return (
        <div className="container mx-auto max-w-md py-20 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-center text-primary">
                    Welcome Back
                </h1>
                <Alert className="mb-6">
                    <AlertTitle>Start Here</AlertTitle>
                    <AlertDescription>
                        Sign up to create your account. After signing up, verify your email if required.
                    </AlertDescription>
                </Alert>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme="light"
                    providers={[]}
                />
            </div>
        </div>
    );
};

export default Login;
