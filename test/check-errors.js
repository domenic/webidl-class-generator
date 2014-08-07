var assert = require("assert");
var fs = require("fs");
var glob = require("glob");
var path = require("path");

import generate from "..";

describe("Checking that correct errors are thrown", () => {
    glob.sync(path.resolve(__dirname, "errors/*.idl")).forEach(idlFilePath => {
        var idlFileName = path.basename(idlFilePath);
        var errorFileName = path.basename(idlFilePath, ".idl") + ".txt";
        var errorFilePath = path.resolve(__dirname, "errors", errorFileName);

        var idlContents = fs.readFileSync(idlFilePath, { encoding: "utf-8" });
        var errrorContents = fs.readFileSync(errorFilePath, { encoding: "utf-8" }).trim();

        specify(idlFileName, () => {
            assert.throws(() => generate(idlContents), er => er.message.contains(errrorContents));
        });
    });
});
