import { Avatar, Button, Dropdown, Modal, Navbar, Tabs } from "flowbite-react";
import { useState } from "react";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { authSelector, logout } from "../store/auth/authSlice";
import { Link } from "react-router-dom";

export default function Component() {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(authSelector);

  const [openModal, setOpenModal] = useState(false);
  return (
    <Navbar fluid className="sticky top-0 z-50">
      <Link to="/">
        <Navbar.Brand>
          <img
            src="https://cdn-icons-png.freepik.com/512/5339/5339184.png"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite React Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Rent App
          </span>
        </Navbar.Brand>
      </Link>
      <div className="flex md:order-2">
        {user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img={user.profile_img} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Link to="/addproduct">
              <Dropdown.Item>Add Product</Dropdown.Item>
            </Link>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => {
                setOpenModal(false);
                dispatch(logout());
              }}
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <>
            <Button onClick={() => setOpenModal(true)}>Login</Button>
            <Modal
              show={openModal}
              size="md"
              popup
              onClose={() => setOpenModal(false)}
              // initialFocus={emailInputRef}
            >
              <Modal.Header />
              <Modal.Body>
                <Tabs aria-label="Default tabs">
                  <Tabs.Item active title="Login">
                    <Login openModal={openModal} setOpenModal={setOpenModal} />
                  </Tabs.Item>
                  <Tabs.Item title="SignUp">
                    <Signup openModal={openModal} setOpenModal={setOpenModal} />
                  </Tabs.Item>
                </Tabs>
              </Modal.Body>
            </Modal>
          </>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
