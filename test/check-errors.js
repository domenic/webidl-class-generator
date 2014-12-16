const assert = require("assert");
const fs = require("fs");
const glob = require("glob");
const path = require("path");

import generate from "..";

describe("Checking that correct errors are thrown", () => {
    glob.sync(path.resolve(__dirname, "errors/*.idl")).forEach(idlFilePath => {
        const idlFileName = path.basename(idlFilePath);
        const errorFileName = path.basename(idlFilePath, ".idl") + ".txt";
        const errorFilePath = path.resolve(__dirname, "errors", errorFileName);

        const idlContents = fs.readFileSync(idlFilePath, { encoding: "utf-8" });
        const errrorContents = fs.readFileSync(errorFilePath, { encoding: "utf-8" }).trim();

        specify(idlFileName, () => {
            assert.throws(() => generate(idlContents), er => er.message.includes(errrorContents));
        });
    });
});
