import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { CreatePoll } from "./pages/CreatePoll";
import { PollPage } from "./pages/PollPage";
import { About } from "./pages/About";
import { Api } from "./pages/Api";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/new" element={<CreatePoll />} />
        <Route path="/about" element={<About />} />
        <Route path="/api" element={<Api />} />
        <Route path="/e/:id" element={<PollPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
