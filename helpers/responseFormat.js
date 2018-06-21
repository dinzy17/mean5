var helper = {}

helper.error = (msg) => {
    return { status: "error", message: msg }
}

helper.success = (data = null) => {
    let res = { status: "success" }
    if (data) {
        res.data = data
    }
    return res
}

module.exports = helper
