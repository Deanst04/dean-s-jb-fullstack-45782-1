import axios from "axios"
import type { Audience } from "../models/Audience"

class AudiencesService {
    async getAll(): Promise<Audience[]> {
        const { data } = await axios.get<Audience[]>(`${import.meta.env.VITE_REST_SERVER_URL}/audience`)
        return data
    }
}

const audienceService = new AudiencesService()
export default audienceService