import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  signInAuthWithEmailAndPassword,
  getUserName,
} from "../../utils/firebase.utils";
import { setUser, setUserToken } from "../../store/userSlicer/userSlicer";
import AuthenticationApi from "../../api/authApi";

export default function useLogin() {
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });
  const [logInError, setlogInError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;

    setCredential({ ...credential, [name]: value });
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!credential.email || !credential.password) {
      setlogInError("insira dados válidos");
      setCredential({
        email: "",
        password: "",
      });
      return;
    }
    setIsLoading(true);
    try {
      const userToken = await AuthenticationApi.signIn(
        credential.email,
        credential.password
      );
      localStorage.setItem('jhi-authenticationToken', userToken.data);

      const user = await AuthenticationApi.getMe();
      dispatch(setUser(user.data));
      dispatch(setUserToken(userToken.data));
    } catch (error : any) {
      switch (error.code) {
        case "auth/wrong-password":
          setlogInError("Senha ou email incorretos");
          break;
        case "auth/too-many-requests":
          setlogInError(
            "muitas tentativas erradas, tente novamente mais tarde"
          );
        case "auth/user-not-found":
          setlogInError("Usuário não encontrado.");
          break;
        default:
          console.log(error);
          setlogInError(
            `Ocorreu um erro não esperado, tente novamente mais tarde`
          );
      }
      setIsLoading(false);
    }
    setCredential({
      email: "",
      password: "",
    });
  }
  return [credential, logInError, isLoading, handleChange, handleLogin] as const;
}
