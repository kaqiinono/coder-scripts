import React from 'react';
import { Button, Title } from '@jd/jmtd';
import styles from './index.module.css';

function Demo({ size }) {
    return (
        <div className={styles.demo}>
            <Title level={1}>Code Once, Use Everywhere!</Title>
            <div>
                <Button semantic='primary' size={size}>
                    <a src='http://ma.jd.com/code/index.html'>开始分享</a>
                </Button>
            </div>
        </div>
    );
}

Demo.defaultProps = {
    size: 'large',
    title: 'meinuo test',
};

export default Demo;
