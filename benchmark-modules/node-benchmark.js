const { BenchmarkSuite } = require('./base');
require('./richards');
require('./deltablue');
require('./crypto');
require('./raytrace');
require('./earley-boyer');
require('./splay');
require('./navier-stokes');
require('./box2d');

var completed = 0;
var benchmarks = BenchmarkSuite.CountBenchmarks();
var success = true;
var latencyBenchmarks = ["Splay", "Mandreel"];
var skipBenchmarks =
typeof skipBenchmarks === "undefined" ? [] : skipBenchmarks;

function AddResult(name, result) {
    console.log(name + ': ' + result);
}

function AddError(name, error) {
    console.log(name + ": " + error.message);
    if (error == "TypedArrayUnsupported") {
    AddResult(name, '<b>Unsupported<\/b>');
    } else if (error == "PerformanceNowUnsupported") {
    AddResult(name, '<b>Timer error<\/b>');
    } else {
    AddResult(name, '<b>Error</b>');
    }
    success = false;
}

function AddScore(score) {
    console.log({score});
}

function Run() {
        BenchmarkSuite.RunSuites({
            NotifyError : AddError,
            NotifyResult : AddResult,
            NotifyScore : AddScore
        }, skipBenchmarks);
    }

function CheckCompatibility() {
    // If no Typed Arrays support, show warning label.
    var hasTypedArrays = typeof Uint8Array != "undefined"
        && typeof Float64Array != "undefined"
        && typeof (new Uint8Array(0)).subarray != "undefined";

    if (!hasTypedArrays) {
    console.log("Typed Arrays not supported");
    document.getElementById("alertbox").style.display="block";
    }
    if (window.document.URL.indexOf('skip_zlib=1') >= 0)
    skipBenchmarks.push("zlib");
    if (window.document.URL.indexOf('auto=1') >= 0)
    Run();
}
Run();
