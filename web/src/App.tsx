import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { CreatePoll } from "./pages/CreatePoll";
import { PollPage } from "./pages/PollPage";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/new" element={<CreatePoll />} />
        <Route path="/e/:id" element={<PollPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
