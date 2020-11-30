class EffectShell {
    constructor(container = document.body, itemsWrapper = null) {
      this.container = container
      this.itemsWrapper = itemsWrapper
      if (!this.container || !this.itemsWrapper) return
      this.setup()
      this.initEffectShell().then(() => {
        console.log('load finished')
        this.isLoaded = true
        if (this.isMouseOver) this.onMouseOver(this.tempItemIndex)
        this.tempItemIndex = null
      })
      this.createEventsListeners()
    }
  
    setup() {
      window.addEventListener('resize', this.onWindowResize.bind(this), false)
  
      // renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setSize(this.viewport.width, this.viewport.height)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.container.appendChild(this.renderer.domElement)
  
      // scene
      this.scene = new THREE.Scene()
  
      // camera
      this.camera = new THREE.PerspectiveCamera(
        40,
        this.viewport.aspectRatio,
        0.1,
        100
      )
      this.camera.position.set(0, 0, 3)
  
      //mouse
      this.mouse = new THREE.Vector2()
  
      // console.log(this.viewSize)
      // let pg = new THREE.PlaneBufferGeometry(
      //   this.viewSize.width,
      //   this.viewSize.height,
      //   1,
      //   1
      // )
      // let pm = new THREE.MeshBasicMaterial({ color: 0xff0000 })
      // let mm = new THREE.Mesh(pg, pm)
      // this.scene.add(mm)
  
      // time
      this.timeSpeed = 2
      this.time = 0
      this.clock = new THREE.Clock()
  
      // animation loop
      this.renderer.setAnimationLoop(this.render.bind(this))
    }
  
    render() {
      // called every frame
      this.time += this.clock.getDelta() * this.timeSpeed
      this.renderer.render(this.scene, this.camera)
    }
  
    initEffectShell() {
      let promises = []
  
      this.items = this.itemsElements
  
      const THREEtextureLoader = new THREE.TextureLoader()
      this.items.forEach((item, index) => {
        // create textures
        promises.push(
          this.loadTexture(
            THREEtextureLoader,
            item.img ? item.img.src : null,
            index
          )
        )
      })
  
      return new Promise((resolve, reject) => {
        // resolve textures promises
        Promise.all(promises).then(promises => {
          // all textures are loaded
          promises.forEach((promise, index) => {
            // assign texture to item
            this.items[index].texture = promise.texture
          })
          resolve()
        })
      })
    }
  
    createEventsListeners() {
      this.items.forEach((item, index) => {
        item.element.addEventListener(
          'mouseover',
          this._onMouseOver.bind(this, index),
          false
        )
      })
  
      this.container.addEventListener(
        'mousemove',
        this._onMouseMove.bind(this),
        false
      )
      this.itemsWrapper.addEventListener(
        'mouseleave',
        this._onMouseLeave.bind(this),
        false
      )
    }
  
    _onMouseLeave(event) {
      this.isMouseOver = false
      this.onMouseLeave(event)
    }
  
    _onMouseMove(event) {
      // get normalized mouse position on viewport
      this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1
      this.mouse.y = -(event.clientY / this.viewport.height) * 2 + 1
  
      this.onMouseMove(event)
    }
  
    _onMouseOver(index, event) {
      this.tempItemIndex = index
      this.onMouseOver(index, event)
    }
  
    onWindowResize() {
      this.camera.aspect = this.viewport.aspectRatio
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.viewport.width, this.viewport.height)
    }
  
    onUpdate() {}
  
    onMouseEnter(event) {}
  
    onMouseLeave(event) {}
  
    onMouseMove(event) {}
  
    onMouseOver(index, event) {}
  
    get viewport() {
      let width = this.container.clientWidth
      let height = this.container.clientHeight
      let aspectRatio = width / height
      return {
        width,
        height,
        aspectRatio
      }
    }
  
    get viewSize() {
      // fit plane to screen
      // https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f
  
      let distance = this.camera.position.z
      let vFov = (this.camera.fov * Math.PI) / 180
      let height = 2 * Math.tan(vFov / 2) * distance
      let width = height * this.viewport.aspectRatio
      return { width, height, vFov }
    }
  
    get itemsElements() {
      // convert NodeList to Array
      const items = [...this.itemsWrapper.querySelectorAll('.link')]
  
      //create Array of items including element, image and index
      return items.map((item, index) => ({
        element: item,
        img: item.querySelector('img') || null,
        index: index
      }))
    }
  
    loadTexture(loader, url, index) {
      // https://threejs.org/docs/#api/en/loaders/TextureLoader
      return new Promise((resolve, reject) => {
        if (!url) {
          resolve({ texture: null, index })
          return
        }
        // load a resource
        loader.load(
          // resource URL
          url,
  
          // onLoad callback
          texture => {
            resolve({ texture, index })
          },
  
          // onProgress callback currently not supported
          undefined,
  
          // onError callback
          error => {
            console.error('An error happened.', error)
            reject(error)
          }
        )
      })
    }
  }

  /*!
 * imagesLoaded PACKAGED v4.1.1
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

!function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=0,o=i[n];e=e||[];for(var r=this._onceEvents&&this._onceEvents[t];o;){var s=r&&r[o];s&&(this.off(t,o),delete r[o]),o.apply(this,e),n+=s?0:1,o=i[n]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}(window,function(t,e){function i(t,e){for(var i in e)t[i]=e[i];return t}function n(t){var e=[];if(Array.isArray(t))e=t;else if("number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e}function o(t,e,r){return this instanceof o?("string"==typeof t&&(t=document.querySelectorAll(t)),this.elements=n(t),this.options=i({},this.options),"function"==typeof e?r=e:i(this.options,e),r&&this.on("always",r),this.getImages(),h&&(this.jqDeferred=new h.Deferred),void setTimeout(function(){this.check()}.bind(this))):new o(t,e,r)}function r(t){this.img=t}function s(t,e){this.url=t,this.element=e,this.img=new Image}var h=t.jQuery,a=t.console;o.prototype=Object.create(e.prototype),o.prototype.options={},o.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},o.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),this.options.background===!0&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&d[e]){for(var i=t.querySelectorAll("img"),n=0;n<i.length;n++){var o=i[n];this.addImage(o)}if("string"==typeof this.options.background){var r=t.querySelectorAll(this.options.background);for(n=0;n<r.length;n++){var s=r[n];this.addElementBackgroundImages(s)}}}};var d={1:!0,9:!0,11:!0};return o.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(e.backgroundImage);null!==n;){var o=n&&n[2];o&&this.addBackground(o,t),n=i.exec(e.backgroundImage)}},o.prototype.addImage=function(t){var e=new r(t);this.images.push(e)},o.prototype.addBackground=function(t,e){var i=new s(t,e);this.images.push(i)},o.prototype.check=function(){function t(t,i,n){setTimeout(function(){e.progress(t,i,n)})}var e=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(e){e.once("progress",t),e.check()}):void this.complete()},o.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&a&&a.log("progress: "+i,t,e)},o.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},r.prototype=Object.create(e.prototype),r.prototype.check=function(){var t=this.getIsImageComplete();return t?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},r.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},r.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},r.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},r.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},r.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},r.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype=Object.create(r.prototype),s.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var t=this.getIsImageComplete();t&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},s.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},o.makeJQueryPlugin=function(e){e=e||t.jQuery,e&&(h=e,h.fn.imagesLoaded=function(t,e){var i=new o(this,t,e);return i.jqDeferred.promise(h(this))})},o.makeJQueryPlugin(),o});

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  }

  class StretchEffect extends EffectShell {
    constructor(container = document.body, itemsWrapper = null, options = {}) {
      super(container, itemsWrapper)
      if (!this.container || !this.itemsWrapper) return
  
      options.strength = options.strength || 0.25
      this.options = options
  
      this.init()
    }
  
    init() {
      this.position = new THREE.Vector3(0, 0, 0)
      this.scale = new THREE.Vector3(1, 1, 1)
      this.geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)
      this.uniforms = {
        uTexture: {
          value: null
        },
        uOffset: {
          value: new THREE.Vector2(0.0, 0.0)
        },
        uAlpha: {
          value: 0
        }
      }
      this.material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: `
          uniform vec2 uOffset;
  
          varying vec2 vUv;
  
          vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
            float M_PI = 3.1415926535897932384626433832795;
            position.x = position.x + (sin(uv.y * M_PI) * offset.x);
            position.y = position.y + (sin(uv.x * M_PI) * offset.y);
            return position;
          }
  
          void main() {
            vUv =  uv + (uOffset * 2.);
            vec3 newPosition = position;
            newPosition = deformationCurve(position,uv,uOffset);
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uAlpha;
  
          varying vec2 vUv;
  
          vec2 scaleUV(vec2 uv,float scale) {
            float center = 0.5;
            return ((uv - center) * scale) + center;
          }
  
          void main() {
            vec3 color = texture2D(uTexture,scaleUV(vUv,0.8)).rgb;
            gl_FragColor = vec4(color,uAlpha);
          }
        `,
        transparent: true
      })
      this.plane = new THREE.Mesh(this.geometry, this.material)
      this.scene.add(this.plane)
    }
  
    onMouseEnter() {
      if (!this.currentItem || !this.isMouseOver) {
        this.isMouseOver = true
        // show plane
        TweenLite.to(this.uniforms.uAlpha, 0.5, {
          value: 1,
          ease: Power4.easeOut
        })
      }
    }
  
    onMouseLeave(event) {
      TweenLite.to(this.uniforms.uAlpha, 0.5, {
        value: 0,
        ease: Power4.easeOut
      })
    }
  
    onMouseMove(event) {
      // project mouse position to world coodinates
      let x = this.mouse.x.map(
        -1,
        1,
        -this.viewSize.width / 2,
        this.viewSize.width / 2
      )
      let y = this.mouse.y.map(
        -1,
        1,
        -this.viewSize.height / 2,
        this.viewSize.height / 2
      )
  
      // update position
      this.position = new THREE.Vector3(x, y, 0)
      TweenLite.to(this.plane.position, 1, {
        x: x,
        y: y,
        ease: Power4.easeOut,
        onUpdate: this.onPositionUpdate.bind(this)
      })
    }
  
    onPositionUpdate() {
      // compute offset
      let offset = this.plane.position
        .clone()
        .sub(this.position)
        .multiplyScalar(-this.options.strength)
      this.uniforms.uOffset.value = offset
    }
  
    onMouseOver(index, e) {
      if (!this.isLoaded) return
      this.onMouseEnter()
      if (this.currentItem && this.currentItem.index === index) return
      this.onTargetChange(index)
    }
  
    onTargetChange(index) {
      // item target changed
      this.currentItem = this.items[index]
      if (!this.currentItem.texture) return
  
      // compute image ratio
      let imageRatio =
        this.currentItem.img.naturalWidth / this.currentItem.img.naturalHeight
      this.scale = new THREE.Vector3(imageRatio, 1, 1)
      this.uniforms.uTexture.value = this.currentItem.texture
      this.plane.scale.copy(this.scale)
    }
  }

  const container = document.body
  const itemsWrapper = document.querySelector('.container')

  // Preload images
  const preloadImages = () => {
      return new Promise((resolve, reject) => {
          imagesLoaded(document.querySelectorAll('img'), resolve);
      });
  };
  // And then..
  preloadImages().then(() => {
      // Remove the loader
      document.body.classList.remove('loading');
      const effect = new StretchEffect(container, itemsWrapper)
  });