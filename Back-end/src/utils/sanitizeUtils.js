import createDomPurify from 'dompurify';
import {JSDOM} from 'jsdom';

const window = new JSDOM('').window;

export const DOMPurify = createDomPurify(window);
