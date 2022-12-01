import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { setUser, setName } from "../../store/userSlicer/userSlicer";
import { createAuthUserWithEmailAndPassword } from "../../utils/firebase.utils";

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

  function handleChange(event) {
    const { value } = event.target;
    const { name } = event.target;

    setFormFields({ ...formFields, [name]: value });
  }

  async function handleSignUp(e) {
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
      setlogInError("insira dados válidos");
      setFormFields(initialState);
      return;
    }
    setLoading(true);

    try {
      const user = await createAuthUserWithEmailAndPassword(
        formFields.email,
        formFields.password,
        formFields.username
      );

      dispatch(setUser(user));
      dispatch(setName(formFields.username));
    } catch (error) {
      console.log(error.code);
    }
    router.push("/");
    setLoading(false);
    setFormFields(initialState);
  }
  return [formFields, signUpError, isLoading, handleChange, handleSignUp];
}
