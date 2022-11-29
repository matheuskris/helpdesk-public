import Image from "next/image";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  signInAuthWithEmailAndPassword,
  projectsListener,
  getUserName,
} from "../src/utils/firebase.utils";
import Loading from "../src/components/Loading";
import NewProjectModal from "../src/components/newProjectModal";

import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../src/store/userSlicer/user.selector";
import {
  setUser,
  setCurrentProject,
  setName,
} from "../src/store/userSlicer/userSlicer";
import Link from "next/link";

export default function Checking() {
  const user = useSelector(selectUser);

  return <>{user ? <Menu user={user} /> : <Login user={user} />}</>;
}

function Login() {
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });
  const [logInError, setlogInError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  function handleChange(event) {
    const { value } = event.target;
    const { name } = event.target;

    setCredential({ ...credential, [name]: value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    if (!credential.email || !credential.password) {
      setlogInError("insira dados válidos");
      setCredential({
        email: "",
        password: "",
      });
      return;
    }

    try {
      const userCredential = await signInAuthWithEmailAndPassword(
        credential.email,
        credential.password
      );
      const { user } = userCredential;
      const userName = await getUserName(user.uid);
      dispatch(setUser(user));
      dispatch(setName(userName));
    } catch (error) {
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

  return (
    // Containers
    <div className="h-screen w-[100%] flex justify-center items-center relative bg-[#7a7a7a]">
      <div className="w-[572px] px-24 py-16 rounded-[33px] bg-[#bebebe]">
        {/* SVG e HelpDesk */}
        <div className="flex items-baseline justify-start space-x-2">
          <Image width={44} height={33} src="/Vector Help Desk.svg" alt="" />
          <p className="text-lg text-white">Help Desk</p>
        </div>

        {/* Titulo */}
        <p className="text-white text-xl mt-12">Faça login na sua conta</p>

        {/* Formulário */}
        <form className="flex flex-col space-y-10 mt-8" action="">
          <input
            className="input"
            placeholder="Usuário"
            type="email"
            name="email"
            value={credential.email}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="Senha"
            type="password"
            name="password"
            onChange={handleChange}
            value={credential.password}
          />
          {logInError && <p className="text-red-600 font-bold">{logInError}</p>}
          <button
            disabled={isLoading}
            onClick={handleLogin}
            className="btnLogin"
          >
            {isLoading ? <Loading /> : "Login"}
          </button>
        </form>
        <Link href="/signUp">
          Não tem uma conta? clique aqui para cadastrar!
        </Link>
      </div>
    </div>
  );
}

function Menu({ user }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setModal] = useState(false);

  useEffect(() => {
    function transformObjectToArray(object) {
      console.log(object);
      const newArray = [];
      for (const prop in object) {
        newArray.push(object[prop]);
      }
      return newArray;
    }

    function handleFetch(projectsObject) {
      const projectArray = transformObjectToArray(projectsObject);
      setProjects(projectArray);
    }

    projectsListener(user.uid, handleFetch);
  }, []);

  function logout() {
    dispatch(setUser(null));
  }

  function handleSelect(project) {
    console.log(project);
    dispatch(setCurrentProject(project));
    router.push("/helpdesk");
  }

  function handleCreateProject() {
    setModal(true);
  }

  return (
    // Containers
    <div className="h-screen w-[100%] flex justify-center items-center relative bg-[#7a7a7a]">
      <div className="w-[572px] px-24 py-16 rounded-[33px] bg-[#bebebe]">
        {/* SVG e HelpDesk */}
        <div className="flex items-baseline justify-start space-x-2">
          <Image width={44} height={33} src="/Vector Help Desk.svg" alt="" />
          <p className="text-lg text-white">Help Desk</p>
        </div>
        {/* Titulo */}
        <p className="text-white text-xl mt-12 mb-3">
          Selecione um de seus projetos:
        </p>
        <div className="flex flex-col gap-2 text-lg">
          {projects
            ? projects.map((project) => (
                <button
                  key={project.key}
                  className="bg-white py-2 rounded-lg"
                  onClick={() => {
                    handleSelect(project);
                  }}
                >
                  {project.name}
                </button>
              ))
            : "Cadastre um projeto ou entre em um para começar"}
          <div className="flex flex-row justify-between mt-6">
            <button
              className="bg-white py-1 px-2 rounded-lg"
              onClick={handleCreateProject}
            >
              Criar novo projeto
            </button>
            <button className="bg-white py-1 px-2 rounded-lg" onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      </div>
      <NewProjectModal
        isModalOpen={isModalOpen}
        setModal={setModal}
        user={user}
      />
    </div>
  );
}
