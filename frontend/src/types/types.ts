export interface IAddressData {
    
    coords?: {
        lat?: number | undefined,
        lng?: number | undefined,
    },
    street: string,
    address1: string,
    address2: string
}
export interface IUser {
    token?: string,
    _id?:string,
    name?: string;
    email?: string;
    password?: string;
    profile_img?: string;
    address?: IAddressData;
    createdAt?: Date;
    updatedAt?: Date;
}

// TypeScript interface for RenterDetails
export interface IRenterDetails{
    renter?: IUser | null;
    days?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
  
// TypeScript interface for Product
export interface IProduct{
    _id?:string,
    owner?: IUser;
    renterDetails?: IRenterDetails;
    imageUrl?: string;
    title?: string;
    price?: number;
    description?: string;
    available?: boolean;
    approved?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}