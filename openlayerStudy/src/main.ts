import './style.css'
import { setupMap } from './setup'
import 'ol/ol.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="map">
  </div>
`

setupMap()
