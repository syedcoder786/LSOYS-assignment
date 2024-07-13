import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Label,
  Spinner,
  TextInput,
  Toast,
} from "flowbite-react";
import { HiExclamation } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authSelector, login, reset } from "../../store/auth/authSlice";

interface LoginProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = () => {
  const dispatch = useAppDispatch();
  const {
    isLoginLoading: isLoading,
    isLoginError: isError,
    isLoginSuccess: isSuccess,
    isLoginMessage: message,
  } = useAppSelector(authSelector);

  const [errmsg, setErrmsg] = useState<string>("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isSuccess) {
      console.log("login/success");
    }

    if (isError) {
      setErrmsg(message || "");
    }

    dispatch(reset());
  }, [isError, message, isSuccess, dispatch]);

  const { email, password } = loginData;

  const onLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!email || !password) {
      return setErrmsg("Please enter all fields");
    }

    if (!reg.test(email)) {
      return setErrmsg("Invalid Email");
    }

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  return (
    <div>
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          Sign in to our platform
        </h3>

        {errmsg && (
          <Toast>
            <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
              <HiExclamation className="size-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{errmsg}</div>
            <Toast.Toggle onDismiss={() => setErrmsg("")} />
          </Toast>
        )}

        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your email" />
          </div>
          <TextInput
            name="email"
            value={email}
            onChange={onLoginChange}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Your password" />
          </div>
          <TextInput
            type="password"
            name="password"
            value={password}
            onChange={onLoginChange}
            required
          />
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember">Remember me</Label>
          </div>
          <a
            href="#"
            className="text-sm text-cyan-700 hover:underline dark:text-cyan-500"
          >
            Lost Password?
          </a>
        </div>
        <div className="w-full">
          <Button onClick={onLoginSubmit}>
            {isLoading && (
              <Spinner
                aria-label="Spinner button example"
                size="md"
                className="mr-2"
              />
            )}
            Log In
          </Button>
        </div>
        {/* <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
      Not registered?&nbsp;
      <a href="#" className="text-cyan-700 hover:underline dark:text-cyan-500">
        Create account
      </a>
    </div> */}
      </div>
    </div>
  );
};

export default Login;
