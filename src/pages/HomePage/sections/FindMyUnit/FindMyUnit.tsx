import { useEffect, useState } from "react";
import FindMyUnitWizard from "@/components/FindMyUnitWizard/FindMyUnitWizard";
import ResultList from "@/components/FindMyUnitWizard/ResultList";
import { urlFor } from "@/lib/sanity/image";
import "./FindMyUnit.css";

export type Need = "cooling" | "coolingHeating";
export type Vehicle = "trailer" | "truck" | "none";
export type Energy = "electric" | "fuel" | null;
export type PowerChoice = "self" | "vp_standby" | "vp_no_standby" | null;

type Props = {
  title: string;
  image?: any;
};

export default function FindMyUnit({ title, image }: Props) {
  // ✅ answers live in the parent (shared by wizard + results)
  const [need, setNeed] = useState<Need>("cooling");
  const [vehicle, setVehicle] = useState<Vehicle>(null);
  const [energy, setEnergy] = useState<Energy>(null);
  const [powerChoice, setPowerChoice] = useState<PowerChoice>(null);

  // ✅ HARD RESET when Q1 changes (as you requested)
  useEffect(() => {
    setVehicle(null);
    setEnergy(null);
    setPowerChoice(null);
  }, [need]);

  // ✅ Reset downstream when vehicle changes away from truck or none
  useEffect(() => {
    if (vehicle !== "truck") {
      setEnergy(null);
      setPowerChoice(null);
    }
    if (vehicle === "none") {
      setEnergy(null);
      setPowerChoice(null);
    }
  }, [vehicle]);

  // ✅ If user switches to Cooling+Heating, clear truck-only answers
  useEffect(() => {
    if (need === "coolingHeating") {
      setEnergy(null);
      setPowerChoice(null);
    }
  }, [need]);

  return (
    <>
      <section className="find-my-unit">
        <div className="find-my-unit__inner">
          {/* LEFT */}
          <div className="find-my-unit__left">
            <h2 className="find-my-unit__title">{title}</h2>

            <div className="find-my-unit__wizard">
              <FindMyUnitWizard
                need={need}
                setNeed={setNeed}
                vehicle={vehicle}
                setVehicle={setVehicle}
                energy={energy}
                setEnergy={setEnergy}
                powerChoice={powerChoice}
                setPowerChoice={setPowerChoice}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="find-my-unit__right">
            {image && (
              <img
                className="find-my-unit__img"
                src={urlFor(image).width(1400).url()}
                alt=""
              />
            )}
          </div>
        </div>
      </section>

      {/* ✅ FULL WIDTH RESULTS */}
      <section className="find-my-unit__full">
        <ResultList
          need={need}
          vehicle={vehicle}
          energy={energy}
          powerChoice={powerChoice}
        />
      </section>
    </>
  );
}
