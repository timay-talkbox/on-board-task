module.exports = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    AIRTABLE_KEY: "keygI9B01Rl28VLMj",
    AIRTABLE_API_SERVER: "https://api.airtable.com/v0/appMagvoR7IoNzb7Q",
    SALT: "$2b$10$um3C7fVFQupY/M4z3oNDre",
    JWT_KEY: "appMagvoR7IoNzb7Q",
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};
