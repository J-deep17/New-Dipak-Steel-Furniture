
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";

const Login = () => {
    const navigate = useNavigate();
    const { signIn, signUp } = useAuth();
    const { toast } = useToast();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                await signUp(email, password);
                toast({
                    title: "Account created!",
                    description: "Please check your email to verify your account."
                });
            } else {
                await signIn(email, password);
                toast({
                    title: "Welcome back!",
                    description: "You have successfully logged in."
                });
                navigate("/");
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "An error occurred.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto flex items-center justify-center min-h-[70vh] py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
                        <CardDescription>
                            {isSignUp
                                ? "Sign up to save your wishlist and more."
                                : "Sign in to your account to continue."}
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Sign In")}
                            </Button>
                            <p className="text-sm text-muted-foreground text-center">
                                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-primary underline"
                                >
                                    {isSignUp ? "Sign In" : "Sign Up"}
                                </button>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default Login;
