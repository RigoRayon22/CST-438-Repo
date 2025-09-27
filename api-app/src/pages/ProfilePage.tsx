import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Event } from '../../types';
import { EventItemComponent } from '../components/EventItem';
import { EventModal } from '../components/EventModal';
import { getSavedEventsForUser, removeSavedEventForUser } from '../db/database';
import { useUser } from '../contexts/UserContext';

/** user profile page showing saved events and "save the dates" feature */
export function ProfilePage() {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [dates, setDates] = useState<string[]>([]);
    const [newDate, setNewDate] = useState('');
    const [savedEvents, setSavedEvents] = useState<Event[]>([]);
    const { userId } = useUser();

    // Load saved events when component mounts or userId changes
    useEffect(() => {
        if (userId) {
            loadSavedEvents();
        }
    }, [userId]);

    const loadSavedEvents = async () => {
        if (!userId) return;
        
        try {
            const dbSavedEvents = await getSavedEventsForUser(userId);
            const events = dbSavedEvents.map((row: any) => row.event_data);
            setSavedEvents(events);
        } catch (error) {
            console.error('Error loading saved events:', error);
        }
    };

    const handleRemoveEvent = async (eventId: string) => {
        if (!userId) return;
        
        try {
            await removeSavedEventForUser(userId, eventId);
            loadSavedEvents(); // Reload the list
        } catch (error) {
            console.error('Error removing event:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header with settings icon */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Profile</Text>
                <TouchableOpacity>
                    {/* TO DO: add ability to change username/password or add user preferences here */}
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

        {/*saved events list*/}
            <Text style={styles.sectionTitle}>Your saved events:</Text>
            {savedEvents.length === 0 ? (
                <Text style={styles.emptyText}>No events saved yet</Text>
            ) : (
                <FlatList
                    data={savedEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            onPress={() => setSelectedEvent(item)}
                            onLongPress={() => handleRemoveEvent(item.id)}
                        >
                            {/*filters data into EventItemComponent for cleaner display*/}
                            <EventItemComponent event={item} />
                        </TouchableOpacity>
                    )}
                />
            )}

            <EventModal 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)}
                onEventSaved={() => loadSavedEvents()} // Reload when event is saved
            />

        {/*save the dates feature*/}
        {/*to do: change to date type instead of strings*/}
            <Text style={styles.sectionTitle}>Your save the dates:</Text>
            <Text style={styles.helperText}>Add dates you're free so we can recommend events</Text>

            <View style={styles.inputRow}>
                <TextInput
                    placeholder="Enter date"
                    value={newDate}
                    onChangeText={setNewDate}
                    style={styles.dateInput}
                />
                <Button
                    title="Add"
                    onPress={() => {
                        if (newDate) {
                            setDates([...dates, newDate]);
                            setNewDate('');
                        }
                    }}
                />
            </View>

    {/*display saved dates with delete option*/}
            {dates.map((date, index) => (
                <View key={index} style={styles.dateRow}>
                    <Text>{date}</Text>
                    <TouchableOpacity onPress={() => setDates(dates.filter((_, i) => i !== index))}>
                        <Text style={styles.deleteIcon}>❌</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    settingsIcon: {
        fontSize: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontStyle: 'italic',
        marginTop: 8,
    },
    helperText: {
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    dateInput: {
        flex: 1,
        borderWidth: 1,
        padding: 6,
        marginRight: 8,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    deleteIcon: {
        fontSize: 16,
    },
});