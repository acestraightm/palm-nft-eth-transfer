import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AuthActionType } from "config/store/reducers/auth";
import type { NextPage } from "next";
import toast from "react-hot-toast";

const registerSchema = yup.object().shape({
  email: yup.string().nullable().required("Email is required").email("Must be email format"),
  password: yup.string().nullable().required("Password is required").min(8, "Password length must be at least 8"),
  confirmPassword: yup
    .string()
    .nullable()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

type TRegisterFormData = { email: string; password: string; confirmPassword: string };

const Register: NextPage = ({}) => {
  const router = useRouter();

  const dispatch = useDispatch();
  const form = useForm<TRegisterFormData>({
    resolver: yupResolver(registerSchema),
  });
  const { register, handleSubmit, formState } = form;

  const onRegister = useCallback((formData: TRegisterFormData) => {
    dispatch({ type: AuthActionType.REGISTER, payload: { email: formData.email, password: formData.password } });
    toast.success("The user has been registered successfully. You can login now.");
  }, []);

  const onLogin = useCallback(() => {
    router.replace('/login')
  }, [router]);

  return (
    <Row className="justify-content-center">
      <Col sm={8} md={6}>
        <Card>
          <Card.Header>Register</Card.Header>
          <Card.Body>
            <FormProvider {...form}>
              <Form onSubmit={handleSubmit(onRegister)}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control {...register("email")} type="email" isInvalid={!!formState.errors.email} id="registerInputEmail"/>
                  <Form.Control.Feedback type="invalid">{formState.errors.email?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    {...register("password")}
                    id="registerInputPassword"
                    type="password"
                    placeholder="Password"
                    isInvalid={!!formState.errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{formState.errors.password?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    {...register("confirmPassword")}
                    id="registerInputConfirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    isInvalid={!!formState.errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">{formState.errors.confirmPassword?.message}</Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="primary" type="submit">
                    Register
                  </Button>
                  <Button id="btnLogin" variant="link" onClick={onLogin}>
                    Login
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

export default Register;
