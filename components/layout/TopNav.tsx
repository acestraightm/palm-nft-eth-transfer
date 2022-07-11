import { AppState } from "config/store";
import { AuthActionType, TAuthReducer } from "config/store/reducers/auth";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";

function TopNav() {
  const auth = useSelector<AppState, TAuthReducer>((state) => state.auth);

  const [authData, setAuthData] = useState<TAuthReducer | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setAuthData(auth);
  }, [auth])

  const onLogout = useCallback(() => {
    dispatch({ type: AuthActionType.LOGOUT });
    router.replace("/login");
    setAuthData(null);
  }, [dispatch]);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Palm NFT</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {authData && authData.email && (
              <NavDropdown title={authData.email} id="basic-nav-dropdown" align="end">
                <NavDropdown.Item href="#" onClick={onLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNav;
