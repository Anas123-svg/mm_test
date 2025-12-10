export interface Coordinates {
  lat: number
  lng: number
}

export interface Neighborhood {
  name: string
  coordinates: Coordinates[]
}

export interface Borough {
  name: string
  neighborhoods: Neighborhood[]
}