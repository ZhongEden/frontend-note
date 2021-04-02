let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('111'), 1000)
})

class MyPromise {
    state = 'pending'
    result
    fulfilledCb = []
    rejectedCb = []
    constructor (fn) {
        let resolve = (res) => {
            if (Object.prototype.toString.call(res).indexOf('Promise') > -1) {
                res.then(resolve, reject)
                return
            }
            this.state = 'fulfilled'
            this.result = res
            setTimeout(() => {
                let cb
                while (cb = this.fulfilledCb.shift()) {
                    cb(this.result)
                }
            })
        }

        let reject = (err) => {
            this.state = 'rejected'
            this.result = err
            // 模拟异步执行
            setTimeout(() => {
                let cb
                while (cb = this.rejectedCb.shift()) {
                    cb(this.result)
                }
            })
        }
    }

    then (resolveCb, rejectCb) {
        let _resolveCb = function (res) {
            if (resolveCb) {
                let result
                try {
                    result = resolveCb(res)
                } catch (err) {

                }
            } else {

            }
        }
        let _this = this
        return new Promise((resolve, reject) => {
            if (_this.state === 'pending') {
                _this.fulfilledCb.push(function () {
                    if (resolveCb) {
                        let result
                        try {
                            result = resolveCb(_this.result)
                        } catch (err) {
                            reject(err)
                        }

                        resolve(result)
                    } else {
                        resolve(_this.result)
                    }
                })

                _this.rejectedCb.push(function () {
                    if (rejectCb) {
                        let result
                        try {
                            result = rejectCb(_this.result)
                        } catch (err) {
                            reject(err)
                        }

                        resolve(result)
                    } else {
                        resolve(_this.result)
                    }
                })
            }

            if (_this.state === 'fulfilled') {
                if (resolveCb) {
                    let result
                    try {
                        result = resolveCb(_this.result)
                    } catch (err) {
                        reject(err)
                    }

                    resolve(result)
                } else {
                    resolve(_this.result)
                }

                return
            }

            if (_this.state === 'rejected') {
                if (rejectCb) {
                    let result
                    try {
                        result = rejectCb(_this.result)
                    } catch (err) {
                        reject(err)
                    }

                    resolve(result)
                } else {
                    resolve(_this.result)
                }
            }
        })
    }
}
