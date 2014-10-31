const assert = require("assert");
const fs = require("fs");
const glob = require("glob");
const path = require("path");

import generate from "..";

describe("Checking inputs against outputs", () => {
    glob.sync(path.resolve(__dirname, "cases/*.idl")).forEach(idlFilePath => {
        const idlFileName = path.basename(idlFilePath);
        const withoutExtension = path.basename(idlFilePath, ".idl");
        const jsFileName = withoutExtension + ".js";
        const implModuleName = `./${withoutExtension}-impl.js`;
        const jsFilePath = path.resolve(__dirname, "cases", jsFileName);

        const idlContents = fs.readFileSync(idlFilePath, { encoding: "utf-8" });
        const jsContents = fs.readFileSync(jsFilePath, { encoding: "utf-8" });

        specify(idlFileName, () => {
            assert.strictEqual(generate(idlContents, implModuleName), jsContents);
        });
    });
});
