import { render, screen, fireEvent } from "@testing-library/react";
import { signIn } from "next-auth/react";
import Login from "./Login";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  useSession: jest.fn().mockReturnValue({ status: "authenticated" }),
}));

describe("Login component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form", () => {
    render(<Login />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("submits login form with valid credentials", () => {
    render(<Login />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByText("Login");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "test@example.com",
      password: "password123",
    });
  });

  test("renders loading message when session status is loading", () => {
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      status: "loading",
    });

    render(<Login />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("redirects to dashboard when session status is authenticated", () => {
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      status: "authenticated",
    });

    const pushMock = jest.fn();
    const routerMock = { push: pushMock };

    render(<Login router={routerMock} />);

    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });
});
