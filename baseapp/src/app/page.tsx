import { BaseAppGate } from "@/components/BaseAppGate";
import { GameApp } from "@/components/GameApp";

export default function Home() {
  return (
    <BaseAppGate>
      <GameApp />
    </BaseAppGate>
  );
}
