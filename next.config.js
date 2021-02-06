module.exports = {
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL
    },

    // Firebase is binary reliant, and this option is needed for binaries.
    target: 'experimental-serverless-trace'
}