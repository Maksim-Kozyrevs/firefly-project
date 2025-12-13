import React from "react";
import { TurboModuleRegistry, View } from "react-native";
import { BlurView } from "expo-blur"; 

import { MenuStyle } from "./stylesheet/menurStyle";



function Menu() {
  const testIs = true;

  return (
      <BlurView
        style={MenuStyle.Menu}
        intensity={20}
        tint="default"
      >
        <View style={MenuStyle.navBtn} >
          
        </View>
      </BlurView>
  );

}



export default Menu;
