"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

/**
 * Component to handle user login.
 *
 * @param {{ setState: (state: string) => void }} props
 * @returns {JSX.Element}
 */
const Login = ({ setState }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Handles the login form submission.
   *
   * Prevents the default form submission, sets loading to true, and clears any error.
   * Makes a POST request to the login endpoint with the email and password.
   * If the response is successful, stores the access token in local storage and redirects to the dashboard.
   * If an error occurs, sets the error message and sets loading to false.
   *
   * @param {Event} e The form submission event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the default form submission
    if (!(email || password)) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    setError("");

    // Make API call
    try {
      const response = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Handle response
      const data = await response.json();
      if (data.statusCode === 200) {
        setLoading(false);
        localStorage.setItem("token", data.data.accessToken);
        router.push("/dashboard");
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>Use or email and name to continue</CardDescription>
        <p className="text-red-500">{error}</p>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <Input
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
          />
          <Input
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
          <Button type="submit" className="w-full" size="lg">
            {loading ? <Loader className="animate-spin" /> : "Login"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">
          Don't have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("register")}
          >
            Register
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default Login;
