const { RequestTypeEnum } = require('../../../../utils/request.js');
const { request } = require('../../../../utils/request.js');

// const server = 'http://codesandbox.jd.com';
const server = 'http://127.0.0.1:7001';

function createCode(data) {
    return request({
        url: `${server}/api/coder/create`,
        method: RequestTypeEnum.POST,
        data: {
            template: 'create-react-app',
            template_type: 'NATIVE',
            ...data,
        },
    });
}

function editCode(data) {
    console.log('editCode', data);
    return request({
        url: `${server}/api/coder/edit/${data.id}`,
        method: RequestTypeEnum.POST,
        data: {
            template: 'create-react-app',
            template_type: 'NATIVE',
            ...data,
        },
    }).then(d => {
        console.log(d);
    });
}

module.exports = {
    createCode,
    editCode,
};
