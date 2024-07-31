import { Profile } from "../entities-kitouch";
import { TimeStamp } from "../helpers";

export interface Farewell extends Realm.Services.MongoDB.Document {
    profileId: Profile['id'];
    content: string;
    timestamp: TimeStamp;
    viewed: number;
}