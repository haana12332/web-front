export type SideBarType = {
  title: string;
  state: boolean;
};
export type Gps = {
  lat: number;
  lng: number;
};

export type SearchResult = {
  title: string;
  distance: number;
  position: Gps;
};

export type RouteSearch = {
  apikey:string;
  
}