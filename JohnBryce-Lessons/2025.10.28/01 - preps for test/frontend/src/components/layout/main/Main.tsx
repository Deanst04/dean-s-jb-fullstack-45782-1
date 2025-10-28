import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "../not-found/NotFound";
import NewGame from "../../games/new/NewGames";
import List from "../../games/list/List";

export default function Main() {
    return (
        <Routes>
            {/* <Route path="/" element={<Profile />} /> */}
            <Route path="/" element={<Navigate to="/games" />} />
            <Route path="/games" element={< List/>} />
            <Route path="/new-game" element={<NewGame />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
