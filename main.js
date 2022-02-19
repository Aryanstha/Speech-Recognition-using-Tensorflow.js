"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var device_detector_js_2_2_10_1 = require("https://cdn.skypack.dev/device-detector-js@2.2.10");
var mpHands = window;
var drawingUtils = window;
var controls = window;
var controls3d = window;
// Usage: testSupport({client?: string, os?: string}[])
// Client and os are regular expressions.
// See: https://cdn.jsdelivr.net/npm/device-detector-js@2.2.10/README.md for
// legal values for client and os
testSupport([
    { client: 'Chrome' },
]);
function testSupport(supportedDevices) {
    var deviceDetector = new device_detector_js_2_2_10_1.default();
    var detectedDevice = deviceDetector.parse(navigator.userAgent);
    var isSupported = false;
    for (var _i = 0, supportedDevices_1 = supportedDevices; _i < supportedDevices_1.length; _i++) {
        var device = supportedDevices_1[_i];
        if (device.client !== undefined) {
            var re = new RegExp("^".concat(device.client, "$"));
            if (!re.test(detectedDevice.client.name)) {
                continue;
            }
        }
        if (device.os !== undefined) {
            var re = new RegExp("^".concat(device.os, "$"));
            if (!re.test(detectedDevice.os.name)) {
                continue;
            }
        }
        isSupported = true;
        break;
    }
    if (!isSupported) {
        alert("This demo, running on ".concat(detectedDevice.client.name, "/").concat(detectedDevice.os.name, ", ") +
            "is not well supported at this time, continue at your own risk.");
    }
}
// Our input frames will come from here.
var videoElement = document.getElementsByClassName('input_video')[0];
var canvasElement = document.getElementsByClassName('output_canvas')[0];
var controlsElement = document.getElementsByClassName('control-panel')[0];
var canvasCtx = canvasElement.getContext('2d');
var config = { locateFile: function (file) {
        return "https://cdn.jsdelivr.net/npm/@mediapipe/hands@".concat(mpHands.VERSION, "/").concat(file);
    } };
// We'll add this to our control panel later, but we'll save it here so we can
// call tick() each time the graph runs.
var fpsControl = new controls.FPS();
// Optimization: Turn off animated spinner after its hiding animation is done.
var spinner = document.querySelector('.loading');
spinner.ontransitionend = function () {
    spinner.style.display = 'none';
};
var landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
var grid = new controls3d.LandmarkGrid(landmarkContainer, {
    connectionColor: 0xCCCCCC,
    definedColors: [{ name: 'Left', value: 0xffa500 }, { name: 'Right', value: 0x00ffff }],
    range: 0.2,
    fitToGrid: false,
    labelSuffix: 'm',
    landmarkSize: 2,
    numCellsPerAxis: 4,
    showHidden: false,
    centered: false,
});
function onResults(results) {
    // Hide the spinner.
    document.body.classList.add('loaded');
    // Update the frame rate.
    fpsControl.tick();
    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks && results.multiHandedness) {
        for (var index = 0; index < results.multiHandLandmarks.length; index++) {
            var classification = results.multiHandedness[index];
            var isRightHand = classification.label === 'Right';
            var landmarks = results.multiHandLandmarks[index];
            drawingUtils.drawConnectors(canvasCtx, landmarks, mpHands.HAND_CONNECTIONS, { color: isRightHand ? '#00FF00' : '#FF0000' });
            drawingUtils.drawLandmarks(canvasCtx, landmarks, {
                color: isRightHand ? '#00FF00' : '#FF0000',
                fillColor: isRightHand ? '#FF0000' : '#00FF00',
                radius: function (data) {
                    return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
                }
            });
        }
    }
    canvasCtx.restore();
    if (results.multiHandWorldLandmarks) {
        // We only get to call updateLandmarks once, so we need to cook the data to
        // fit. The landmarks just merge, but the connections need to be offset.
        var landmarks = results.multiHandWorldLandmarks.reduce(function (prev, current) { return __spreadArray(__spreadArray([], prev, true), current, true); }, []);
        var colors = [];
        var connections = [];
        var _loop_1 = function (loop) {
            var offset = loop * mpHands.HAND_CONNECTIONS.length;
            var offsetConnections = mpHands.HAND_CONNECTIONS.map(function (connection) {
                return [connection[0] + offset, connection[1] + offset];
            });
            connections = connections.concat(offsetConnections);
            var classification = results.multiHandedness[loop];
            colors.push({
                list: offsetConnections.map(function (unused, i) { return i + offset; }),
                color: classification.label,
            });
        };
        for (var loop = 0; loop < results.multiHandWorldLandmarks.length; ++loop) {
            _loop_1(loop);
        }
        grid.updateLandmarks(landmarks, connections, colors);
    }
    else {
        grid.updateLandmarks([]);
    }
}
var hands = new mpHands.Hands(config);
hands.onResults(onResults);
// Present a control panel through which the user can manipulate the solution
// options.
new controls
    .ControlPanel(controlsElement, {
    selfieMode: true,
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
})
    .add([
    new controls.StaticText({ title: 'MediaPipe Hands' }),
    fpsControl,
    new controls.Toggle({ title: 'Selfie Mode', field: 'selfieMode' }),
    new controls.SourcePicker({
        onFrame: function (input, size) { return __awaiter(void 0, void 0, void 0, function () {
            var aspect, width, height;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        aspect = size.height / size.width;
                        if (window.innerWidth > window.innerHeight) {
                            height = window.innerHeight;
                            width = height / aspect;
                        }
                        else {
                            width = window.innerWidth;
                            height = width * aspect;
                        }
                        canvasElement.width = width;
                        canvasElement.height = height;
                        return [4 /*yield*/, hands.send({ image: input })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    }),
    new controls.Slider({
        title: 'Max Number of Hands',
        field: 'maxNumHands',
        range: [1, 4],
        step: 1
    }),
    new controls.Slider({
        title: 'Model Complexity',
        field: 'modelComplexity',
        discrete: ['Lite', 'Full'],
    }),
    new controls.Slider({
        title: 'Min Detection Confidence',
        field: 'minDetectionConfidence',
        range: [0, 1],
        step: 0.01
    }),
    new controls.Slider({
        title: 'Min Tracking Confidence',
        field: 'minTrackingConfidence',
        range: [0, 1],
        step: 0.01
    }),
])
    .on(function (x) {
    var options = x;
    videoElement.classList.toggle('selfie', options.selfieMode);
    hands.setOptions(options);
});
