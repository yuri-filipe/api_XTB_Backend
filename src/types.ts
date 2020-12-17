export interface Arguments{
    userId:string
    password:string
}
export interface Msg {
    command:string
    
    arguments?:any
}  