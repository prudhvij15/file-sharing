import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const SignupForm: React.FC = () => {
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your signup logic here

    try {
      const response = await axios.post(
        "http://localhost:3001/api/signup",
        signupData
      );
      console.log("Signup successful:", response.data);
      // Optionally, you can redirect the user to another page after successful signup
      navigate("/");
    } catch (error) {
      console.error("Failed to signup:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form className="space-y-4" onSubmit={handleSignupSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={signupData.email}
          onChange={handleSignupChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={signupData.password}
          onChange={handleSignupChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Signup
        </button>
      </form>

      <div className="mt-4 flex justify-center">
        <span className="mr-2">Already have an account?</span>
        <Link to="/" className="text-blue-600 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
