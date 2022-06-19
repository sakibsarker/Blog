import React,{useState,useEffect} from 'react'
import {View,Text,FlatList,StyleSheet,Modal} from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { globalStyles } from '../../urils/global'
import ModalView from '../../components/ModalView'
import Ionicons from 'react-native-vector-icons/Ionicons';
import BlogCard from '../../components/BlogCard'

export default function Home() {

  const [blogs,setBlogs]=useState([])
  const [modalOpen,setModalOPen]=useState(false)
  const [selectedCardId,setSelectedCardId]=useState([])

  function getBlogData() {
    firestore().collection('usersBlog')
    .doc(auth().currentUser.uid)
    .collection('blogs')
    .onSnapshot((quearySnapshot) => {
       const data = []
       quearySnapshot.forEach((documentSnapshot) => {
          data.push({
             ...documentSnapshot.data(),
             id: documentSnapshot.id
          })
       })
       setBlogs(data)
    })
 }

 useEffect(() => {
  getBlogData()
}, [])

function renderItem({ item }) {
  return(
     <BlogCard 
        blogData={item}
     />
  )
}

  return (
    <View style={globalStyles.primaryContainer}>
        <Modal
        visible={modalOpen}
        animationType='fade'
        transparent={true}
        >
          <ModalView
          />

        </Modal>
        <View style={styles.header}>
          <Text style={globalStyles.headingText}>My Blog</Text>
        </View>
        <Ionicons
        style={styles.addIcon}
         name="add-circle-sharp" 
         size={54}
         color='red'
         />
          <View style={{ alignItems: 'center' }}>
            <FlatList 
               data={blogs}
               keyExtractor={(item) => item.id}
               renderItem={renderItem}
            />
         </View>
    </View>
  )
}
const styles=StyleSheet.create({
  header:{
    marginHorizontal:10,
    marginVertical:10
  },
  addIcon:{
    position:'absolute',
    bottom:20,
    left:'45%'
  }
})