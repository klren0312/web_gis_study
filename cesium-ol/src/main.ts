import './style.css'
import 'ol/ol.css'
import { setup } from './setupMap.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="map">
  </div>
`

setup()
