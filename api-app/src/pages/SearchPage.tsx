import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { debugDatabase } from '../db/database';

/** allow users to search by event name, location, date, category, and radius*/
export function SearchPage({ navigation }: any) {
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        testDB();
      }, []);
    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Search all events:</Text>

            <Text>Event Name:</Text>
            <TextInput
                style={styles.input}
                value={keyword}
                onChangeText={setKeyword}
                placeholder="Enter event name"
            />

            <Button
                title="Search"
                onPress={() => navigation.navigate("Results", { keyword })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        marginBottom: 12,
        padding: 6,
        borderRadius: 4,
    },
    collapsibleLabel: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
}); 


const testDB = async () => {
  const result = await debugDatabase();
  console.log('Database debug result:', result);
};