export class ApiError extends Error {
    status: number;
    field: string;

    constructor(status: number, message: string, field: string = '') {
        super(message);
        this.status = status;
        this.field = field;
    }


    static UnauthorizedError() {
        return new ApiError(401, 'User unauthorized')
    }

    static NotFoundError(message: string) {
        return new ApiError(404, message)
    }

    static ForbiddenError() {
        return new ApiError(403, 'Access denied')
    }

    static BadRequestError(message: string, field: string) {
        return new ApiError(400, message, field)
    }

}
