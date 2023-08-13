import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import Register from "./Register";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe("Register component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders register form", () => {
    render(<Register />);

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  test("submits register form with valid input", async () => {
    render(<Register />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const registerButton = screen.getByText("Register");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(registerButton);

    expect(fetch).toHaveBeenCalledWith("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "testuser",
        email: "test@example.com",
        password: "password123",
      }),
    });

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith(
        "/dashboard/login?success=Account has been created"
      );
    });
  });

  test("renders error message when registration fails", async () => {
    render(<Register />);

    const registerButton = screen.getByText("Register");

    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
    });
  });
});
