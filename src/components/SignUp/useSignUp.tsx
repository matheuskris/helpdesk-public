import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { setUser, setUserToken } from "../../store/userSlicer/userSlicer";
import AuthenticationApi from "../../api/authApi";

const initialState = {
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
};

export function useSignUp() {
  const [formFields, setFormFields] = useState(initialState);
  const [signUpError, setSignUpError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    const { name } = event.target;

    setFormFields({ ...formFields, [name]: value });
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formFields.password !== formFields.confirmPassword) {
      setSignUpError("insira duas senhas iguais");
      return;
    }
    if (formFields.username.length > 12) {
      setSignUpError("insira um username curto");
      return;
    }
    if (!formFields.email || !formFields.password || !formFields.username) {
      setSignUpError("insira dados válidos");
      setFormFields(initialState);
      return;
    }
    setLoading(true);

    try {
      const userTokenResult = await AuthenticationApi.signup(
        formFields.username,
        formFields.email,
        formFields.password,
      );

      const result = await AuthenticationApi.getMe();

      dispatch(setUser(result.data));
      dispatch(setUserToken(userTokenResult.data));
    } catch (error) {
      console.log(error);
    }
    router.push("/");
    setLoading(false);
    setFormFields(initialState);
  }
  return [formFields, signUpError, isLoading, handleChange, handleSignUp] as const;
}
