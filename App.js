import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList,ImageBackground, } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecastData, setForecastData] = useState([]);

  const getWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=95435d65d392e73961b46d9001d1df26&units=metric&lang=fr`
      );
      const json = await response.json();
      setCurrentWeather(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getForecastData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=95435d65d392e73961b46d9001d1df26&units=metric&lang=fr`
      );
      const json = await response.json();
      setForecastData(json.list);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location is required!');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        if (location.coords.latitude && location.coords.longitude) {
          await getWeatherData(location.coords.latitude, location.coords.longitude);
          await getForecastData(location.coords.latitude, location.coords.longitude);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getLocation();
  }, []);

  let text = 'Waiting...';

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  }

  const renderForecastItem = ({ item }) => (
  
    <View style={styles.forecastItem}>
      <Text style={styles.date}>{item.dt_txt}</Text>
      <Image style={styles.image} source={{ uri: `http://openweathermap.org/img/w/${item.weather[0].icon}.png` }} />
      <Text style={styles.itemDEG}>{Math.round(item.main.temp)}°C</Text>
      <Text style={styles.dateWither}>{item.weather[0].description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.contai}>Ma position actuelle</Text>
      <Text style={styles.paragraph}>{currentWeather.name}📍</Text>
      {currentWeather.weather && currentWeather.weather[0] && (
        <Image style={styles.image} source={{ uri: `http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png` }} />
      )}
      <Text style={styles.deg}>{Math.round (currentWeather.main && currentWeather.main.temp )}°C</Text>
        <Text style={styles.jouritem}>les prochain 5 jours</Text>
      
      <FlatList
        data={forecastData}
        keyExtractor={(item) => item.dt.toString()}
        renderItem={renderForecastItem}
        horizontal
      
        
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:100,
    flex: 1,
    backgroundColor: '#68DCDC',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  paragraph: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderRadius:4,
    padding:20,
  },
  image: {
    width: 100,
    height: 100,
  },
  forecastItem: {
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width:350,
    paddingTop:50,
    alignItems: 'center',
    margin: 30,
    borderRadius:4,
  backgroundColor:'#C0EBFF',
  },
  contai: {
    fontSize:35,
    fontWeight: 'bold',
    color:'#31002E',
    paddingBottom:5,    

  },
  jouritem:{
    fontSize:20,
    fontWeight: 'bold',
    color:'#31002E',
    paddingBottom:5, 
  },
  deg:{
    fontSize:100,
    fontWeight: 'bold',
    color:'#271C13',
    paddingBottom:5,
  },
  date:{
    fontSize:20,
    fontWeight: 'bold',
    color:'#000000',

  },
  dateWither:{
    color:'#000000',
    fontSize:20,
    margin:5,
    fontWeight: 'bold',

  },
  itemDEG:{
    color:'#000000',
    fontSize:20,
    margin:5,
    fontWeight: 'bold',
  }
  
});

