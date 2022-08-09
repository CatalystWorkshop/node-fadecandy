'use strict'

const FadeCandy = require('./dist/FadeCandy')

let fc = new FadeCandy()

fc.on(FadeCandy.events.READY, function () {

    console.log('FadeCandy.events.READY')

    // create default color look up table
    fc.clut.create()

    // set fadecandy led to manual mode
    fc.config.set(fc.Configuration.schema.LED_MODE, 1)

    // blink that led
    let state = false
    setInterval(() => {
        state = !state;
        fc.config.set(fc.Configuration.schema.LED_STATUS, +state)
    }, 100)
    fc.config.set(fc.Configuration.schema.DISABLE_KEYFRAME_INTERPOLATION, false);
})

fc.on(FadeCandy.events.COLOR_LUT_READY, () => {
    console.log('FadeCandy.events.COLOR_LUT_READY')
    let frame = 0;
    let PIXELS = 64;
    let seedR = Math.floor(Math.random() * 255);
    let seedG = Math.floor(Math.random() * 255);
    let seedB = Math.floor(Math.random() * 255);
    let data = new Uint8Array(PIXELS * 3).fill(0);

    setInterval(() => {
        data.fill(0);
        let pixel = frame % PIXELS;
        data[pixel] = seedR++ % 255
        data[pixel + 1] = seedG++ % 255
        data[pixel + 2] = seedB++ % 255
        fc.send(data)
        frame++
    }, 300)

    process.on("SIGINT", () => {
        fc.send(data.fill(0));
        process.exit();
    });
})
