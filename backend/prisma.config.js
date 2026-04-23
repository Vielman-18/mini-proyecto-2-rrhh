"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("@prisma/config");
exports.default = (0, config_1.defineConfig)({
    datasource: {
        provider: 'postgresql',
        url: process.env.DATABASE_URL,
    },
});
