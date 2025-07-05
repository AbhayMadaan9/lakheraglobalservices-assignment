
declare global {
    interface UserProfileData {
        _id: string,
        email: string
    }
    interface CustomError {
        data: {
            success: boolean;
            error_code: number;
            message: string;
        };
    }

    interface ApiResponse<T> {
        data: T;
        message: string;
        success: boolean;
    }
      interface ApiResponseList<T> {
        data: T[];
        message: string;
        success: boolean;
    }

    interface TaskType {
        _id: string,
        title: string,
        description: string,
        createdAt: Date
    }

    interface PaginationQuery {
        skip: number;
        limit: number;
    }
}
export { }