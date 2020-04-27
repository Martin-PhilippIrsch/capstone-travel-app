import { generateAction } from './js/app'

import './styles/style.scss'

// export into the client library
export {
    generateAction,
}

setTimeout(document.getElementById('generate').addEventListener('click', generateAction), 0);