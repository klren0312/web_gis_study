import { Layer } from 'ol/layer'
import Map from 'ol/Map'

export interface LayerItem {
  id: string
  name: string
  layer: Layer
  visible: boolean
  isBaseLayer: boolean
}

export class LayerList {
  private container: HTMLElement
  private map: Map
  private layers: LayerItem[] = []
  
  constructor(map: Map, containerId: string) {
    this.map = map
    const containerElement = document.getElementById(containerId)
    if (!containerElement) {
      throw new Error(`容器元素 ${containerId} 不存在`)
    }
    this.container = containerElement
    this.init()
  }
  
  private init(): void {
    // 创建图层列表容器
    this.container.innerHTML = `
      <div class="layer-list-container">
        <h3>图层列表</h3>
        <ul id="layer-items" class="layer-items"></ul>
      </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .layer-list-container {
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        padding: 10px;
        position: absolute;
        top: 10px;
        right: 10px;
        width: 250px;
        z-index: 1000;
      }
      .layer-items {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .layer-item {
        padding: 8px 10px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        cursor: move;
        background: white;
      }
      .layer-item.dragging {
        opacity: 0.5;
      }
      .layer-item:last-child {
        border-bottom: none;
      }
      .layer-visibility {
        margin-right: 10px;
      }
      .layer-name {
        flex-grow: 1;
      }
    `;
    document.head.appendChild(style);
    
    // 初始化拖拽排序
    this.initDragAndDrop();
  }
  
  private initDragAndDrop(): void {
    const layerList = document.getElementById('layer-items');
    if (!layerList) return;
    
    layerList.addEventListener('dragstart', (e) => {
      if (e.target instanceof HTMLElement) {
        e.target.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.setData('text/plain', e.target.dataset.id || '');
        }
      }
    });
    
    layerList.addEventListener('dragover', (e) => {
      e.preventDefault();
      const dragging = document.querySelector('.dragging');
      if (dragging instanceof HTMLElement && e.target instanceof HTMLElement && e.target.classList.contains('layer-item')) {
        const items = Array.from(layerList.querySelectorAll('.layer-item'));
        const draggedIndex = items.indexOf(dragging);
        const targetIndex = items.indexOf(e.target);
        
        if (draggedIndex < targetIndex) {
          layerList.insertBefore(dragging, e.target.nextSibling);
        } else {
          layerList.insertBefore(dragging, e.target);
        }
      }
    });
    
    layerList.addEventListener('dragend', (e) => {
      if (e.target instanceof HTMLElement) {
        e.target.classList.remove('dragging');
        this.updateLayerOrder();
      }
    });
  }
  
  private updateLayerOrder(): void {
    const layerItems = document.querySelectorAll('.layer-item');
    const newOrder: LayerItem[] = [];
    // 保留底图
    const baseLayers = this.layers.filter(l => l.isBaseLayer);
    layerItems.forEach((item) => {
      const id = item.getAttribute('data-id');
      const layer = this.layers.find(l => l.id === id && !l.isBaseLayer);
      if (layer) {
        newOrder.push(layer);
      }
    });
    
    // 更新内部数组
    this.layers = [...newOrder, ...baseLayers];
    
    // 更新地图中的图层顺序
    this.map.getLayers().clear();
    // 反转数组顺序添加图层，使列表顶部的图层显示在地图顶部
    [...this.layers].reverse().forEach(item => {
      if (item.visible) {
        this.map.addLayer(item.layer);
      }
    });
  }
  
  public addLayer(layer: Layer, name: string, isBaseLayer: boolean = false, visible: boolean = true): void {
    const id = `layer-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const layerItem: LayerItem = {
      id,
      name,
      layer,
      visible,  // 使用传入的 visible 参数
      isBaseLayer
    };
    
    layer.setVisible(visible);  // 设置图层的初始显示状态
    this.layers.unshift(layerItem);
    this.renderLayers();
  }
  
  private renderLayers(): void {
    const layerListElement = document.getElementById('layer-items');
    if (!layerListElement) return;
    
    layerListElement.innerHTML = '';
    this.layers
      .filter(item => !item.isBaseLayer)
      .map(item => {
        const layerElement = document.createElement('li');
        layerElement.className = 'layer-item';
        layerElement.draggable = true;
        layerElement.dataset.id = item.id;

        layerElement.innerHTML = `
          <input type="checkbox" class="layer-visibility" ${item.visible ? 'checked' : ''}>
          <span class="layer-name">${item.name}</span>
        `;
        
        const checkbox = layerElement.querySelector('.layer-visibility') as HTMLInputElement;
        checkbox.addEventListener('change', () => {
          item.visible = checkbox.checked;
          item.layer.setVisible(item.visible);
          // 重新应用整个图层顺序，而不是单独添加图层
          this.updateLayerOrder();
        });
        
        layerListElement.appendChild(layerElement);
      });
    
    this.updateLayerOrder();
  }
}