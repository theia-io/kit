import {Tweety} from './tweety';

export interface Bookmark {
    id: string;
    profileId: string;
    tweetId: Tweety['id'];
}