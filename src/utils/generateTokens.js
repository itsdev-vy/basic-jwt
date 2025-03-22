const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};

export { generateAccessToken, generateRefreshToken };


// It is not a good approach we should attach these function to the user model itself because :-
// Using instance methods in Mongoose provides better encapsulation, reusability, and maintainability.
// It keeps the logic within the model, making it easier to work with user instances.
// This approach is cleaner, more modular, and follows best practices for Mongoose.
// So no need to paas any data it work with the instance of the model itself.



// Here also i will not going to use the above code because i will use the instance method of the user model itself to generate the token and bcrypt password matching.