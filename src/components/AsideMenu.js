import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectName, selectProject } from "../store/userSlicer/user.selector";
import axios from "axios";
import { useRouter } from "next/router";
import { setUser } from "../store/userSlicer/userSlicer";

export default function AsideMenu({ setOpenToast, setToastInfo }) {
  const [isMenuOpen, setMenu] = useState(false);
  const [sendEmailInput, setSendEmailInput] = useState(false);
  const [email, setEmail] = useState("");

  const project = useSelector(selectProject);
  const dispatch = useDispatch();
  const name = useSelector(selectName);
  const router = useRouter();

  async function handleEmail() {
    if (!email || !project.key || !name || !email || !project.name) {
      setEmail("");
      setSendEmailInput(false);
      return;
    }
    try {
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
      console.log(response);
      setToastInfo({
        status: "ok",
        message: "seu email foi enviado com sucesso",
      });
    } catch (err) {
      console.log(err);
      setToastInfo({
        status: "error",
        message: "Não foi possível localizar o email inserido",
      });
    }
    setOpenToast(true);
    setEmail("");
    setSendEmailInput(false);
  }

  // Logaut logic
  function logout() {
    dispatch(setUser(null));
    router.push("/");
  }

  function goToMenu() {
    router.push("/");
  }

  return (
    <div
      className={`absolute left-3 top-3 ${
        isMenuOpen ? "px-6 py-4" : "px-2 py-1"
      } rounded-lg bg-white shadow-lg drop-shadow-md transition-all`}
    >
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
      <div
        className={`transition flex flex-col ${
          isMenuOpen ? "w-[320px] h-[80vh]" : "h-0 w-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col mt-4 text-lg gap-4 items-start">
          <button
            onClick={() => {
              setSendEmailInput(!sendEmailInput);
            }}
            className="menu-btn"
          >
            Adicionar pessoas
          </button>
          {sendEmailInput && (
            <div className="flex flex-row gap-3">
              <input
                className="px-3 py-2 bg-transparent outline-none shadow-sm border-gray-300 border"
                type="email"
                name="email"
                placeholder="Insira o email dela"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <button
                className="flex justify-center items-center rounded-md font-medium text-base px-4 bg-cyan-700 text-white"
                onClick={handleEmail}
              >
                Enviar
              </button>
            </div>
          )}
          <button className="menu-btn">Editar horas mensais</button>
        </div>
        <div className="flex flex-row justify-between w-full mt-auto">
          <button className="btnExport bg-black" onClick={goToMenu}>
            Menu
          </button>
          <button className="btnExport bg-black" onClick={logout}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
