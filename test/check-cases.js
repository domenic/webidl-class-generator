var assert = require("assert");
var fs = require("fs");
var glob = require("glob");
var path = require("path");

import generate from "..";

describe("Checking inputs against outputs", () => {
    glob.sync(path.resolve(__dirname, "cases/*.idl")).forEach(idlFilePath => {
        var idlFileName = path.basename(idlFilePath);
        var jsFileName = path.basename(idlFilePath, ".idl") + ".js";
        var jsFilePath = path.resolve(__dirname, "cases", jsFileName);

        var idlContents = fs.readFileSync(idlFilePath, { encoding: "utf-8" });
        var jsContents = fs.readFileSync(jsFilePath, { encoding: "utf-8" });

        specify(idlFilePath, () => {
            assert.strictEqual(generate(idlContents), jsContents);
        });
    });
});
