declare module 'nominatim-geocoder' {
    interface GeocodeResponse {
      lat: string;
      lon: string;
      display_name: string;
      address: {
        road?: string;
        suburb?: string;
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        country?: string;      };
    }
  
    interface ReverseGeocodeParams {
      lat: number;
      lon: number;
    }
  
    class Geocoder {
      reverse(params: ReverseGeocodeParams): Promise<GeocodeResponse>;
    }
  
    export = Geocoder;
  }
  