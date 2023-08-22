/**
 * Clients added, updated and deleted to awareness.
 */
export interface AwarenessChange {
   /**
      * The clients added
      */
   added: number[]
   /**
      * The clients updated
      */
   updated: number[]
   /**
      * The clients removed
      */
   removed: number[]
}
export type Client = {
   uid: string
   id?: string
}
export interface Room {
   name: string
   clients: Client[]
}
