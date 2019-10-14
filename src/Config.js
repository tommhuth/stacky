export default {
    BOTTOM_SLICE_HEIGHT: 30,
    SLICE_SIZE: 3,
    SLICE_HEIGHT: .75,
    SLICE_SPEED_INCREMENT: .03,
    DIRECT_HIT_THRESHOLD: .05,
    DIRECT_HIT_ADDITION: .1,
    DIRECT_HIT_ADDITION_THRESHOLD: 3,
    STATE_READY: "state:ready",
    STATE_ACTIVE: "state:active",
    STATE_GAME_OVER: "state:game-over",
    REGISTER_SERVICEWORKER: process.env.REGISTER_SERVICEWORKER === "true"
}
