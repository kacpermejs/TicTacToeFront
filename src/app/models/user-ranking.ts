import { Ranking } from "./ranking";
import { User } from "./user";

export interface UserRanking extends User {
    ranking?: Ranking;
}

