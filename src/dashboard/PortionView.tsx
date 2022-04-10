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
import { FOOD_CATEGORY, MEAL, PlateType, plateTypes } from './typeUtil';
import { colorOfCategory } from './NutritionFacts';
import { useDesignScheme } from '../design/designScheme';
import { SvgXml } from 'react-native-svg';

const weplate_icon_svg = `<svg width="52" height="38" viewBox="0 0 52 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.8995 3.5H49.046V34.4859H25.8995M25.8995 3.5H2.75293V18.9929M25.8995 3.5V18.9929M25.8995 34.4859H2.75293V18.9929M25.8995 34.4859V18.9929M25.8995 18.9929H2.75293" stroke="white" stroke-width="5.45448" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`
const normalplate_icon_svg = `<svg width="53" height="52" viewBox="0 0 53 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.5001 3.5V25.9929M26.5001 47.5V25.9929M26.5001 25.9929H3.35352" stroke="white" stroke-width="5.45448" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="26.5" cy="25.9929" r="22.9732" stroke="white" stroke-width="5.45"/>
</svg>
`

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

export function usePortionViewAnimationState(init: {plateType?: PlateType,onPlateTypeChange ?: (newPlateType: PlateType)=> void}){
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

  const rightTrackedAnimation = {
    "": useTrackedAnimation(0),
    "1/2": useTrackedAnimation(0),
    "2/2":useTrackedAnimation(0) 
  } as {[key: string]: ReturnType<typeof useTrackedAnimation>}
  
  // [ [useTrackedAnimation(0)], [ useTrackedAnimation(0), useTrackedAnimation(0)]]
  const topTrackedAnimation = {
    "": useTrackedAnimation(0),
    "1/2": useTrackedAnimation(0),
    "2/2":useTrackedAnimation(0) 
  } as {[key: string]: ReturnType<typeof useTrackedAnimation>}
  const bottomTrackedAnimation = {
    "": useTrackedAnimation(0),
    "1/2": useTrackedAnimation(0),
    "2/2":useTrackedAnimation(0) 
  }as {[key: string]: ReturnType<typeof useTrackedAnimation>}

  //Animates level of centralisation, 0 -> orbit view , 1 -> orthographic view

  const centralizeTrackedAnimation = useTrackedAnimation(1,(val)=>{
    if(val>0.99){
      resetRotation()
    }
  })

  const [topCategory,setTopCategory] = useState(null as FOOD_CATEGORY)
  const [bottomCategory,setBottomCategory] = useState(null as FOOD_CATEGORY)
  const [rightCategory,setRightCategory] = useState(null as FOOD_CATEGORY)

  const doesInactivityTimer = useRef(true);
  const [loaded,setLoaded] = useState(false)

  const topDiscrete = {
    "": useRef(false),
    "1/2": useRef(false), 
    "2/2": useRef(false), 
  } as {[key:string] : {current: boolean}}
  const bottomDiscrete = {
    "": useRef(false),
    "1/2": useRef(false), 
    "2/2": useRef(false), 
  } as {[key:string] : {current: boolean}}
  // useRef(false)
  const rightDiscrete ={
    "": useRef(false),
    "1/2": useRef(false), 
    "2/2": useRef(false), 
  } as {[key:string] : {current: boolean}}
  //  useRef(false)

  const plateType = useRef( init?.plateType ?? PlateType.Normal)
  const setPlateType= (newType:PlateType) =>{
    if(init?.onPlateTypeChange){
      init.onPlateTypeChange(newType)
    }
    plateType.current = newType
  }

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
    plateType, setPlateType
  }

}
type PortionViewAnimationState = ReturnType<typeof usePortionViewAnimationState>

// export const counts = [[""],["1/2","2/2"]]
export const allCounts = ["","1/2","2/2"]
export const sectionNames = ["Right","TopLeft","BottomLeft"]
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

  const componentsWeplate = useRef(null);
  const componentsNormal = useRef(null);
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
    plateType, setPlateType,
  } = props?.animationState ?? usePortionViewAnimationState({})
  
  const sectionDiscrete = {
    Right: rightDiscrete,
    TopLeft: topDiscrete,
    BottomLeft: bottomDiscrete,
  } as {[key: string]: typeof rightDiscrete}
  const sectionCategory = {
    Right: rightCategory,
    TopLeft: topCategory,
    BottomLeft: bottomCategory,
  } as {[key:string]: typeof rightCategory}
  const sectionTrackedAnimation = {
    Right: rightTrackedAnimation,
    TopLeft: topTrackedAnimation,
    BottomLeft: bottomTrackedAnimation,
  } as {[key :string]: typeof rightTrackedAnimation}
  const [animateCameraAngle,cameraAngleValue, cameraAngleTarg] = cameraAngleAnimation
  
  // const [animateRightSize,rightSizeValue,rightSizeTarg] = rightTrackedAnimation
  // const [animateTopLeftSize,topLeftSizeValue,topLeftSizeTarg] = topTrackedAnimation
  // const [animateBottomLeftSize,bottomLeftSizeValue,bottomLeftSizeTarg] = bottomTrackedAnimation

  // const [animateRightSizeOne,rightSizeValue,rightSizeTarg] = rightTrackedAnimation
  // const [animateTopLeftSizeOne,topLeftSizeValue,topLeftSizeTarg] = topTrackedAnimation
  // const [animateBottomLeftSizeOne,bottomLeftSizeValue,bottomLeftSizeTarg] = bottomTrackedAnimation
  
  const [animateCentralize,centralizeValue,centralizeTarg] = centralizeTrackedAnimation
  const emptyMaterial = useRef(null)
  const grainsIconMaterial = useRef(null)
  const proteinIconMaterial = useRef(null)
  const vegIconMaterial = useRef(null)
  function graphicMaterialOfCategory(category: FOOD_CATEGORY){
    if(category == FOOD_CATEGORY.Carbohydrates){
      // console.log("carbs")
      return grainsIconMaterial.current
    } 
    if(category == FOOD_CATEGORY.Protein){
      // console.log("protien")  
      return proteinIconMaterial.current
    } 
    if(category == FOOD_CATEGORY.Vegetable){
      // console.log("veg")
      return vegIconMaterial.current
    } 
    return emptyMaterial;
  }
  // // console.log({topCategory})
  const onTopCategoryChange = ()=>{
    console.log("Top category updated!",topCategory)
    if(topSquare.current){
      topSquare.current.material = graphicMaterialOfCategory(topCategory)
    }
    if(components.current){
      for(const count of allCounts){
        const color = colorOfCategory(topCategory,{"": 0, "1/2":0, "2/2":1}[count])
        components.current["TopLeft"+ count].material.color.setStyle(color)
        components.current["TopLeftDisc"+ count].material.color.setStyle(color)
      }
    }
  }
  useEffect(onTopCategoryChange,[topCategory,components.current,loaded])
  const onBottomCategoryChange = ()=>{
    if(bottomSquare.current){
      bottomSquare.current.material = graphicMaterialOfCategory(bottomCategory)
    }
    if(components.current){
      for(const count of allCounts){
        const color = colorOfCategory(bottomCategory,{"": 0, "1/2":0, "2/2":1}[count])
        components.current["BottomLeft"+count].material.color.setStyle(color)
        components.current["BottomLeftDisc"+count].material.color.setStyle(color)
      }
    }
  }
  useEffect(onBottomCategoryChange,[bottomCategory,components.current,loaded])
  const onRightCategoryChange = ()=>{
    if(rightSquare.current){
      rightSquare.current.material = graphicMaterialOfCategory(rightCategory)
    }
    if(components.current){
      for(const count of allCounts){
        const color = colorOfCategory(rightCategory,{"": 0, "1/2":0, "2/2":1}[count])
        components.current["Right"+count].material.color.setStyle(color)
        components.current["RightDisc"+count].material.color.setStyle(color)
      }
    }
  }
  useEffect(onRightCategoryChange,[rightCategory,components.current,loaded])
  const onPlateTypeChange = ()=>{
    const modelComponent = {
      [PlateType.Normal] : componentsNormal,
      [PlateType.Weplate]: componentsWeplate,
    }
    components.current = modelComponent[plateType.current].current
    onTopCategoryChange()
    onBottomCategoryChange()
    onRightCategoryChange()
  }
  useEffect(onPlateTypeChange,[plateType.current])

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
    const modelNormalAsset = Asset.fromModule(require('./assets/normalplate-v2.obj'))
    const modelWeplateAsset = Asset.fromModule(require('./assets/weplate-v7.obj'))
    const modelNormal = await loader.loadAsync(modelNormalAsset.uri)
    const modelWeplate = await loader.loadAsync(modelWeplateAsset.uri)
    // console.log(model)
    const textureLoader = new TextureLoader();


    const _displayGroup = new Group()
    
    
    function materialOfCategory(category: FOOD_CATEGORY, hidden = false){
      return new MeshLambertMaterial({ color: colorOfCategory(category),transparent:true,opacity: hidden ? 0 : 1})
    }
    function initComponents(_components){
      for(const section of sectionNames){
        for(const count of allCounts){
          _components[section+count].material =  materialOfCategory(rightCategory,); //red
          _components[section+"Disc"+count].material = materialOfCategory(rightCategory); //red
        }
        _components["Right"].material.opacity = 1.0
      }
      
      // for(const count of allCounts ){
      //   _components["TopLeft"+ count].material = materialOfCategory(topCategory)
      //   _components["TopLeftDisc"+ count].material = materialOfCategory(topCategory)
      // }
      // _components["TopLeft"].material.opacity = 1.0

      // for(const count of allCounts){
      //   _components["BottomLeft" + count].material =materialOfCategory(bottomCategory); //yellow
      //   _components["BottomLeftDisc" + count].material = materialOfCategory(bottomCategory)
      // }
      // _components["BottomLeft"].material.opacity = 1.0
      // new MeshLambertMaterial({color: colorOfCategory(bottomCategory),transparent:true,opacity:0}) //yellow

        _components["PlateBody"].material = new MeshLambertMaterial({color: 'silver',opacity:0.8, transparent: true,})
        _components["PlateBody"].renderOrder = 9
        // _components["Right"].scale.set(1,0.5,1);
    }
    {
      const modelWeplate_scale = 0.5
      modelWeplate.scale.set(modelWeplate_scale,modelWeplate_scale,modelWeplate_scale)
      modelWeplate.position.set(0,-0.2,0)
      // console.log(model.children[0].name)
      const _componentsWeplate = {}
      modelWeplate.children.forEach((object)=>{
        _componentsWeplate[object.name] = object
      })
      console.log({componentsWeplateKeys: Object.keys(_componentsWeplate)})
      initComponents(_componentsWeplate)
      componentsWeplate.current = _componentsWeplate

      _displayGroup.add(modelWeplate)
    }
    {
      const modelNormal_scale = 0.5
      modelNormal.scale.set(modelNormal_scale,modelNormal_scale,modelNormal_scale)
      modelNormal.position.set(0,0,0)
      // console.log(model.children[0].name)
      const _componentsNormal = {}
      modelNormal.children.forEach((object)=>{
        _componentsNormal[object.name] = object
      })
      initComponents(_componentsNormal)
      // console.log(Object.keys(_components))
      // _componentsNormal["Right"].material = new MeshLambertMaterial({ color: colorOfCategory(rightCategory),transparent:true,}); //red
      // _componentsNormal["BottomLeft"].material = new MeshLambertMaterial({color: colorOfCategory(bottomCategory),transparent:true,}) //yellow
      // _componentsNormal["TopLeft"].material = new MeshLambertMaterial({color: colorOfCategory(topCategory),transparent:true,}) //orange 
      // _componentsNormal["RightDisc"].material = new MeshLambertMaterial({ color: colorOfCategory(rightCategory),transparent:true,opacity:0}); //red
      // _componentsNormal["BottomLeftDisc"].material = new MeshLambertMaterial({color: colorOfCategory(bottomCategory),transparent:true,opacity:0}) //yellow
      // _componentsNormal["TopLeftDisc"].material = new MeshLambertMaterial({color: colorOfCategory(topCategory),transparent:true,opacity:0}) //orange 
      // _componentsNormal["PlateBody"].material = new MeshLambertMaterial({color: 'silver',opacity:0.8, transparent: true,})
      // _componentsNormal["PlateBody"].renderOrder = 9
      // _components["Right"].scale.set(1,0.5,1);

      componentsNormal.current = _componentsNormal

      _displayGroup.add(modelNormal)
    }

    const models = {
      [PlateType.Normal]: modelNormal,
      [PlateType.Weplate]: modelWeplate,
    } as {[key in PlateType]: Group}
    const modelComponent = {
      [PlateType.Normal] : componentsNormal,
      [PlateType.Weplate]: componentsWeplate,
    }

    components.current = modelComponent[plateType.current].current
    for(const model of Object.values(models)){
      model.visible = false;
    }
    models[plateType.current].visible = true;

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

    const sectionSquare = {
      Right: _rightSquare,
      TopLeft: _topSquare,
      BottomLeft: _bottomSquare,
    } as {[key: string]: typeof _rightSquare}


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
    
      for(const _plateType in models){
        models[_plateType].visible = _plateType === plateType.current;
      }
      //lerp opacity of box
      components.current["PlateBody"].material.opacity = 0.3
      // components.current["PlateBody"].material.opacity = lerp(0.3,0,centralizeValue.current)

      for(const section of sectionNames){
        for( const count of allCounts){
          const isSectionDiscrete = sectionDiscrete[section][count].current as boolean
          const [animate,value,targ] = sectionTrackedAnimation[section][count]
          components.current[section+ count].visible = value.current > 0 && !isSectionDiscrete
          components.current[section + "Disc"+ count].visible = value.current > 0 && isSectionDiscrete
          // if(){
          //   components
          // }
        }
      }
      // if(rightDiscrete?.current){
      //   for( const count of allCounts){
      //     components.current["Right"+ count].visible = false
      //     components.current["RightDisc"+ count].visible = true
      //   }
      // }else{
      //   for(const count of allCounts){
      //     components.current["Right"+ count].visible = true
      //     components.current["RightDisc" + count].visible = false
      //   }
      // }

      // components.current["Right"].material.opacity= rightSizeTarg.current == 0 ? 0 : lerp(0.93,1,centralizeValue.current)
      // components.current["RightDisc"].material.opacity= rightSizeTarg.current == 0 ? 0 : lerp(0.93,1,centralizeValue.current)

      // if(topDiscrete?.current){
      //   components.current["TopLeft"].visible = false
      //   components.current["TopLeftDisc"].visible = true
      // }else{
      //   components.current["TopLeft"].visible = true
      //   components.current["TopLeftDisc"].visible = false
      // }

      // components.current["TopLeft"].material.opacity = topLeftSizeTarg.current == 0 ? 0:  lerp(0.93,1,centralizeValue.current)
      // components.current["TopLeftDisc"].material.opacity = topLeftSizeTarg.current == 0 ? 0:  lerp(0.93,1,centralizeValue.current)

      // if(bottomDiscrete?.current){
      //   components.current["BottomLeft"].visible = false
      //   components.current["BottomLeftDisc"].visible = true
      // }else{
      //   components.current["BottomLeft"].visible = true
      //   components.current["BottomLeftDisc"].visible = false
      // }

      // components.current["BottomLeft"].material.opacity = bottomLeftSizeTarg.current == 0 ? 0 : lerp(0.93,1,centralizeValue.current)
      // components.current["BottomLeftDisc"].material.opacity = bottomLeftSizeTarg.current == 0 ? 0 : lerp(0.93,1,centralizeValue.current)

      const WALL_HEIGHT = {[PlateType.Weplate]: 1.2,[PlateType.Normal]: 0.8}[plateType.current]
      const sectionSquareScale = {
        Right:  {[PlateType.Weplate]:[ 1.0 ,1.0 ],[PlateType.Normal]: [ 1.0 , 1.0 ]} ,
        TopLeft: {[PlateType.Weplate]:[ 0.8 ,1.0 ],[PlateType.Normal]: [ 0.8 , 0.9 ]},
        BottomLeft:  {[PlateType.Weplate]:[ 0.8 ,1.0 ],[PlateType.Normal]: [ 0.8 , 0.9 ]} ,
      } as {[key:string]:{[key in PlateType]:[number,number]}}
      const sectionSquareOffset = {
        Right: {[PlateType.Weplate]: {x: 0.6,y: -0.2, z: 0}, [PlateType.Normal]: {x: 0.37,y: -0.0, z: 0}},
        TopLeft: {[PlateType.Weplate]: {x: -0.6, y: -0.2, z: -0.4}, [PlateType.Normal]: {x: -0.35, y: -0.0, z: -0.40}},
        BottomLeft: {[PlateType.Weplate]: {x:-0.6, y: -0.2, z: 0.4}, [PlateType.Normal]: {x:-0.35, y: -0.0, z: 0.4}},  
      } as {[key:string]:{[key in PlateType]:{x:number,y:number,z:number}}} 

      for(const section of sectionNames){
        
        let maxScale = -1;
        for(const count of allCounts){
          const [animate,value,targ] = sectionTrackedAnimation[section][count]
          let scale = value.current
          if(scale > 0 && scale > maxScale){
            maxScale = scale 
          }
          components.current[section + count].scale.set(1,scale,1)
          components.current[section + "Disc"+ count].scale.set(1,scale,1) 
        }
        if(maxScale > 0){
          const scale = maxScale
          const isDiscrete = sectionDiscrete[section][""].current
          const squareScale = sectionSquareScale[section][plateType.current][isDiscrete? 0: 1]
          const squareOffset = sectionSquareOffset[section][plateType.current]

          const square = sectionSquare[section]
          square.scale.set(squareScale,squareScale,squareScale)
          square.position.set(squareOffset.x,WALL_HEIGHT/2*scale + squareOffset.y +0.01,squareOffset.z)
        }
      }

      // {[PlateType.Weplate]:,[PlateType.Normal]: }[plateType.current]
      //set sizes of components
      // let rightScale = rightSizeValue.current
      // if(rightScale == 0) rightScale = 0.01 // prevent z fight
      // components.current["Right"].scale.set(1,rightScale,1)
      // components.current["RightDisc"].scale.set(1,rightScale,1)
      // const rightSquareOffset = {[PlateType.Weplate]: {x: 0.6,y: -0.2, z: 0}, [PlateType.Normal]: {x: 0.37,y: -0.0, z: 0}} [plateType.current]
      // _rightSquare.position.set(rightSquareOffset.x,WALL_HEIGHT/2*rightScale + rightSquareOffset.y +0.01,rightSquareOffset.z)

      // let topScale = topLeftSizeValue.current
      // if(topScale == 0) topScale = 0.01
      // components.current["TopLeft"].scale.set(1,topScale,1)
      // components.current["TopLeftDisc"].scale.set(1,topScale,1)
      // const topSquareScale = {[PlateType.Weplate]:topDiscrete.current ? 0.8 : 1.0,[PlateType.Normal]: topDiscrete.current ? 0.8 : 0.9}[plateType.current] 
      // _topSquare.scale.set(topSquareScale,topSquareScale,topSquareScale)
      // const topSquareOffset = {[PlateType.Weplate]: {x: -0.6, y: -0.2, z: -0.4}, [PlateType.Normal]: {x: -0.35, y: -0.0, z: -0.40}} [plateType.current] 
      // _topSquare.position.set(topSquareOffset.x,WALL_HEIGHT/2*topScale +topSquareOffset.y +0.01,topSquareOffset.z)

      // let bottomScale = bottomLeftSizeValue.current
      // if(bottomScale == 0 ) bottomScale = 0.01
      // components.current["BottomLeft"].scale.set(1,bottomScale,1)
      // components.current["BottomLeftDisc"].scale.set(1,bottomScale,1)
      // const bottomSquareSize =  {[PlateType.Weplate]:topDiscrete.current ? 0.8 : 1.0,[PlateType.Normal]: topDiscrete.current ? 0.8 : 0.9}[plateType.current] 
      // _bottomSquare.scale.set(bottomSquareSize,bottomSquareSize,bottomSquareSize)
      // const bottomSquareOffset = {[PlateType.Weplate]: {x:-0.6, y: -0.2, z: 0.4}, [PlateType.Normal]: {x:-0.35, y: -0.0, z: 0.4}} [plateType.current]  
      // _bottomSquare.position.set(bottomSquareOffset.x,WALL_HEIGHT/2*bottomScale +bottomSquareOffset.y +0.01,bottomSquareOffset.z)

      
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
  const ds = useDesignScheme()
  const baseView = 
  <View>
    
    <PanGestureHandler minDist={25} onGestureEvent = {onGestureEvent} onFailed = {onPanFail} onEnded = {onPanEnded}>
      <GLView
        onContextCreate={onContextCreate}
        // onTouchStart = {onTouchStart}
        style = {{width:size,height,...style}}
        />
    </PanGestureHandler>
    {/* <TouchableOpacity style = {{
            position:"absolute",
            width: 40,
            marginTop: "10%",
            height: "80%",
            backgroundColor:"orange",
          }} onPress= {()=>{
            
          }}>

    </TouchableOpacity> */}
    <TouchableOpacity style = {{
            position:"absolute",
            right: 0,
            width: 60,
            height: 60,
            backgroundColor: ds.colors.grayscale4,
            borderRadius: 5,
            opacity: 0.8,

            justifyContent: 'center',
            alignItems: "center",
          }} onPress= {()=>{
              if(!rotating){
                setRotating(true)
                animateCameraAngle(Math.PI/2,{duration:350}, (end1)=>{
                  if(end1.finished){
                    
                    const index = plateTypes.indexOf(plateType.current)
                    const nextIndex = (index + 1)%plateTypes.length;
                    const nextPlateType = plateTypes[nextIndex]
                    console.log({nextPlateType})
                    setPlateType(nextPlateType)
                    onPlateTypeChange()

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
            <SvgXml xml= { {[PlateType.Normal]:weplate_icon_svg, [PlateType.Weplate]:normalplate_icon_svg}[plateType.current]}/>
    </TouchableOpacity>
  </View>
  return baseView
}
export default PortionView