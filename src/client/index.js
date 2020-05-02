import { generateAction } from './js/app'
import { generateGeoAction } from './js/geoinformation'

import './styles/style.scss'

// export into the client library
export {
    generateAction,
    generateGeoAction,
}

setTimeout(document.getElementById('generate').addEventListener('click', generateAction), 0);

setTimeout(document.getElementById('geoinformation').addEventListener('click', generateGeoAction), 0);