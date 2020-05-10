import { generateFullAction } from './js/app'

import './styles/style.scss'

// export into the client library
export {
    generateFullAction,
}

setTimeout(document.getElementById('geoinformation').addEventListener('click', generateFullAction), 0);