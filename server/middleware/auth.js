import jwt from 'jsonwebtoken'

const auth = async (request, response, next) => {
    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]
       
        // Allow anyone to proceed with placing an order (no token check)
        if (!token) {
            // You can either set userId as null or skip this part
            request.userId = null;
            return next(); // Proceed to the next middleware or route handler
        }

        // If a token exists, verify it
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

        if (!decode) {
            return response.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            })
        }

        request.userId = decode.id
        next()

    } catch (error) {
        return response.status(500).json({
            message: "An error occurred during authentication", // Generic error message
            error: true,
            success: false
        })
    }
}

export default auth