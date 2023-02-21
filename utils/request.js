/**
 * /* eslint-disable camelcase
 *
 * @format
 */
const axios = require('axios');

const RequestTypeEnum = {
    GET: 'get',
    PUT: 'put',
    DELETE: 'delete',
    POST: 'post',
};

const request = ({ method, ...options }) =>
    new Promise((resolve, reject) => {
        const { data, ...rest } = options;
        if (method === RequestTypeEnum.GET || method === RequestTypeEnum.DELETE) {
            rest.params = data;
        } else {
            rest.data = data;
        }
        axios({ ...rest, method })
            .then(res => {
                const {
                    status,
                    data: { status: dataStatus, result, data: resultData, code, success },
                } = res;
                if (status === 200 && (dataStatus === 200 || code === 0 || success === true)) {
                    resolve(result || resultData);
                } else {
                    console.error('请求返回异常，请检查：', options);
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject(res);
                }
            })
            .catch(e => {
                console.error('请求异常：', e.message);
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({
                    error: e.message,
                    options,
                });
            });
    }).catch(e => {
        throw new Error(e);
    });

module.exports = { request, RequestTypeEnum };
