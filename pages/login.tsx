import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AuthActionType, TAuthReducer } from "config/store/reducers/auth";
import type { NextPage } from 'next'
import { AppState } from "config/store";

const loginSchema = yup.object().shape({
  email: yup.string().nullable().required("Email is required").email("Must be email format"),
  password: yup.string().nullable().required("Password is required").min(8, "Password length must be at least 8"),
});

type TLoginFormData = { email: string; password: string };

const Login : NextPage = ({}) => {
  const auth = useSelector<AppState, TAuthReducer>((state) => state.auth);

  const router = useRouter();
  
  const dispatch = useDispatch();
  const form = useForm<TLoginFormData>({
    resolver: yupResolver(loginSchema),
  });
  const { register, handleSubmit, formState, setError } = form;

  const onLogin = useCallback((formData: TLoginFormData) => {
    if (formData.password === auth.password) {
      dispatch({ type: AuthActionType.LOGIN_SUCCESS, payload: { email: formData.email } });
      router.replace('/')
    } else {
      setError("password", { message: "Wrong Password" });
    }
  }, [router]);

  const onRegister = useCallback(() => {
    router.replace('/register')
  }, [router]);

  return (
    <Row className="justify-content-center">
      <Col sm={8} md={6}>
        <Card>
          <Card.Header>Login</Card.Header>
          <Card.Body>
            <FormProvider {...form}>
              <Form onSubmit={handleSubmit(onLogin)}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control {...register("email")} id="loginInputEmail" type="email" isInvalid={!!formState.errors.email} />
                  <Form.Control.Feedback type="invalid">{formState.errors.email?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    {...register("password")}
                    id="loginInputPassword" 
                    type="password"
                    placeholder="Password"
                    isInvalid={!!formState.errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{formState.errors.password?.message}</Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                  <Button id="btnRegister" variant="link" onClick={onRegister}>
                    Register
                  </Button>
                </div>
              </Form>
            </FormProvider>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
