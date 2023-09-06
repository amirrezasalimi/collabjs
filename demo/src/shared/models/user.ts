import { Client } from "@collabjs/react/dist/types/client";

export interface User extends Client {
    userId: string;
    name: string;
    position: {
        x: number
        y: number
    }
}