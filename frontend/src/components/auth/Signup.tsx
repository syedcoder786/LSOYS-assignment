import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Button, Label, Spinner, TextInput, Toast } from "flowbite-react";
import { HiExclamation } from "react-icons/hi";
import axios from "axios";
import { IAddressData } from "../../types/types";
import { authSelector, register, reset } from "../../store/auth/authSlice";

interface SignupProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

interface Register {
  name: string;
  email: string;
  password: string;
  address: IAddressData | null;
}

// interface AddressComponents {
//   road?: string;
//   city?: string;
//   town?: string;
//   state?: string;
//   country?: string;
// }

const Signup: React.FC<SignupProps> = () => {
  //   const dispatch = useDispatch();
  const {
    // user,
    isRegisterLoading: isLoading,
    isRegisterError: isError,
    isRegisterSuccess: isSuccess,
    isRegisterMessage: message,
  } = useAppSelector(authSelector);

  const dispatch = useAppDispatch();

  // const auth = useAppSelector(authSelector);

  const [registerData, setRegisterData] = useState<Register>({
    name: "",
    email: "",
    password: "",
    address: null,
  });

  const [errmsg, setErrmsg] = useState<string>("");

  useEffect(() => {
    if (isSuccess) {
      console.log("register/success");
    }

    if (isError) {
      setErrmsg(message || "");
    }

    dispatch(reset());
  }, [dispatch, isSuccess, isError, message]);

  const { name, email, password, address }: Register = registerData;

  const onRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!name || !email || !password) {
      return setErrmsg("Please enter all fields");
    }

    if (reg.test(email) === false) {
      return setErrmsg("Invaid Email");
    }

    if (name.length < 3) {
      return setErrmsg("Name must contain atleast 3 characters");
    }
    if (password.length < 6) {
      return setErrmsg("Password must contain atleast 6 characters");
    }

    if (!address) {
      return setErrmsg("Get Current Location");
    }

    const userData = {
      name,
      email,
      password,
      address,
    };

    console.log(userData);

    dispatch(register(userData));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      // setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            console.log(position);
            // setRegisterData((prevData) => ({
            //   ...prevData,
            //   location: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`,
            // }));
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const apiKey = "ef0e2e4faa2643539c6a9633f9e845de";
            const response = await axios.get(
              "https://api.geoapify.com/v1/geocode/reverse",
              {
                params: {
                  lat: lat,
                  lon: lng,
                  apiKey: apiKey, // Replace with your actual Geoapify API key
                  format: "json",
                },
              },
            );

            console.log(response);

            if (response.data.results.length > 0) {
              const components = response.data.results[0];
              const addressComponents = {
                address1: components.address_line1,
                address2: components.address_line2,
                street: components.county,
                city: components.city,
                country: components.country,
              };
              console.log(addressComponents);

              setRegisterData((prevState: Register) => ({
                ...prevState,
                address: {
                  coords: {
                    lat,
                    lng,
                  },
                  street: components.county,
                  address1: components.address_line1,
                  address2: components.address_line2,
                },
              }));
            }
          } catch (err) {
            console.log(err);
            setErrmsg("Failed to fetch location details");
          } finally {
            // setLoading(false);
          }
        },
        (error) => {
          // console.log(error);
          setErrmsg(error.message);
          // setLoading(false);
        },
      );
    } else {
      setErrmsg("Geolocation is not supported by this browser.");
    }
  };
  return (
    <div>
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          Sign up to our platform
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
            <Label htmlFor="name" value="Your name" />
          </div>
          <TextInput
            id="text"
            name="name"
            value={name}
            placeholder="Name"
            required
            onChange={onRegisterChange}
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your email" />
          </div>
          <TextInput
            id="email"
            name="email"
            value={email}
            placeholder="name@company.com"
            required
            onChange={onRegisterChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Your password" />
          </div>
          <TextInput
            id="password"
            name="password"
            value={password}
            type="password"
            required
            onChange={onRegisterChange}
          />
        </div>
        {address && (
          <div className=" text-white">
            <p>{address.street}</p>
            {address.address1}
            {address.address2}
          </div>
        )}
        <Button onClick={handleGetLocation}>
          {/* {loading ? (
          <Spinner aria-label="Loading spinner" size="md" className="mr-2" />
        ) : ( */}
          Get Current Location
          {/* // )} */}
        </Button>
        {/* <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember">Remember me</Label>
                </div>
                <a href="#" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                  Lost Password?
                </a>
              </div> */}
        <Button onClick={onRegisterSubmit}>
          {isLoading && (
            <Spinner
              aria-label="Spinner button example"
              size="md"
              className="mr-2"
            />
          )}
          Sign Up
        </Button>
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

export default Signup;
