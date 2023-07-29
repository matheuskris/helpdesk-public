import Image from "next/image";

import CreateCallModal from "../CreateCallModal";
import EditCallModal from "../EditCallModal";
import DescriptionModal from "../DescriptionModal";
import AsideMenu from "../AsideMenu";
import Table from "../Table";
import InviteMessageToast from "../InviteMessageToast";

import { useHelpdesk } from "./useHelpDesk";

function Helpdesk() {
  const [
    project,
    // userUid,
    isModalOpen,
    setModal,
    isEditModalOpen,
    setEditModal,
    callToEdit,
    setCallToEdit,
    isDescriptionModalOpen,
    setDescriptionModal,
    description,
    showClosedCalls,
    selectFilter,
    dateInput,
    filteredCalls,
    totalTime,
    personsInProject,
    // handleSelectChange,
    // handleSearchField,
    handleCloseCall,
    checkDescription,
    handleOpenModal,
    handleEditModal,
    handleShowTramites,
    handleReopenCall,
    handleShowClosedCalls,
    openToast,
    setOpenToast,
    toastInfo,
    setToastInfo,
  ] = useHelpdesk();

  return (
    <div className="min-h-screen relative w-full bg-[#FFF] overflow-hidden">
      <AsideMenu 
        setOpenToast={setOpenToast} 
        setToastInfo={setToastInfo} 
      />
      {/* Content */}
      <div className=" px-6 ">
        {/* Titulo tabela e botão  */}
        <div className="flex flex-row justify-between items-center pt-5 mb-4">
          <div className="pl-10 flex">
            <h1 className="text-3xl font-semibold mb-2">Painel de Controle</h1>
          </div>
          <div className="flex gap-4 place-self-end mr-12">
            <div className="flex items-center justify-between">
              {selectFilter !== "data" && (
                <h3 className="text-lg ">Escolha um filtro:</h3>
              )}
              <select
                className="rounded-lg p-2 border text-sm outline-gray-400"
                // onChange={handleSelectChange}
              >
                <option value="id">Id</option>
                <option value="client">Cliente</option>
                <option value="inCharge">Responsável</option>
                <option value="data">Data</option>
                <option value="description">Descrição</option>
                <option value="userClient">Usuário Cliente</option>
              </select>
              {selectFilter === "data" ? (
                <>
                  <input
                    type="date"
                    name="date1"
                    value={dateInput.date1}
                    // onChange={handleChangeDate}
                    className="p-2 rounded-lg border text-sm outline-gray-400 mx-3"
                  />
                  <input
                    type="date"
                    name="date2"
                    value={dateInput.date2}
                    // onChange={handleChangeDate}
                    className="p-2 rounded-lg border text-sm outline-gray-400"
                  />
                </>
              ) : (
                <input
                  type="text"
                  name="searchField"
                  // onChange={handleSearchField}
                  className="p-2 rounded-lg border text-base w-[30%] outline-gray-400"
                />
              )}
            </div>
            {showClosedCalls ? (
              <button
                onClick={handleShowClosedCalls}
                className="btnShowClosedCalls bg-green-600 hover:bg-green-700"
              >
                Visualizar Chamados Abertos
              </button>
            ) : (
              <button
                onClick={handleShowClosedCalls}
                className="btnShowClosedCalls"
              >
                Visualizar Chamados Fechados
              </button>
            )}

            <button onClick={handleOpenModal} className="btnAddChamado">
              Abrir um chamado
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-[8px] shadow-2xl overflow-hidden w-[95%] mx-auto">
          <Table
            // handleFilter={handleFilter}
            showClosedCalls={showClosedCalls}
            filteredCalls={filteredCalls}
            checkDescription={checkDescription}
            handleShowTramites={handleShowTramites}
            handleEditModal={handleEditModal}
            handleReopenCall={handleReopenCall}
            handleCloseCall={handleCloseCall}
            totalTime={totalTime}
          />
        </div>
        <div className="w-[95%] mt-4 flex gap-4 items-center justify-end mx-auto">
          <button 
            className="btnExport" 
            // onClick={handleDownload}
          >
            Exportar para Excel
          </button>
          <Image src="/excel.svg" width={48} height={48} alt="logo excel" />
        </div>

        {/* === Configuração do Modal =====  */}
        {/* <CreateCallModal
          userUid={userUid}
          projectUid={project.key}
          isModalOpen={isModalOpen}
          setModal={setModal}
          personsInProject={personsInProject}
        />
        <EditCallModal
          projectUid={project.key}
          userUid={userUid}
          isEditModalOpen={isEditModalOpen}
          setEditModal={setEditModal}
          callToEdit={callToEdit}
          setCallToEdit={setCallToEdit}
          personsInProject={personsInProject}
        />
        <DescriptionModal
          isDescriptionModalOpen={isDescriptionModalOpen}
          setDescriptionModal={setDescriptionModal}
          description={description}
        /> */}
      </div>
      {/* <InviteMessageToast
        open={openToast}
        setOpen={setOpenToast}
        info={toastInfo}
      /> */}
    </div>
  );
}

export default Helpdesk;
