import * as Popover from "@radix-ui/react-popover";
import NewProjectModal from "../../components/newProjectModal";
import Loading from "../Loading";

import { useMenu } from "./useMenu";

export default function Menu({ user }) {
  const [
    projects,
    invites,
    isModalOpen,
    setModal,
    logout,
    handleSelect,
    handleAcceptInvite,
    handleCreateProject,
    isProjectsLoading,
  ] = useMenu(user);

  return (
    // Containers
    <div className="h-screen w-[100%] flex justify-center items-center relative bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="w-[572px] shadow-xl px-24 py-16 rounded-md bg-white">
        {/* SVG e HelpDesk */}
        <div className="flex items-baseline justify-start space-x-2">
          <p className="text-4xl">Menu</p>
        </div>
        {/* Titulo */}
        <p className="text-xl mt-4 mb-3">Selecione um de seus projetos:</p>
        <div className="flex flex-col gap-2 text-lg">
          <div className="flex flex-col items-center">
            {isProjectsLoading && <Loading />}
            {projects
              ? projects.map((project) => (
                  <button
                    key={project.key}
                    className="shadow-lg border-2 border-gray-400 py-2 rounded-lg hover:shadow-inner"
                    onClick={() => {
                      handleSelect(project);
                    }}
                  >
                    {project.name}
                  </button>
                ))
              : "Cadastre um projeto ou entre em um para começar"}
          </div>
          <div className="flex flex-row justify-between mt-6">
            <button
              className="shadow-lg py-1 px-2 rounded-lg hover:shadow-inner border-2 border-gray-400"
              onClick={handleCreateProject}
            >
              Criar novo projeto
            </button>
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="border-2 border-gray-400 py-1 px-2 rounded-lg shadow-lg hover:shadow-inner ">
                  Ver Convites
                </button>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content>
                  <div className="rounded p-5 bg-white shadow-md transition-all duration-300 ">
                    {invites[1] ? (
                      invites.map((invite) => (
                        <div
                          className="flex flex-row gap-10 items-center"
                          key={invite.key}
                        >
                          <h4 className="text-xl">{invite.projectName}</h4>
                          <button
                            className="bg-gray-400 hover:bg-gray-300 shadow-sm py-1 px-2 rounded-md hover:shadow-inner"
                            onClick={() => handleAcceptInvite(invite.key)}
                          >
                            Aceitar
                          </button>
                        </div>
                      ))
                    ) : (
                      <h3>Você não Possui convites no Momento</h3>
                    )}
                  </div>
                  <Popover.Close />
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
          <button
            className="border-2 border-gray-400 py-1 px-2 rounded-lg shadow-lg hover:shadow-inner"
            onClick={logout}
          >
            Sair
          </button>
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
