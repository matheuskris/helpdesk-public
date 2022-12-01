import * as HoverCard from "@radix-ui/react-hover-card";
import { getTimeInHoursFromMs } from "../utils/functions.utils";

const hourStock = {
  2022: {
    10: 112,
    11: 176,
  },
  2023: {
    0: 120,
    1: 130,
  },
};

export default function PersonsCard({ inCharge, totalTime }) {
  // const novemberParcialTime = 80;
  const month = {
    month: 9,
    year: 2022,
  };
  const stockhours = hourStock[month.year][month.month];

  const personInCharge = inCharge
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const eachTotalTime = getTimeInHoursFromMs(totalTime[personInCharge]);
  const ocupationTime = `${((eachTotalTime / stockhours) * 100).toFixed(0)}%`;
  return (
    <HoverCard.Root openDelay={100}>
      <HoverCard.Trigger>{inCharge}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content>
          <div className="bg-white border-solid border p-3 rounded-lg">
            <h3>{inCharge}</h3>
            <p>Estoque de horas: {stockhours}</p>
            <p>Horas consumidas: {eachTotalTime}</p>
            <p>Taxa de ocupação: {ocupationTime}</p>
          </div>
          <HoverCard.Arrow />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
