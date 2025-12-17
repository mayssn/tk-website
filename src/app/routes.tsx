import { Routes, Route } from "react-router-dom";

import HomePage from "@/pages/HomePage/HomePage";
import TrailersPage from "@/pages/TrailersPage/TrailersPage";
import TrucksPage from "@/pages/TrucksPage/TrucksPage";
import MarinePage from "@/pages/MarinePage/MarinePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/trailers" element={<TrailersPage />} />
      <Route path="/trucks" element={<TrucksPage />} />
      <Route path="/marine" element={<MarinePage />} />
    </Routes>
  );
}
