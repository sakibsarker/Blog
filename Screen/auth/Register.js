import React,{ useState, useEffect } from 'react'
import {View,TextInput,Image,StyleSheet, Button,Text,TouchableOpacity} from 'react-native'
import { globalStyles } from '../../urils/global'
import firestore from '@react-native-firebase/firestore'
import storage from'@react-native-firebase/storage'
import { launchCamera,launchImageLibrary } from 'react-native-image-picker'
import auth from '@react-native-firebase/auth'
import {initializeApp,firebase} from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBdYEIthAGzyOAhJ4UiJ3vJmqFIod1ug6Y",
  authDomain: "blog-app-8a0aa.firebaseapp.com",
  databaseURL: "https://blog-app-8a0aa-default-rtdb.firebaseio.com/",
  projectId: "blog-app-8a0aa",
  storageBucket: "blog-app-8a0aa.appspot.com",
  messagingSenderId:"461228782196",
  appId: "1:461228782196:android:a76a8496773967daefd721",
  //measurementId:"G-341F5YW4FQ",
};
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}
//firebase.initializeApp(firebaseConfig)
/*if (!firebase.apps.length) {
  firebase.initializeApp({});
}else {
  firebase.app(); 
}*/

export default function Register() {
  const[email, setEmail]=useState()
  const[password, setPassword]=useState()
  const[name, setName]=useState()
  const[displayPicture,setDisplayPicture]=useState()

  function onPickPicture(){
    launchImageLibrary({
      mediaType:'photo',
    },(data)=>setDisplayPicture(data.assets[0].uri) )
  }
  function onClickPicture(){
    launchCamera({
      mediaType:'photo',
    },(data)=>setDisplayPicture(data.assets[0].uri) )
  }

  async function onRegister(){
    if(!email && !password) {
      return
   }
   try {
      const { user: { uid } } = await auth().createUserWithEmailAndPassword(email, password)
      
      let downloadURL = null
      if(displayPicture) {
         const spiltPath = displayPicture.split('/')
         const imageName = spiltPath[spiltPath.length - 1]
         const reference = storage().ref(`${uid}/images/${imageName}`)
         const data = await reference.putFile(displayPicture)
         downloadURL = await storage().ref(data.metadata.fullPath).getDownloadURL()
      }

      firestore().collection('users')
      .doc(uid)
      .set({
         email,
         name,
         displayPicture: downloadURL
      })
      .then(() => console.log('Done'))
   } catch(error) {
      console.log(error)
   }
  }

  return (
    <View style={styles.container}>
        <Image
        source={{uri:!displayPicture?null:displayPicture}}
        style={styles.displayPicture}
        />
        <View style={styles.touchableContainer}>
          <TouchableOpacity onPress={onPickPicture}>
          <Text>Gallary</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClickPicture}>
          <Text>Camera</Text>
          </TouchableOpacity>
          
        </View>
        <TextInput
        value={name}
        placeholder='Name'
        style={globalStyles.primaryInput}
        onChangeText={(text)=>setName(text)}
        />
        <TextInput
        value={email}
        placeholder='Email'
        style={globalStyles.primaryInput}
        onChangeText={(text)=>setEmail(text)}
        />
        <TextInput
        value={password}
        placeholder='Password'
        style={globalStyles.primaryInput}
        onChangeText={(text)=>setPassword(text)}
        />
        <Button
        title='Register'
        onPress={onRegister}
        />
    </View>
  )
}

const styles=StyleSheet.create({
  container:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
    flex:1

  },
  touchableContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'50%'
  },
  displayPicture:{
    width:60,
    height:60,
    borderRadius:35,
    backgroundColor:'gray'
  }
})
