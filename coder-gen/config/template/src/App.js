import React from 'react';
import { Button } from 'antd';
import './styles.css';

function Demo({ size, title }) {
    return (
        <div className='jmtd-button-demo'>
            <h1>{title}xxx=</h1>
            <Button semantic='primary' size={size}>
                large
            </Button>
        </div>
    );
}

Demo.defaultProps = {
    size: 'large',
    title: 'meinuo test',
};

export default Demo;
