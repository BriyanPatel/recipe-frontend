"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useState } from "react";

/**
 * Register component
 * @param {{ setState: (state: string) => void }} props
 * @returns {JSX.Element}
 */
const Register = ({setState}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("")
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  /**
   * Handles the register form submission
   * @param {React.FormEvent<HTMLFormElement>} e - The form event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the default form submission
    setLoading(true);
    setError('');

    // Make API call
    try {
      console.log(email, username, password);
      const response = await fetch('http://localhost:8000/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, username, password }),
      });

      const data = await response.json();
      if (data.statusCode === 200) {
        // Successful login
        console.log('Login successful', data);
        setState('login')
      } else {
        console.log(data)
        // Handle errors
        setError(data);
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
        <CardTitle>Register to continue</CardTitle>
        <CardDescription>Use your email and name to continue</CardDescription>
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
          />
           <Input
            disabled={false}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Name"
          />
          <Input
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <Button type="submit" className="w-full" size="lg">
          {loading ? <Loader className="animate-spin" />: "Continue"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState('login')}>
            Login
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default Register;
