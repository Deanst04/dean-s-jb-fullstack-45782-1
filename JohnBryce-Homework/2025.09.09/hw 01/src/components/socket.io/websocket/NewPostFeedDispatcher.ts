import type Post from "../../../models/post";
import type User from "../../../models/user";
import { indicateNewContentAvailable } from "../../../redux/feed-slice";
import type { AppDispatch } from "../../../redux/store";
import Dispatcher from "./Dispatcher";

export default class NewPostFeedDispatcher extends Dispatcher {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shouldDispatch(payload: any): boolean {
        return this.following.findIndex(f => f.id === (payload.post as Post).user.id) > -1
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    doDispatch(_payload: any): void {
        this.dispatch(indicateNewContentAvailable())
    }

    constructor(public userId: string, public dispatch: AppDispatch, public following: User[]) {
        super(userId, dispatch)
    }
}