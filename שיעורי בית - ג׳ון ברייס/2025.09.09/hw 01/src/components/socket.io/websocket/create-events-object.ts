import type User from "../../../models/user";
import type { AppDispatch } from "../../../redux/store";
import NewPostFeedDispatcher from "./NewPostFeedDispatcher";
import NewPostProfileDispatcher from "./NewPostProfileDispatcher";

export default function createEventsObject(userId: string, dispatch: AppDispatch, following: User[]) {
    return {
        "new-post": [
            new NewPostProfileDispatcher(userId, dispatch),
            new NewPostFeedDispatcher(userId, dispatch, following)
        ],
        "new-follow": [
            
        ]
    }
}