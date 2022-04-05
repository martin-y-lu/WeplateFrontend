import React, {useRef, useState,useEffect} from 'react'
import { Animated, View, Dimensions, Button, TouchableOpacity } from 'react-native';
import Expo from 'expo'
import * as FileSystem from 'expo-file-system';
import {
  Scene,
  PerspectiveCamera,
  Mesh,
  MeshBasicMaterial, 
  MeshLambertMaterial,
  BoxBufferGeometry,
  PlaneGeometry,
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
  Sprite,
  Texture,
} from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import ExpoTHREE, {loadAsync, Renderer, TextureLoader,} from 'expo-three'
global.THREE = global.THREE || ExpoTHREE;
// import {useGLTF} from '@react-three/drei'
import {Asset} from 'expo-asset'
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl'
import { State,PanGestureHandler } from 'react-native-gesture-handler'
import {encode,decode} from'base-64'
import vegIconImage from './assets/icons_text/veg_icon_with_text_centered.png'
import grainsIconImage from './assets/icons_text/grains_icon_with_text_centered.png'
import proteinIconImage from './assets/icons_text/protein_icon_with_text_centered.png'

import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import { degToRad, interp, lerp } from '../utils/math';
import { FOOD_CATEGORY, MEAL, PlateType } from './typeUtil';
import { colorOfCategory } from './NutritionFacts';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

export function useTrackedAnimation(init_value: number,valueListener = (val:number)=>{}){
  const anim = useRef(new Animated.Value(init_value))
  const value = useRef(init_value)
  const targ = useRef(init_value)
  useEffect(()=>{
    const listener = (_value)=>{
      value.current = _value.value
      valueListener(_value.value)
    }
    const id = anim.current.addListener(listener)
    return () => {
      anim.current.removeListener(id)  
    };
  },[])
  function animate(target: number,props: Omit<Omit<Animated.TimingAnimationConfig,"useNativeDriver">,"toValue">, finished?:Animated.EndCallback ){
    if(targ.current != target){
      targ.current = target
      Animated.timing(anim.current,{
        useNativeDriver:false,
        toValue:target,
        duration: 1000,
        ...props
        
      }).start(finished)
    }
  }
  return [animate,value,targ] as [typeof animate, typeof value, typeof targ]
}
export function useTrackedStateAnimation(init_value:number,valueListener = (val:number)=>{}){
  const anim = useRef(new Animated.Value(init_value))
  const [value,setValue]= useState(init_value)
  const [targ,setTarg] = useState(init_value)
  useEffect(()=>{
    const listener = (_value)=>{
      setValue(_value.value)
      valueListener(_value.value)
    }
    const id = anim.current.addListener(listener)
    return () => {
      anim.current.removeListener(id)  
    };
  },[])
  function animate(target:number,props: Omit<Omit<Animated.TimingAnimationConfig,"useNativeDriver">,"toValue">){
    if(targ != target){
      setTarg(target)
      Animated.timing(anim.current,{
        useNativeDriver:false,
        toValue:target,
        duration: 1000,
        ...props
        
      }).start()
    }
  }
  return [animate,value,targ,anim]
}

export function usePortionViewAnimationState(){
  //default resting transformation of displayGroup, when centralized
  const DEFAULT_TRANSFORM = new Quaternion().setFromAxisAngle(new Vector3(1,0,0),Math.PI*0.3);
  // quaternions to keep track of orbit view
  const cameraAngleAnimation = useTrackedAnimation(0);

  const initialRotation = useRef(DEFAULT_TRANSFORM.clone())
  const rotation = useRef(DEFAULT_TRANSFORM.clone())
  
  function setRotation(quat){
    rotation.current = quat.clone()
    initialRotation.current = quat.clone()
  }
  function resetRotation(){
    setRotation(DEFAULT_TRANSFORM)
  }

  const rightTrackedAnimation = useTrackedAnimation(0)
  const topTrackedAnimation = useTrackedAnimation(0)
  const bottomTrackedAnimation = useTrackedAnimation(0)

  //Animates level of centralisation, 0 -> orbit view , 1 -> orthographic view

  const centralizeTrackedAnimation = useTrackedAnimation(1,(val)=>{
    if(val>0.99){
      resetRotation()
    }
  })

  const [topCategory,setTopCategory] = useState(null)
  const [bottomCategory,setBottomCategory] = useState(null)
  const [rightCategory,setRightCategory] = useState(null)

  const doesInactivityTimer = useRef(true);
  const [loaded,setLoaded] = useState(false)

  const topDiscrete = useRef(false)
  const bottomDiscrete = useRef(false)
  const rightDiscrete = useRef(false)

  const [plateType,setPlateType] = useState(PlateType.Weplate)

  return {
    DEFAULT_TRANSFORM,
    cameraAngleAnimation,
    initialRotation,
    rotation,
    rightTrackedAnimation,
    topTrackedAnimation,
    bottomTrackedAnimation,
    centralizeTrackedAnimation,
    setRotation,
    resetRotation,
    doesInactivityTimer,
    topCategory,
    setTopCategory,
    bottomCategory,setBottomCategory,
    rightCategory,setRightCategory,
    loaded,setLoaded,
    topDiscrete,
    bottomDiscrete,
    rightDiscrete,
    plateType, setPlateType,
  }

}
type PortionViewAnimationState = ReturnType<typeof usePortionViewAnimationState>


const PortionView = (props : {style, animationState?: PortionViewAnimationState})=>{
  const {style} = props
  //size of graphics window (square)
  const size = Dimensions.get('window').width
  const aspect = 0.5

  //three.js camera
  const perspectiveCamera = useRef(null)
  const orthographicCamera = useRef(null)
  
  // reference to three.js group containing all things to render in the orbit view
  const displayGroup = useRef(null)
  const components = useRef(null)
  const [viewSize, setViewSize] = useState(null)

  const topSquare = useRef(null)
  const bottomSquare = useRef(null)
  const rightSquare = useRef(null)
  
  const {
    DEFAULT_TRANSFORM,
    cameraAngleAnimation,
    initialRotation,
    rotation,
    rightTrackedAnimation,
    topTrackedAnimation,
    bottomTrackedAnimation,
    centralizeTrackedAnimation,
    resetRotation,
    doesInactivityTimer,
    topCategory,
    bottomCategory,
    rightCategory,
    loaded,
    setLoaded,
    topDiscrete,
    bottomDiscrete,
    rightDiscrete,
    plateType,setPlateType,
  } = props?.animationState ?? usePortionViewAnimationState()
  const [animateCameraAngle,cameraAngleValue, cameraAngleTarg] = cameraAngleAnimation
  const [animateRightSize,rightSizeValue,rightSizeTarg] = rightTrackedAnimation
  const [animateTopLeftSize,topLeftSizeValue,topLeftSizeTarg] = topTrackedAnimation
  const [animateBottomLeftSize,bottomLeftSizeValue,bottomLeftSizeTarg] = bottomTrackedAnimation
  
  const [animateCentralize,centralizeValue,centralizeTarg] = centralizeTrackedAnimation
  const emptyMaterial = useRef(null)
  const grainsIconMaterial = useRef(null)
  const proteinIconMaterial = useRef(null)
  const vegIconMaterial = useRef(null)
  function materialOfCategory(category: FOOD_CATEGORY){
    if(category == FOOD_CATEGORY.Carbohydrates){
      console.log("carbs")
      return grainsIconMaterial.current
    } 
    if(category == FOOD_CATEGORY.Protein){
      console.log("protien")  
      return proteinIconMaterial.current
    } 
    if(category == FOOD_CATEGORY.Vegetable){
      console.log("veg")
      return vegIconMaterial.current
    } 
    return emptyMaterial;
  }
  // // console.log({topCategory})
  useEffect(()=>{
    console.log("Top category updated!",topCategory)
    if(topSquare.current){
      topSquare.current.material = materialOfCategory(topCategory)
    }
    if(components.current){
      const color = colorOfCategory(topCategory)
      components.current["TopLeft"].material.color.setStyle(color)
      components.current["TopLeftDisc"].material.color.setStyle(color)
    }
  },[topCategory,components,loaded])
  useEffect(()=>{
    if(bottomSquare.current){
      bottomSquare.current.material = materialOfCategory(bottomCategory)
    }
    if(components.current){
      const color = colorOfCategory(bottomCategory)
      components.current["BottomLeft"].material.color.setStyle(color)
      components.current["BottomLeftDisc"].material.color.setStyle(color)
    }
  },[bottomCategory,components,loaded])
  useEffect(()=>{
    if(rightSquare.current){
      rightSquare.current.material = materialOfCategory(rightCategory)
    }
    if(components.current){
      const color = colorOfCategory(rightCategory)
      components.current["Right"].material.color.setStyle(color)
      components.current["RightDisc"].material.color.setStyle(color)
    }
  },[rightCategory,components,loaded])


  //Timer to re centralise after a certain period of no interaction
  const INACTIVITY_TIMER_LENGTH = 1400;
  const inactivityTimer = useRef(null) 

  function startInactivityTimer(){
    inactivityTimer.current = setInterval(()=>{
      if(doesInactivityTimer.current){
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

    const loader = new OBJLoader()
    // const asset = Asset.fromModule(require(''))
    const modelAsset = Asset.fromModule(require('./assets/weplate-v6.obj'))
    const model = await loader.loadAsync(modelAsset.uri)
    // console.log(model)
    const textureLoader = new TextureLoader();


    const _displayGroup = new Group()

    // _displayGroup.add(_cube1)
    // _displayGroup.add(_cube2)
    // _displayGroup.add(_cube3)
    const model_scale = 0.5
    model.scale.set(model_scale,model_scale,model_scale)
    model.position.set(0,-0.2,0)
    // console.log(model.children[0].name)
    const _components = {}
    model.children.forEach((object)=>{
      _components[object.name] = object
    })
    // console.log(Object.keys(_components))
    _components["Right"].material = new MeshLambertMaterial({ color: colorOfCategory(rightCategory),transparent:true,}); //red
    _components["BottomLeft"].material = new MeshLambertMaterial({color: colorOfCategory(bottomCategory),transparent:true,}) //yellow
    _components["TopLeft"].material = new MeshLambertMaterial({color: colorOfCategory(topCategory),transparent:true,}) //orange 
    _components["RightDisc"].material = new MeshLambertMaterial({ color: colorOfCategory(rightCategory),transparent:true,opacity:0}); //red
    _components["BottomLeftDisc"].material = new MeshLambertMaterial({color: colorOfCategory(bottomCategory),transparent:true,opacity:0}) //yellow
    _components["TopLeftDisc"].material = new MeshLambertMaterial({color: colorOfCategory(topCategory),transparent:true,opacity:0}) //orange 
    _components["PlateBody"].material = new MeshLambertMaterial({color: 'silver',opacity:0.8, transparent: true,})
    _components["PlateBody"].renderOrder = 100 
    // _components["Right"].scale.set(1,0.5,1);
    components.current = _components

    _displayGroup.add(model)

    const vegIconTexture = textureLoader.load(vegIconImage)
    const _vegIconMaterial = new MeshLambertMaterial({map: vegIconTexture,transparent:true,opacity:1})
    vegIconMaterial.current = _vegIconMaterial

    const grainsIconTexture = textureLoader.load(grainsIconImage)
    const _grainsIconMaterial = new MeshLambertMaterial({map: grainsIconTexture,transparent:true,opacity:1})
    grainsIconMaterial.current = _grainsIconMaterial

    const proteinIconTexture = textureLoader.load(proteinIconImage)
    const _proteinIconMaterial = new MeshLambertMaterial({map: proteinIconTexture,transparent:true,opacity:1})
    proteinIconMaterial.current = _proteinIconMaterial

    emptyMaterial.current = new MeshLambertMaterial({transparent: true, opacity: 0})
 
    const squareGeometry = new PlaneGeometry(0.6,0.6)
    const _topSquare = new Mesh(squareGeometry,materialOfCategory(topCategory))
    

    _topSquare.rotateX(-Math.PI/2)
    _topSquare.position.set(-0.6,0.21,-0.4)
    _topSquare.renderOrder = 10
    topSquare.current = _topSquare

    const _bottomSquare = new Mesh(squareGeometry,materialOfCategory(bottomCategory))
    _bottomSquare.rotateX(-Math.PI/2)
    const bottomSquareScale = bottomDiscrete.current ? 0.5 :1
    _bottomSquare.scale.set(bottomSquareScale,bottomSquareScale,bottomSquareScale)
    _bottomSquare.position.set(-0.6,0.21,0.4)
    _bottomSquare.renderOrder = 10
    bottomSquare.current = _bottomSquare


    const _rightSquare = new Mesh(squareGeometry,materialOfCategory(rightCategory))
    _rightSquare.rotateX(-Math.PI/2)
    _rightSquare.position.set(0.6,0.21,0)
    _rightSquare.renderOrder = 10
    rightSquare.current = _rightSquare

    _displayGroup.add(_topSquare)
    _displayGroup.add(_bottomSquare)
    _displayGroup.add(_rightSquare)

    displayGroup.current = _displayGroup

    scene.add(_displayGroup)

    //lighting
    const ambientLight = new THREE.AmbientLight(0x404040,4);
    scene.add(ambientLight);
    const pointLight = new PointLight( 0x404040,0 ,100);
    pointLight.position.set(0,0,10) // soft white light
    scene.add( pointLight );

    // Done loading
    setLoaded(true);

    //requestanimationframe
    const render = ()=>{

      //interpolate light intensities such that when the it is centralized, only the ambient light is on
      // from pure ambient
      // ambientLight.intensity = lerp(3,4,centralizeValue.current)
      // pointLight.intensity = lerp(2,0,centralizeValue.current)
      
      ambientLight.intensity = lerp(3,4,centralizeValue.current)
      pointLight.intensity = lerp(2,0.5,centralizeValue.current)
      // flattened 2d view
      // const usePerspective = centralizeValue.current !== 1      
            // const fov1 = 0.21
            // const dist1 = 420
      const usePerspective = true
      const fov1 = 50
      const dist1 = 2.5

      const fov2 = 40
      const dist2 = 4.2
      if(usePerspective){      
        //interpolate fov such that when centralised, the projection is almost orthographic
        const fov = lerp(fov2,fov1,centralizeValue.current)
        _perspectiveCamera.fov = fov

        //interpolate distance of camera in order to have smooth fov change
        const dist = interp(fov1,fov2,dist1*Math.tan(degToRad(fov1)/2),dist2*Math.tan(degToRad(fov2)/2),fov)/Math.tan(degToRad(fov)/2)

        _perspectiveCamera.position.set(0,0,dist)
        _perspectiveCamera.updateProjectionMatrix()
      }else{
        const MAGIC_NUMBER = 1.61
        const width = interp(fov1,fov2,dist1*Math.tan(degToRad(fov1)/2),dist2*Math.tan(degToRad(fov2)/2),0)*MAGIC_NUMBER
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
      components.current["PlateBody"].material.opacity = 0.3
      // components.current["PlateBody"].material.opacity = lerp(0.3,0,centralizeValue.current)
      if(rightDiscrete?.current){
        components.current["Right"].visible = false
        components.current["RightDisc"].visible = true
      }else{
        components.current["Right"].visible = true
        components.current["RightDisc"].visible = false
      }

      components.current["Right"].material.opacity= rightSizeTarg.current == 0 ? 0 : lerp(0.93,1,centralizeValue.current)
      components.current["RightDisc"].material.opacity= rightSizeTarg.current == 0 ? 0 : lerp(0.93,1,centralizeValue.current)

      if(topDiscrete?.current){
        components.current["TopLeft"].visible = false
        components.current["TopLeftDisc"].visible = true
      }else{
        components.current["TopLeft"].visible = true
        components.current["TopLeftDisc"].visible = false
      }

      components.current["TopLeft"].material.opacity = topLeftSizeTarg.current == 0 ? 0:  lerp(0.93,1,centralizeValue.current)
      components.current["TopLeftDisc"].material.opacity = topLeftSizeTarg.current == 0 ? 0:  lerp(0.93,1,centralizeValue.current)

      if(bottomDiscrete?.current){
        components.current["BottomLeft"].visible = false
        components.current["BottomLeftDisc"].visible = true
      }else{
        components.current["BottomLeft"].visible = true
        components.current["BottomLeftDisc"].visible = false
      }

      components.current["BottomLeft"].material.opacity = bottomLeftSizeTarg.current == 0 ? 0 : lerp(0.93,1,centralizeValue.current)
      components.current["BottomLeftDisc"].material.opacity = bottomLeftSizeTarg.current == 0 ? 0 : lerp(0.93,1,centralizeValue.current)

      const WALL_HEIGHT = 1.2
      //set sizes of components
      let rightScale = rightSizeValue.current
      if(rightScale == 0) rightScale = 0.01 // prevent z fight
      components.current["Right"].scale.set(1,rightScale,1)
      components.current["RightDisc"].scale.set(1,rightScale,1)
      _rightSquare.position.set(0.6,WALL_HEIGHT/2*rightScale - 0.2 +0.01,0)

      let topScale = topLeftSizeValue.current
      if(topScale == 0) topScale = 0.01
      components.current["TopLeft"].scale.set(1,topScale,1)
      components.current["TopLeftDisc"].scale.set(1,topScale,1)
      const topSquareScale = topDiscrete.current ? 0.8 : 1.0
      _topSquare.scale.set(topSquareScale,topSquareScale,topSquareScale)
      _topSquare.position.set(-0.6,WALL_HEIGHT/2*topScale - 0.2 +0.01,-0.42)

      let bottomScale = bottomLeftSizeValue.current
      if(bottomScale == 0 ) bottomScale = 0.01
      components.current["BottomLeft"].scale.set(1,bottomScale,1)
      components.current["BottomLeftDisc"].scale.set(1,bottomScale,1)
      const bottomSquareSize = bottomDiscrete.current ? 0.8 : 1
      _bottomSquare.scale.set(bottomSquareSize,bottomSquareSize,bottomSquareSize)
      _bottomSquare.position.set(-0.6,WALL_HEIGHT/2*bottomScale - 0.2 +0.01,0.4)

      
      _perspectiveCamera.setRotationFromAxisAngle( new Vector3(0,1,0),cameraAngleValue.current)
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
      const pos = new Vector2(2*nativeEvent.absoluteX/size -1, -2*nativeEvent.absoluteY/(size*aspect)+1)
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
  const [rotating,setRotating] = useState(false);
  const height = size*aspect
  const baseView = 
  <View>
    
    <PanGestureHandler minDist={25} onGestureEvent = {onGestureEvent} onFailed = {onPanFail} onEnded = {onPanEnded}>
      <GLView
        onContextCreate={onContextCreate}
        // onTouchStart = {onTouchStart}
        style = {{width:size,height,...style}}
        />
    </PanGestureHandler>
    <TouchableOpacity style = {{
            position:"absolute",
            width: 40,
            marginTop: "10%",
            height: "80%",
            backgroundColor:"orange",
          }} onPress= {()=>{
            
          }}>

    </TouchableOpacity>
    <TouchableOpacity style = {{
            position:"absolute",
            right: 0,
            width: 40,
            marginTop: "10%",
            height: "80%",
            backgroundColor:"orange",
          }} onPress= {()=>{
              if(!rotating){
                setRotating(true)
                animateCameraAngle(Math.PI/2,{duration:350}, (end1)=>{
                  if(end1.finished){
                    
                    animateCameraAngle(Math.PI*(2-1/2),{duration:1},()=>{
                      animateCameraAngle(2*Math.PI,{duration:350}, (end2)=>{
                        animateCameraAngle(0,{duration:1},()=>{
                          setRotating(false)
                        })
                      })
                    }) 
                  }
                })

              }
          }}>

    </TouchableOpacity>
  </View>
  return baseView
}
export default PortionView