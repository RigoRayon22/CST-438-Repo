import React from 'react';
import { Modal, View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Event } from '../../types';

// Props (inputs) for EventModal: takes an Event (or null) and a function to close the modal
interface EventModalProps {
    event: Event | null;
    onClose: () => void;
}

/** modal component for event details (when event is clicked) */
export function EventModal({ event, onClose }: EventModalProps) {
    if (!event) return null;

    return (
        <Modal transparent={true} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeIcon}>✖</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{event.name}</Text>
                    <Text style={styles.details}>Date: {event.date}</Text>
                    <Text style={styles.details}>City: {event.city}</Text>
                    <Text style={styles.details}>Venue: TBD</Text>
                    <Text style={styles.details}>Performers: TBD</Text>
                    <Text style={styles.details}>Ticket URL: TBD</Text>
                    <Button title="⭐ Save Event" onPress={() => { }} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000088)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        width: '80%',
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    closeIcon: {
        fontSize: 18,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    details: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
    },
});