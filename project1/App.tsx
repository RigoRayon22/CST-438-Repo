import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';

const eventsTest = async () => {
  console.log('Searching for events...');
  
  try {

    const apiKey = 'inpfgwkvhXbhfbH7rzDYWGRmb7qXNr99'; //Our API Key
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&keyword=Zach Top&size=20` //API URL hardcoded temporarily right now returning and showing api works
    );
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Total Events Found:', data.page?.totalElements || 'None');
    console.log('-------------------');
    
    //checking if data was found
    if (data._embedded?.events) {
      data._embedded.events.forEach((event: any, i: number) => {
        console.log(`${i + 1}. ${event.name}`);
        console.log(`   Date: ${event.dates?.start?.localDate || 'TBA'}`);
        console.log(`   Venue: ${event._embedded?.venues?.[0]?.name || 'TBA'}`);
        console.log(`   City: ${event._embedded?.venues?.[0]?.city?.name || 'TBA'}`);
        console.log('---');
      });
    } else {
      console.log('No events found');
    }
    
    if (data.errors) {
      console.log('Errors:', data.errors);
    }
    
  } catch (error) {
    console.log('Error:', error);
  }
};

export default function App() {
  useEffect(() => {
    eventsTest();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Events Test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/*
Structure for API URL to return speific data

  ->https://app.ticketmaster.com/discovery/v2/events.json?apikey=YOUR_KEY&PARAMETERS

  Examples

  YOUR_KEY = Sports, Music, Other Artists, etc

  


*/