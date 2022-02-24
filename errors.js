class IllegalInputError extends Error {
    constructor(message) {
        super(message);
        this.name = "IllegalInputError";
    }
}
exports.IllegalInputError = IllegalInputError;