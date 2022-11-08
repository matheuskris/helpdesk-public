import * as HoverCard from "@radix-ui/react-hover-card";
import { getTimeStringFromMs } from "../utils/functions.utils";

export default function PersonsCard({ inCharge, totalTime }) {
  const personInCharge = inCharge
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const personsTime = getTimeStringFromMs(totalTime[personInCharge]);
  return (
    <HoverCard.Root openDelay={100}>
      <HoverCard.Trigger>{inCharge}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content>
          <div className="bg-white border-solid border p-3 rounded-lg">
            <h3>{inCharge}</h3>
            <p>{personsTime}</p>
          </div>
          <HoverCard.Arrow />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
