import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { client } from "../../lib/sanity/client";
import { FIND_LABELS_QUERY, UNITS_QUERY } from "../../lib/sanity/queries";
import UnitCard from "../UnitCard/UnitCard";
import "./ResultList.css";

type Need = "cooling" | "coolingHeating";
type Vehicle = "trailer" | "truck" | "none"; // ✅ FIX
type Energy = "electric" | "fuel" | null;
type PowerChoice = "self" | "vp_standby" | "vp_no_standby" | null;

type Labels = Record<string, any>;

type Unit = {
  _id: string;
  name: string;
  vehicleType: "trailer" | "truck";
  vehicleEnergy?: "electric" | "fuel";
  powerType?: "SP" | "VP";
  hasStandby?: boolean;
  coolingAndHeating?: boolean;

  image?: any;
  summary_en?: string;
  summary_ar?: string;
  description_en?: string;
  description_ar?: string;
  brochureUrl?: string;
};

type Props = {
  need: Need;
  vehicle: Vehicle; // ✅ FIX (now includes "none")
  energy: Energy;
  powerChoice: PowerChoice;
};

export default function ResultList({
  need,
  vehicle,
  energy,
  powerChoice,
}: Props) {
  const { lang } = useLanguage();

  const [labels, setLabels] = useState<Labels | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    Promise.all([client.fetch(FIND_LABELS_QUERY), client.fetch(UNITS_QUERY)])
      .then(([lbl, u]) => {
        if (!alive) return;
        setLabels(lbl || {});
        setUnits(u || []);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const resultsTitle = lang === "ar" ? "النتائج" : "Results";

  const noResultsText =
    lang === "ar"
      ? (labels?.noResults_ar ?? "لا توجد وحدات مطابقة.")
      : (labels?.noResults_en ?? "No matching units found.");

  const noVehicleText =
    lang === "ar"
      ? (labels?.contactText_ar ?? "")
      : (labels?.contactText_en ?? "");

  const canShowResults =
    vehicle === "trailer" ||
    (vehicle === "truck" && need === "coolingHeating") ||
    (vehicle === "truck" && energy === "electric") ||
    (vehicle === "truck" && energy === "fuel" && powerChoice !== null);

  const filteredUnits = useMemo(() => {
    if (!canShowResults) return [];
    if (vehicle === "none") return [];

    let list = [...units];

    // Trailer
    if (vehicle === "trailer") {
      if (need === "coolingHeating") {
        list = list.filter((u) => u.coolingAndHeating === true);
      }
      return list.filter((u) => u.vehicleType === "trailer");
    }

    // Truck + Cooling+Heating
    if (vehicle === "truck" && need === "coolingHeating") {
      return list.filter(
        (u) => u.vehicleType === "truck" && u.coolingAndHeating === true
      );
    }

    // Truck + Electric
    if (vehicle === "truck" && energy === "electric") {
      return list.filter(
        (u) => u.vehicleType === "truck" && u.vehicleEnergy === "electric"
      );
    }

    // Truck + Fuel
    if (vehicle === "truck" && energy === "fuel") {
      list = list.filter(
        (u) => u.vehicleType === "truck" && u.vehicleEnergy === "fuel"
      );

      if (powerChoice === "self") {
        list = list.filter((u) => u.powerType === "SP");
      } else if (powerChoice === "vp_standby") {
        list = list.filter(
          (u) => u.powerType === "VP" && u.hasStandby === true
        );
      } else if (powerChoice === "vp_no_standby") {
        list = list.filter(
          (u) => u.powerType === "VP" && u.hasStandby === false
        );
      }

      return list;
    }

    return [];
  }, [canShowResults, units, need, vehicle, energy, powerChoice]);

  if (loading) return null;

  if (vehicle === "none") {
    return noVehicleText ? (
      <div className="fmu__notice">{noVehicleText}</div>
    ) : null;
  }

  if (!canShowResults) return null;

  return (
    <div className="fmu__results">
      <div className="fmu__resultsTitle">{resultsTitle}</div>

      {filteredUnits.length === 0 ? (
        <div className="fmu__notice">{noResultsText}</div>
      ) : (
        <div className="fmu__cards">
          {filteredUnits.map((u) => (
            <UnitCard key={u._id} unit={u} />
          ))}
        </div>
      )}
    </div>
  );
}
