// @flow
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity,Animated} from 'react-native';
import { useTrackedAnimation, useTrackedStateAnimation } from '../../PortionView';

import Button from './Button';

import styles from './style';

import type { Step } from './types';

type Props = {
  isFirstStep: boolean,
  isLastStep: boolean,
  handleNext: func,
  handlePrev: func,
  handleStop: func,
  currentStep: Step,
  labels: Object,
};

const Tooltip = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
  labels,
}: Props) => {
  const [animFill,fillValue,fillTarg,anim] = useTrackedStateAnimation(1) as any
  const [displayText,setDisplayText] = useState("");
  useEffect(()=>{
    Animated.sequence([
      Animated.timing(anim.current,{
        toValue:0,
        duration:0,
        useNativeDriver: false,
      }),
      // Animated.delay(300),
      Animated.timing(anim.current,{
        toValue:1,
        duration:600,
        useNativeDriver: false,
      }),
    ]).start()
    setDisplayText(currentStep?.text)
  },[currentStep]) 
  return <View>
    <View style={styles.tooltipContainer}>
      <Text testID="stepDescription" style={styles.tooltipText }>{displayText.substring(0,Math.floor((displayText.length)*fillValue))}</Text>
    </View>
    <View style={[styles.bottomBar]}>
      {
        !isLastStep ?
          <TouchableOpacity onPress={handleStop}>
            <Button>{labels.skip || 'Skip'}</Button>
          </TouchableOpacity>
          : null
      }
      {
        !isFirstStep ?
          <TouchableOpacity onPress={handlePrev}>
            <Button>{labels.previous || 'Previous'}</Button>
          </TouchableOpacity>
          : null
      }
      {
        !isLastStep ?
          <TouchableOpacity onPress={handleNext}>
            <Button>{labels.next || 'Next'}</Button>
          </TouchableOpacity> :
          <TouchableOpacity onPress={handleStop}>
            <Button>{labels.finish || 'Finish'}</Button>
          </TouchableOpacity>
      }
    </View>
  </View>
};

export default Tooltip;
