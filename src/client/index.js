import { generateAction } from './js/app'
import { generateFullAction } from './js/geoinformation'

import './styles/style.scss'

// export into the client library
export {
    generateAction,
    generateFullAction,
}

setTimeout(document.getElementById('generate').addEventListener('click', generateAction), 0);

setTimeout(document.getElementById('geoinformation').addEventListener('click', generateFullAction), 0);