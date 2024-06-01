import { Account } from "../account/Account";

export interface Tweety {
    id: string;
    accountId: string;
    account: Pick<Account, 'id' | 'name' | 'surname' | 'profilePicture'>;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    upAccountIds: string[];
    downAccountIds: string[];
    repostAccountIds: string[];
}