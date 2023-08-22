export type Client = {
    uid: number
    permission?: "edit" | "view"
    color: string
    [key: string]: any
}