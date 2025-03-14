import Form from "../components/AuthForm";

function Login() {
  return <Form route="/api/user/login/" method="login" />;
}

export default Login;
