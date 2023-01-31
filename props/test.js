import { findExports, generate, validFile } from '../../public/propTypes-generator';
import { files as fstr } from './files.js';

console.log('files', fstr);
const result = [];
const r = findExports(fstr, '/index.js', result);
console.log(r);
result.forEach(r => {
    const ret = {};
    generate(validFile(fstr, r.filePath)?.code, r.fileName).then(d => {
        fs.writeFileSync('./RESULT.json', JSON.stringify(d));
    });
});
