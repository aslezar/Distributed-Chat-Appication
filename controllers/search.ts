import { User } from "../models"
import { Request, Response } from "express"
import { BadRequestError } from "../errors"
import { StatusCodes } from "http-status-codes"

const search = async (req: Request, res: Response) => {
    const { type, query } = req.query as {
        type: string
        query: string
    }
    if (!query) throw new BadRequestError("Query is required")

    switch (type) {
        case "user":
            //query is here either phone number or name
            const users = await User.find({
                $or: [
                    { phoneNo: query },
                    { name: { $regex: new RegExp(query, "i") } },
                ],
            })
                .select("name phoneNo image")
                .sort({ createdAt: -1 })

            return res.status(StatusCodes.OK).json({
                data: {
                    users,
                    page: req.pagination.page,
                    limit: req.pagination.limit,
                },
                success: true,
                msg: "Users Fetched Successfully",
            })

        default:
            throw new BadRequestError(
                "Invalid type, accepted types are 'user' and 'blog'",
            )
    }
}

export { search }
