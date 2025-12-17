import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useOverlay } from "@/context/OverlayContext";
import { client } from "@/lib/sanity/client";
import { FIND_LABELS_QUERY } from "@/lib/sanity/queries";
import "./FindMyUnitWizard.css";

import type { Need, Vehicle, Energy, PowerChoice } from "@/types/findMyUnit";

type Labels = Record<string, any>;

type Props = {
  mode?: "home" | "trucks";

  need: Need;
  setNeed: (v: Need) => void;

  vehicle: Vehicle;
  setVehicle: (v: Vehicle) => void;

  energy: Energy;
  setEnergy: (v: Energy) => void;

  powerChoice: PowerChoice;
  setPowerChoice: (v: PowerChoice) => void;
};

export default function FindMyUnitWizard({
  mode = "home",
  need,
  setNeed,
  vehicle,
  setVehicle,
  energy,
  setEnergy,
  powerChoice,
  setPowerChoice,
}: Props) {
  const { lang } = useLanguage();
  const { openOverlay } = useOverlay();

  const [labels, setLabels] = useState<Labels | null>(null);

  const [powerOpen, setPowerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isTrucksMode = mode === "trucks";
  const showVehicleQuestion = !isTrucksMode;

  // Trucks mode locks wizard to truck
  useEffect(() => {
    if (isTrucksMode && vehicle !== "truck") setVehicle("truck");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrucksMode]);

  useEffect(() => {
    client.fetch(FIND_LABELS_QUERY).then((data) => setLabels(data || {}));
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        powerOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setPowerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [powerOpen]);

  const t = (enKey: string, arKey: string, fallbackEn: string) =>
    lang === "ar"
      ? (labels?.[arKey] ?? fallbackEn)
      : (labels?.[enKey] ?? fallbackEn);

  // power labels + descriptions
  const pSelfTitle = t(
    "opt_selfPowered_en",
    "opt_selfPowered_ar",
    "Self Powered"
  );
  const pSelfDesc = t("opt_selfPowered_desc_en", "opt_selfPowered_desc_ar", "");

  const pVpsTitle = t(
    "opt_vehiclePoweredWithStandby_en",
    "opt_vehiclePoweredWithStandby_ar",
    "Vehicle Powered with Standby"
  );
  const pVpsDesc = t(
    "opt_vehiclePoweredWithStandby_desc_en",
    "opt_vehiclePoweredWithStandby_desc_ar",
    ""
  );

  const pVpTitle = t(
    "opt_vehiclePoweredNoStandby_en",
    "opt_vehiclePoweredNoStandby_ar",
    "Vehicle Powered without Standby"
  );
  const pVpDesc = t(
    "opt_vehiclePoweredNoStandby_desc_en",
    "opt_vehiclePoweredNoStandby_desc_ar",
    ""
  );

  const diffText = t(
    "powerDifferenceQuestion_en",
    "powerDifferenceQuestion_ar",
    "What’s the difference?"
  );

  // logic
  const isTruck = isTrucksMode ? true : vehicle === "truck";
  const isTruckHeatMode = isTruck && need === "coolingHeating";

  // Cooling+Heating + Truck => skip Q3/Q4
  const showElectricQuestion = isTruck && !isTruckHeatMode;
  const showPowerQuestion = isTruck && !isTruckHeatMode && energy === "fuel";

  const powerLabel =
    powerChoice === "self"
      ? pSelfTitle
      : powerChoice === "vp_standby"
        ? pVpsTitle
        : powerChoice === "vp_no_standby"
          ? pVpTitle
          : t("select_power_en", "select_power_ar", "Select one");

  return (
    <div className="fmu">
      {/* Q1 */}
      <div className="fmu__block">
        <div className="fmu__q">
          {t("q_need_en", "q_need_ar", "What do you need?")}
        </div>

        <div className="fmu__pillRow">
          <button
            type="button"
            className={`fmu__pill ${need === "cooling" ? "is-active" : ""}`}
            onClick={() => {
              setNeed("cooling");
              setEnergy(null);
              setPowerChoice(null);
              setPowerOpen(false);
            }}
          >
            {t("opt_cooling_en", "opt_cooling_ar", "Cooling")}
          </button>

          <button
            type="button"
            className={`fmu__pill ${need === "coolingHeating" ? "is-active" : ""}`}
            onClick={() => {
              setNeed("coolingHeating");
              setEnergy(null);
              setPowerChoice(null);
              setPowerOpen(false);
            }}
          >
            {t(
              "opt_coolingHeating_en",
              "opt_coolingHeating_ar",
              "Cooling + Heating"
            )}
          </button>
        </div>
      </div>

      {/* Q2 (HOME ONLY) */}
      {showVehicleQuestion && (
        <div className="fmu__block">
          <div className="fmu__q">
            {t("q_vehicle_en", "q_vehicle_ar", "What is your vehicle type?")}
          </div>

          <div className="fmu__segRow">
            <button
              type="button"
              className={`fmu__seg ${vehicle === "trailer" ? "is-active" : ""}`}
              onClick={() => {
                setVehicle("trailer");
                setEnergy(null);
                setPowerChoice(null);
                setPowerOpen(false);
              }}
            >
              {t("opt_trailer_en", "opt_trailer_ar", "Trailer")}
            </button>

            <button
              type="button"
              className={`fmu__seg ${vehicle === "truck" ? "is-active" : ""}`}
              onClick={() => {
                setVehicle("truck");
                setEnergy(null);
                setPowerChoice(null);
                setPowerOpen(false);
              }}
            >
              {t("opt_truck_en", "opt_truck_ar", "Truck/Van")}
            </button>

            <button
              type="button"
              className={`fmu__seg ${vehicle === "none" ? "is-active" : ""}`}
              onClick={() => {
                setVehicle("none");
                setEnergy(null);
                setPowerChoice(null);
                setPowerOpen(false);
              }}
            >
              {t("opt_noVehicle_en", "opt_noVehicle_ar", "I don’t have one")}
            </button>
          </div>
        </div>
      )}

      {/* Q3 Electric */}
      {vehicle !== "none" && showElectricQuestion && (
        <div className="fmu__block">
          <div className="fmu__q">
            {t("q_electric_en", "q_electric_ar", "Is your vehicle electric?")}
          </div>

          <div className="fmu__pillRow">
            <button
              type="button"
              className={`fmu__pill ${energy === "electric" ? "is-active" : ""}`}
              onClick={() => {
                setEnergy("electric");
                setPowerChoice(null);
                setPowerOpen(false);
              }}
            >
              {t("opt_yes_en", "opt_yes_ar", "Yes")}
            </button>

            <button
              type="button"
              className={`fmu__pill ${energy === "fuel" ? "is-active" : ""}`}
              onClick={() => {
                setEnergy("fuel");
                setPowerChoice(null);
                setPowerOpen(false);
              }}
            >
              {t("opt_no_en", "opt_no_ar", "No")}
            </button>
          </div>
        </div>
      )}

      {/* Q4 Power dropdown */}
      {vehicle !== "none" && showPowerQuestion && (
        <div className="fmu__block">
          <div className="fmu__q">
            {t(
              "q_powerSource_en",
              "q_powerSource_ar",
              "Do You want a Self Powered Unit or a Vehicle Powered Unit?"
            )}
          </div>

          <div className="fmu__powerRow">
            <div className="fmu__dropdown" ref={dropdownRef}>
              <button
                type="button"
                className="fmu__dropdownBtn"
                onClick={() => setPowerOpen((v) => !v)}
              >
                <span
                  className={`fmu__dropdownLabel ${powerChoice ? "has-value" : ""}`}
                >
                  {powerLabel}
                </span>
                <span className={`fmu__chev ${powerOpen ? "is-open" : ""}`}>
                  ▾
                </span>
              </button>

              {powerOpen && (
                <div className="fmu__dropdownMenu">
                  <button
                    type="button"
                    className="fmu__dropdownItem"
                    onClick={() => {
                      setPowerChoice("self");
                      setPowerOpen(false);
                    }}
                  >
                    <div className="fmu__itemTitle">{pSelfTitle}</div>
                    {pSelfDesc ? (
                      <div className="fmu__itemDesc">{pSelfDesc}</div>
                    ) : null}
                  </button>

                  <div className="fmu__divider" />

                  <button
                    type="button"
                    className="fmu__dropdownItem"
                    onClick={() => {
                      setPowerChoice("vp_standby");
                      setPowerOpen(false);
                    }}
                  >
                    <div className="fmu__itemTitle">{pVpsTitle}</div>
                    {pVpsDesc ? (
                      <div className="fmu__itemDesc">{pVpsDesc}</div>
                    ) : null}
                  </button>

                  <div className="fmu__divider" />

                  <button
                    type="button"
                    className="fmu__dropdownItem"
                    onClick={() => {
                      setPowerChoice("vp_no_standby");
                      setPowerOpen(false);
                    }}
                  >
                    <div className="fmu__itemTitle">{pVpTitle}</div>
                    {pVpDesc ? (
                      <div className="fmu__itemDesc">{pVpDesc}</div>
                    ) : null}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className="fmu__diff"
              onClick={() => openOverlay("types")}
            >
              {diffText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
