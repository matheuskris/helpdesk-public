import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectProject } from "../store/userSlicer/user.selector";

export default function AsideMenu() {
  const [isMenuOpen, setMenu] = useState(false);
  const project = useSelector(selectProject);

  async function handleclick() {
    const email = "matheuskrisgmailcom";

    const response = await fetch(`/api/${email}/sendInvite`).then((response) =>
      response.json()
    );
    console.log(response);
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
          <h2 onClick={handleclick}>Adicionar pessoas no projeto</h2>
          <h2>Editar horas mensais de produção</h2>
        </div>
      )}
    </div>
  );
}
