import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Event } from '../../types';
import { template } from '@babel/core';

// Props (inputs) for EventItemComponent: takes a single Event object to display
interface EventItemProps {
    event: Event;
}

/** Component for Search Result and Saved Event list event items. */
export function EventItemComponent({ event }: EventItemProps) {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.icon}>🎵</Text>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{event.name}</Text>
                <Text style={styles.details}>{event.date} • {event.city}</Text>
            </View>
            <Text style={styles.icon}>⭐</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        justifyContent: 'space-between',
    },
    icon: {
        flex: 1,
        marginLeft: 8,
    },
    textContainer: {
        flex: 1,
        marginLeft: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    details: {
        color: '#666',
        fontSize: 14,
    },
}); 