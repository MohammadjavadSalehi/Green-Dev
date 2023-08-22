"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { TextField, Button } from "@mui/material";

const Login = ({ url }) => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setError(params.get("error"));
    setSuccess(params.get("success"));
  }, [params]);

  useEffect(() => {
    if (session.status === "authenticated") {
      router?.push("/dashboard");
    }
  }, [session, router]);

  const onSubmit = (data) => {
    const { email, password } = data;
    signIn("credentials", { email, password });
  };

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{success ? success : "Welcome Back"}</h1>
      <h2 className={styles.subtitle}>Please sign in to see the dashboard.</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <TextField
          {...register("email", { required: true })}
          type="text"
          label="Email"
          variant="outlined"
          className={styles.input}
          InputLabelProps={{
            style: { color: "#bbb" },
          }}
          InputProps={{
            classes: {
              notchedOutline: styles.customBorder,
            },
            style: { color: "#bbb" },
          }}
        />
        {errors.email && <p style={{ color: "red" }}>Email is required.</p>}
        <TextField
          {...register("password", { required: true })}
          type="password"
          label="Password"
          variant="outlined"
          className={styles.input}
          InputLabelProps={{
            style: { color: "#bbb" },
          }}
          InputProps={{
            classes: {
              notchedOutline: styles.customBorder,
            },
          }}
        />
        {errors.password && (
          <p style={{ color: "red" }}>Password is required.</p>
        )}
        <Button variant="contained" type="submit" className={styles.button}>
          Login
        </Button>
        {error && error}
      </form>
      <Button
        onClick={() => {
          signIn("google");
        }}
        variant="contained"
        className={styles.button + " " + styles.google}
      >
        Login with Google
      </Button>
      <span className={styles.or}>- OR -</span>
      <Link className={styles.link} href="/dashboard/register">
        Create new account
      </Link>
    </div>
  );
};

export default Login;
