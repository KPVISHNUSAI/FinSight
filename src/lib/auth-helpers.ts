
export function getFirebaseAuthErrorMessage(error: any): string {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
        return error.message || "An unexpected error occurred.";
    }
    switch (error.code) {
        case "auth/invalid-email":
            return "The email address is not valid.";
        case "auth/user-disabled":
            return "This account has been disabled.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Invalid email or password.";
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/weak-password":
            return "The password is too weak. It must be at least 6 characters long.";
        default:
            return "An unexpected error occurred. Please try again.";
    }
}
