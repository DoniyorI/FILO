import Home from "./Home";
import { useNavigate } from 'react-router-dom';
import './Register.jsx'
export default function Login() {
  const navigate = useNavigate();

  // Your condition to trigger the redirection
  const shouldRedirect = true;

  if (shouldRedirect) {
    navigate('/');
  }

  return (Home
  );
}
