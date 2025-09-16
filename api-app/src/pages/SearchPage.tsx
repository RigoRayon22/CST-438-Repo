import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { debugDatabase } from '../db/database';

/** allow users to search by event name, location, date, category, and radius*/
export function SearchPage({ navigation }: any) {
    const [showDate, setShowDate] = useState(false);
    const [showRadius, setShowRadius] = useState(false);

    useEffect(() => {
        testDB();
      }, []);
    

    return (
        /* Event Name and Location always visible; Date, Category, and Radius collapsible */
        <View style={styles.container}>
            <Text style={styles.header}>Search all events:</Text>

            <Text>Event name:</Text>
            
            <TextInput style={styles.input} />

            {/* TO DO: add auto-fill for city names? */}

            <Text>Location:</Text>

            <TextInput style={styles.input} />

        {/* Collapsible Date */}
            <TouchableOpacity onPress={() => setShowDate(!showDate)}>
                <Text style={styles.collapsibleLabel}>Event date ▼</Text>
            </TouchableOpacity>
            {showDate && (
                <TextInput
                    placeholder="Enter date"
                    style={styles.input}
                />
            )}

        {/* Collapsible Category */}
            <Text style={styles.collapsibleLabel}>Category ▼</Text>
            <TextInput
                placeholder="(pick later from API categories)"
                style={styles.input}
            />

        {/* Collapsible Radius */}
            {/* TO DO: add slider ui for radius */}
            <TouchableOpacity onPress={() => setShowRadius(!showRadius)}>
                <Text style={styles.collapsibleLabel}>Radius ▼</Text>
            </TouchableOpacity>
            {showRadius && (
                <TextInput
                    placeholder="Miles willing to travel"
                    style={styles.input}
                />
            )}

            <Button
                title="Search"
                onPress={() => navigation.navigate('Results')}
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