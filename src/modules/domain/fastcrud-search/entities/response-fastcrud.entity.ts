export default interface ResponseFastcrudEntity {
    successful: boolean,
    message: string,
    httpStatus: number,
    data: any[] | null
}