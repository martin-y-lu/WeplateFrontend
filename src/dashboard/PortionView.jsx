import React, {useRef, useState,useEffect} from 'react'
import {Animated, View,Dimensions, Button} from 'react-native'
import Expo from 'expo'
import * as FileSystem from 'expo-file-system';
import {
  Scene,
  PerspectiveCamera,
  Mesh,
  MeshBasicMaterial, 
  MeshLambertMaterial,
  BoxBufferGeometry,
  Group,
  Vector2,
  Vector3,
  Spherical,
  Quaternion,
  AmbientLight,
  PointLight,
  Raycaster,
  ObjectLoader,
  OrthographicCamera,
} from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import ExpoTHREE, {Renderer} from 'expo-three'
global.THREE = global.THREE || ExpoTHREE;
// import {useGLTF} from '@react-three/drei'
import {Asset} from 'expo-asset'
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl'
import { State,PanGestureHandler } from 'react-native-gesture-handler'
import {encode,decode} from'base-64'

// const {
//   Scene,
//   PerspectiveCamera,
//   Mesh,
//   MeshBasicMaterial, 
//   MeshLambertMaterial,
//   BoxBufferGeometry,
//   Group,
//   Vector2,
//   Vector3,
//   Spherical,
//   Quaternion,
//   AmbientLight,
//   PointLight,
//   Raycaster,
// } = THREE
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

console.log(Quaternion)
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}


function degToRad(d){
  return d*Math.PI/180;
}
function lerp(a,b,r){
  return a*(1-r)+b*(r)
}
function rmap(a,b,A,B,v){
  const r = (v-a)/(b-a)
  return lerp(A,B,r)
}
const DEBUG= true;

function useTrackedAnimation(init_value,valueListener = (val)=>{}){
  const anim = useRef(new Animated.Value(init_value))
  const value = useRef(init_value)
  const targ = useRef(init_value)
  useEffect(()=>{
    const listener = (_value)=>{
      value.current = _value.value
      valueListener(_value.value)
    }
    anim.current.addListener(listener)
    return () => {
      anim.current.removeListener(listener)  
    };
  },[])
  function animate(target,props){
    targ.current = target
    Animated.timing(anim.current,{
      useNativeDriver:false,
      toValue:target,
      duration: 1000,
      ...props
      
    }).start()
  }
  return [animate,value,targ]
}

const PortionView = (props)=>{
  //size of graphics window (square)
  const size = Dimensions.get('window').width

  //three.js camera
  const perspectiveCamera = useRef(null)
  const orthographicCamera = useRef(null)
  
  // reference to three.js group containing all things to render in the orbit view
  const displayGroup = useRef(null)
  const components = useRef(null)
  const [viewSize, setViewSize] = useState(null)


  //default resting transformation of displayGroup, when centralized
  const DEFAULT_TRANSFORM = new Quaternion().setFromAxisAngle(new Vector3(1,0,0),Math.PI/2);
  // quaternions to keep track of orbit view
  const initialRotation = useRef(new Quaternion())
  const rotation = useRef(new Quaternion())
  function resetRotation(){
    rotation.current = DEFAULT_TRANSFORM.clone()
    initialRotation.current = DEFAULT_TRANSFORM.clone()
  }

  //For animating x value of display group
  const shift = useRef(new Animated.Value(0))

  const [animateRightSize,rightSizeValue,rightSizeTarg] = useTrackedAnimation(1)
  const [animateTopLeftSize,topLeftSizeValue,topLeftSizeTarg] = useTrackedAnimation(1)
  const [animateBottomLeftSize,bottomLeftSizeValue,bottomLeftSizeTarg] = useTrackedAnimation(1)

  //Animates level of centralisation, 0 -> orbit view , 1 -> orthographic view

  const [animateCentralize,centralizeValue,centralizeTarg] = useTrackedAnimation(1,(val)=>{
    if(val>0.99){
      resetRotation()
    }
  })
  // const centralize = useRef(new Animated.Value(1))
  // // references to target and current value
  // const centralizeTarg = useRef(1)
  // const centralizeValue = useRef(1)


  //Timer to re centralise after a certain period of no interaction
  const DOES_INACTIVITY_TIMER = false;
  const INACTIVITY_TIMER_LENGTH = 800;
  const inactivityTimer = useRef(null)

  function startInactivityTimer(){
    inactivityTimer.current = setInterval(()=>{
      if(DOES_INACTIVITY_TIMER){
        animateCentralize(1,{duration:900})
      }
      clearInterval(inactivityTimer.current)
    },INACTIVITY_TIMER_LENGTH)
  }
  function stopInactivityTimer(){
    clearInterval(inactivityTimer.current)
  }
  //On dismount
  useEffect(()=>{
    return ()=>{
      stopInactivityTimer()
    }
  },[])


  //Animated listeners
  useEffect(() => {
    const shiftListener = (_shift)=>{
      if(displayGroup.current){
        displayGroup.current.position.set(_shift.value,0,0);
      }
    }
    shift.current.addListener(shiftListener);
    return () => {
      shift.current.removeListener(shiftListener)
    };
  }, []);

  const onContextCreate = async (gl)=>{
    //Three.js code

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0,1,1,1)

    //Three.js boilerplate
    const scene = new Scene()
    const _perspectiveCamera = new PerspectiveCamera(75,gl.drawingBufferWidth/ gl.drawingBufferHeight,0.1,1000)
    _perspectiveCamera.position.set(0,0,3)

    // setPerspectiveCamera(_perspectiveCamera)
    perspectiveCamera.current = _perspectiveCamera

    const width = 2;
    const height = width* gl.drawingBufferHeight/gl.drawingBufferWidth
    const _orthographicCamera = new OrthographicCamera(-width/2,height/2,width/2,-height/2,-1000,1000)
    // setOrthographicCamera(_orthographicCamera)
    orthographicCamera.current = _orthographicCamera
    
    const renderer = new Renderer({gl})
    setViewSize({x:gl.drawingBufferWidth,y:gl.drawingBufferHeight})
    renderer.setClearColor("white")
    renderer.setSize(gl.drawingBufferWidth,gl.drawingBufferHeight)

    // create cubes TODO: update to actual 3d models
    const opacity = 0.5;
    const _cube1 = new Mesh(new BoxBufferGeometry(1,0.8,0.7),new MeshLambertMaterial({color: 'orange',opacity, transparent: true}))
    _cube1.position.set(-0.55,0,0.4)
    const _cube2 = new Mesh(new BoxBufferGeometry(1,0.8,0.7),new MeshLambertMaterial({color: 'yellow',}))
    _cube2.position.set(-0.55,0,-0.4)
    const _cube3 = new Mesh(new BoxBufferGeometry(1,0.8,1.5),new MeshLambertMaterial({color: 'red',}))
    _cube3.position.set(0.55,0,0)

    const loader = new OBJLoader()
    // const asset = Asset.fromModule(require(''))
    const asset = Asset.fromModule(require('./assets/weplate-v1.obj'))
    const model = await loader.loadAsync(asset.uri)
    // console.log(model)


    const _displayGroup = new Group()
    // _displayGroup.add(_cube1)
    // _displayGroup.add(_cube2)
    // _displayGroup.add(_cube3)
    const model_scale = 0.5
    model.scale.set(model_scale,model_scale,model_scale)
    model.position.set(0,-0.2,0)
    console.log(model.children[0].name)
    const _components = {}
    model.children.forEach((object)=>{
      _components[object.name] = object
    })
    console.log(Object.keys(_components))
    _components["Right"].material = new MeshLambertMaterial({color: '#FA586E',}); //red
    _components["BottomLeft"].material = new MeshLambertMaterial({color: '#FAE458',}) //yellow
    _components["TopLeft"].material = new MeshLambertMaterial({color: '#FA9358'}) //orange 
    _components["PlateBody"].material = new MeshLambertMaterial({color: 'silver',opacity:0.8, transparent: true}) 
    // _components["Right"].scale.set(1,0.5,1);
    components.current = _components

    _displayGroup.add(model)
    displayGroup.current = _displayGroup

    scene.add(_displayGroup)

    //lighting
    const ambientLight = new THREE.AmbientLight(0x404040,4);
    scene.add(ambientLight);
    const pointLight = new PointLight( 0x404040,0 ,100);
    pointLight.position.set(0,0,10) // soft white light
    scene.add( pointLight );

    //requestanimationframe
    const render = ()=>{

      //interpolate light intensities such that when the it is centralized, only the ambient light is on
      ambientLight.intensity = lerp(1,4,centralizeValue.current)
      pointLight.intensity = lerp(4,0,centralizeValue.current)

      const usePerspective = centralizeValue.current !== 1
      // const usePerspective = true
      const fov1 = 0.2
      const dist1 = 700

      const fov2 = 75
      const dist2 = 3
      if(usePerspective){      
        //interpolate fov such that when centralised, the projection is almost orthographic
        const fov = lerp(75,8,centralizeValue.current)
        _perspectiveCamera.fov = fov

        //interpolate distance of camera in order to have smooth fov change
        const dist = rmap(fov1,fov2,dist1*Math.tan(degToRad(fov1)/2),dist2*Math.tan(degToRad(fov2)/2),fov)/Math.tan(degToRad(fov)/2)

        _perspectiveCamera.position.set(0,0,dist)
        _perspectiveCamera.updateProjectionMatrix()
      }else{
        const MAGIC_NUMBER = 1.09
        const width = rmap(fov1,fov2,dist1*Math.tan(degToRad(fov1)/2),dist2*Math.tan(degToRad(fov2)/2),0)*MAGIC_NUMBER
        // console.log(width)
        const height = width*gl.drawingBufferHeight/gl.drawingBufferWidth
        // new OrthographicCamera(-width/2,height/2,width/2,-height/2,-1000,1000)
        _orthographicCamera.left = -width
        _orthographicCamera.right = width
        _orthographicCamera.top = height
        _orthographicCamera.bottom = -height
        _orthographicCamera.updateProjectionMatrix()
      }


   
      //1.0 -> no easing
      const EASING = 0.2
      if(rotation.current){
        const target_transform = rotation.current.clone().slerp(DEFAULT_TRANSFORM,centralizeValue.current)
        _displayGroup.quaternion.slerp(target_transform,EASING)
      }
    
      //lerp opacity of box
      components.current["PlateBody"].material.opacity = lerp(0.5,0,centralizeValue.current)

      //set sizes of components
      components.current["Right"].scale.set(1,rightSizeValue.current,1)
      components.current["TopLeft"].scale.set(1,topLeftSizeValue.current,1)
      components.current["BottomLeft"].scale.set(1,bottomLeftSizeValue.current,1)

      
      renderer.render(scene,usePerspective? _perspectiveCamera : _orthographicCamera)
      // renderer.render(scene,_orthographicCamera)
      gl.endFrameEXP( )

      requestAnimationFrame(render)
    }
    render()
  }

  //When centralised, sufficient length of drag will trigger orbit
  const SUFFICIENT_TRAVEL_LENGTH_TO_ORBIT = 60;

  const BASELINE_ORBIT_SPEED = 0.01;

  //Pan gesture handler 
  const onGestureEvent = (event) =>{
    stopInactivityTimer()

    let {nativeEvent} = event
    //if centralised
    if(centralizeTarg.current>0.8){
      const travelLength = Math.sqrt(Math.pow(nativeEvent.translationX,2)+Math.pow(nativeEvent.translationY,2))
      if(travelLength>SUFFICIENT_TRAVEL_LENGTH_TO_ORBIT){
        animateCentralize(0,{duration:200})
      }
    }

    //Orbit controls
    rotation.current.copy(initialRotation.current)
    const quatForward = initialRotation.current.clone()
    const quatForwardInverse = quatForward.clone().invert()
    const speed = BASELINE_ORBIT_SPEED*(1.0-centralizeValue.current);

    rotation.current = rotation.current.multiply(quatForwardInverse)
    rotation.current = rotation.current.multiply(new Quaternion().setFromAxisAngle(new Vector3(0,1,0),nativeEvent.translationX*speed))
    rotation.current = rotation.current.multiply(new Quaternion().setFromAxisAngle(new Vector3(1,0,0),nativeEvent.translationY*speed))
    rotation.current = rotation.current.multiply(quatForward)
    rotation.current = rotation.current.normalize()
  }
  const onPanEnded= (event) =>{
    initialRotation.current.copy(rotation.current)
    startInactivityTimer()
  }
  const onPanFail = (event) =>{
    //Pan fail qualifies as tap, check for intersection with objects TODO: fix

    let {nativeEvent} = event;
    if(viewSize!=null && perspectiveCamera.current!=null){
      const pos = new Vector2(2*nativeEvent.absoluteX/size -1, -2*nativeEvent.absoluteY/size+1)
      const raycaster = new Raycaster();
      raycaster.setFromCamera(pos,perspectiveCamera.current)
      const comps = Object.values(components.current);
      if(comps){
        // console.log(comps)
        const intersects = raycaster.intersectObjects( comps,false)
        console.log(intersects.length)

      }
      // if(intersects.length>0){
      //   tapToggle.current = !tapToggle.current
      // }
    }
  }
  const baseView = 
  <PanGestureHandler minDist={25} onGestureEvent = {onGestureEvent} onFailed = {onPanFail} onEnded = {onPanEnded}>
    <GLView
      onContextCreate={onContextCreate}
      // onTouchStart = {onTouchStart}
      style = {{width:size,height:size}}
    />
  </PanGestureHandler>
  if(!DEBUG){
    return baseView
  }else return <View>
    {/* <PanGestureHandler minDist={25} onGestureEvent = {onGestureEvent} onFailed = {onPanFail} onEnded = {onPanEnded}>
     <GLView
        onContextCreate={onContextCreate}
        // onTouchStart = {onTouchStart}
        style = {{width:size,height:size}}
     />
    </PanGestureHandler> */}
    {baseView}
    {/* <Button title='Test shift anim' onPress={()=>{
        Animated.timing(shift.current,{
          useNativeDriver:false,
          toValue:1,
          duration: 50
        }).start()
    }}/> */}
    <Button title='Test centralize anim' onPress={()=>{
       animateCentralize(1)
    }}/>
    <Button title='Test component sizes' onPress={()=>{
        // console.log(bottomLeftSizeTarg)
        if(bottomLeftSizeTarg.current === 1){
          animateBottomLeftSize(0.2)
          animateTopLeftSize(0.8)
          animateRightSize(0.5)
        }else{
          animateBottomLeftSize(1)
          animateTopLeftSize(1)
          animateRightSize(1)
        }

    }}/>
  </View>
}
export default PortionView