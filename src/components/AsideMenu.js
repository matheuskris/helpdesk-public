import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectName, selectProject } from "../store/userSlicer/user.selector";
import axios from "axios";
import { useRouter } from "next/router";

export default function AsideMenu() {
  const [isMenuOpen, setMenu] = useState(false);
  const [sendEmailInput, setSendEmailInput] = useState(false);
  const [email, setEmail] = useState("");

  const project = useSelector(selectProject);
  const name = useSelector(selectName);
  const router = useRouter();

  async function handleEmail() {
    const response = await axios.post("/api/hello", {
      method: "POST",
      body: {
        type: "sendInvite",
        projectUid: project.key,
        name,
        email,
        projectName: project.name,
      },
    });
    setEmail("");
    setSendEmailInput(false);
    console.log(response);
  }

  function goToMenu() {
    router.push("/");
  }

  return (
    <div className="absolute left-3 top-3 px-2 py-2 rounded-lg bg-white border border-black">
      <button
        onClick={() => {
          setMenu(!isMenuOpen);
        }}
      >
        <Image
          src="/aside-menu-icon.svg"
          width={30}
          height={30}
          alt="ícone menu"
        />
      </button>
      {isMenuOpen && (
        <div className="">
          <button
            onClick={() => {
              setSendEmailInput(!sendEmailInput);
            }}
            className="bg-slate-400"
          >
            Adicionar colega no projeto
          </button>
          {sendEmailInput && (
            <div>
              <input
                type="email"
                name="email"
                placeholder="Insira o email dela"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <button onClick={handleEmail}>Enviar</button>
            </div>
          )}
          <h2>Editar horas mensais de produção</h2>
          <button onClick={goToMenu}>Voltar para o Menu</button>
        </div>
      )}
    </div>
  );
}
